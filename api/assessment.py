"""HeatShield Renter assessment API.

FastAPI serverless endpoints for saving and retrieving heat assessments.
"""

import os
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

VALID_DWELLING = {"Apartment", "Townhouse", "House"}
VALID_ROOM = {"Bedroom", "Living room", "Kitchen"}


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException) -> JSONResponse:
    """Retain the API's existing error response format."""
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


def _database_settings() -> tuple[str, dict[str, str]]:
    """Build server-only Supabase settings without exposing credentials."""
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SECRET_KEY")

    if not supabase_url or not supabase_key:
        raise HTTPException(status_code=500, detail="Database configuration is unavailable.")

    return (
        f"{supabase_url.rstrip('/')}/rest/v1/heat_assessments",
        {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
        },
    )


async def _verified_user(request: Request) -> tuple[str, str]:
    """Return the authenticated Supabase user's ID and email."""
    authorization = request.headers.get("Authorization", "")
    scheme, _, access_token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not access_token:
        raise HTTPException(status_code=401, detail="Authentication is required.")

    supabase_url = os.environ.get("SUPABASE_URL")
    publishable_key = os.environ.get("SUPABASE_PUBLISHABLE_KEY")
    if not supabase_url or not publishable_key:
        raise HTTPException(status_code=500, detail="Authentication configuration is unavailable.")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{supabase_url.rstrip('/')}/auth/v1/user",
                headers={
                    "apikey": publishable_key,
                    "Authorization": f"Bearer {access_token}",
                },
            )
    except httpx.HTTPError as exc:
        print(f"Supabase authentication verification failed: {type(exc).__name__}")
        raise HTTPException(status_code=401, detail="Authentication is invalid or expired.") from None

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Authentication is invalid or expired.")

    try:
        user = response.json()
        user_id = user["id"]
        email = user["email"]
    except (ValueError, KeyError, TypeError):
        raise HTTPException(status_code=401, detail="Authentication is invalid or expired.") from None

    if not isinstance(user_id, str) or not isinstance(email, str):
        raise HTTPException(status_code=401, detail="Authentication is invalid or expired.")

    return user_id, email


def _validate(data: Any) -> str | None:
    """Return an error message string, or None if valid."""
    if not isinstance(data, dict):
        return "Invalid JSON body."

    if data.get("dwelling_type") not in VALID_DWELLING:
        return "Invalid or missing dwelling_type."

    if data.get("room_type") not in VALID_ROOM:
        return "Invalid or missing room_type."

    if not isinstance(data.get("area"), str) or not data["area"].strip():
        return "Invalid or missing area."

    if data["dwelling_type"] == "Apartment":
        floor_position = data.get("floor_position")
        if not isinstance(floor_position, str) or not floor_position.strip():
            return "floor_position is required for Apartment."

    if not isinstance(data.get("assessment_data"), dict):
        return "assessment_data must be a JSON object."

    score = data.get("heat_score")
    if not isinstance(score, int) or isinstance(score, bool) or not (0 <= score <= 100):
        return "heat_score must be an integer between 0 and 100."

    if not isinstance(data.get("selected_actions"), list):
        return "selected_actions must be a JSON array."

    return None


@app.post("/api/assessment", status_code=201)
async def create_assessment(request: Request) -> dict[str, Any]:
    """Save an assessment in the existing heat_assessments table."""
    user_id, email = await _verified_user(request)

    try:
        body = await request.json()
    except (ValueError, UnicodeDecodeError):
        raise HTTPException(status_code=400, detail="Invalid JSON body.") from None

    error = _validate(body)
    if error:
        raise HTTPException(status_code=400, detail=error)

    table_url, headers = _database_settings()
    row = {
        "user_id": user_id,
        "email": email,
        "dwelling_type": body["dwelling_type"],
        "room_type": body["room_type"],
        "area": body["area"],
        "floor_position": body.get("floor_position"),
        "assessment_data": body["assessment_data"],
        "heat_score": body["heat_score"],
        "selected_actions": body["selected_actions"],
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                table_url,
                headers={**headers, "Prefer": "return=representation"},
                json=row,
            )
    except httpx.HTTPError as exc:
        print(f"Supabase POST failed: {type(exc).__name__}")
        raise HTTPException(status_code=500, detail="Failed to reach database.") from None

    if response.status_code not in (200, 201):
        raise HTTPException(status_code=500, detail="Database insert failed.")

    try:
        data = response.json()
        inserted_id = data[0]["id"] if isinstance(data, list) and data else data.get("id")
    except (ValueError, AttributeError, IndexError, KeyError):
        raise HTTPException(status_code=500, detail="Database insert failed.") from None

    return {"id": inserted_id}


@app.get("/api/assessment")
async def get_assessment(request: Request, id: str | None = Query(default=None)) -> Any:
    """Retrieve one stored assessment or a user's previous assessments."""
    user_id, _ = await _verified_user(request)

    table_url, headers = _database_settings()
    params = {
        "user_id": f"eq.{user_id}",
        "select": "id,created_at,dwelling_type,room_type,area,floor_position,assessment_data,heat_score,selected_actions",
    }

    if id is None:
        params.update({"order": "created_at.desc", "limit": "50"})
    else:
        try:
            assessment_id = int(id)
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="id must be an integer.") from None
        params["id"] = f"eq.{assessment_id}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                table_url,
                headers=headers,
                params=params,
            )
    except httpx.HTTPError as exc:
        print(f"Supabase GET failed: {type(exc).__name__}")
        raise HTTPException(status_code=500, detail="Failed to reach database.") from None

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Database query failed.")

    try:
        rows = response.json()
    except ValueError:
        raise HTTPException(status_code=500, detail="Database query failed.") from None

    if id is None:
        return rows

    if not rows:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    return rows[0]
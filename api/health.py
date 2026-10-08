"""HeatShield Renter health API."""

from fastapi import FastAPI

app = FastAPI()


@app.get("/api/health")
async def health() -> dict[str, str]:
    """Return a minimal liveness response without configuration details."""
    return {"status": "ok"}
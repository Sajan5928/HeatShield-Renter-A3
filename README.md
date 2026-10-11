# HeatShield Renter – BUS4012 Assignment 03

HeatShield Renter helps Victorian renters assess room overheating risks and receive practical, renter-friendly recommendations. Users complete a short Heat Check, receive an educational Heat Vulnerability Score, choose actions for a personal Heat Plan, and can review previously saved assessments.

> **Important:** HeatShield Renter is an educational MVP. Its score and recommendations are based on self-reported information and simple rules; they are not professional building, health, energy-efficiency, or legal advice.

## Live Application

https://heatshield-renter-a3-ahuk.vercel.app

## GitHub Repository

https://github.com/Sajan5928/HeatShield-Renter-A3

## Technology Stack

- **Frontend:** React, TypeScript, Vite and React Router
- **Backend API:** Python, FastAPI and HTTPX
- **Authentication:** Supabase Authentication
- **Database:** Supabase PostgreSQL (`heat_assessments`, accessed through Supabase REST)
- **Hosting:** Vercel

## Features

- Email/password account creation and sign-in through Supabase Authentication
- Persistent authenticated sessions and sign-out
- Guided room assessment for dwelling, room type, floor level where applicable, and broad area
- Heat experience questions covering sunlight, shading, ventilation, discomfort, and cooling methods
- Heat Vulnerability Score with main heat drivers
- Renter-friendly, prioritised action recommendations
- **My Heat Plan** for selected recommendations
- Authenticated assessment saving through the Python API
- **My Previous Assessments** for viewing up to 50 saved assessments belonging to the signed-in user
- Owner-scoped retrieval so users cannot retrieve another user's assessment records

## System Architecture

```text
React + Vite frontend
        |
        | Supabase session access token (Bearer token)
        v
FastAPI assessment API
        |
        | verifies token with Supabase Auth
        | uses the verified user ID for storage and retrieval
        v
Supabase Auth + Supabase PostgreSQL
```

React uses Supabase for authentication/session management. Assessment records are saved and retrieved through FastAPI rather than directly from React to the database. The API verifies the supplied Bearer token with Supabase Auth and derives the trusted user ID from that verified response.

## Project Folder Structure

```text
HeatShield-Renter-MVP/
├── api/
│   ├── assessment.py              # FastAPI assessment save/retrieval API
│   ├── health.py                  # FastAPI health endpoint module
│   └── requirements.txt           # Python dependencies
├── public/                        # Static frontend assets
├── src/
│   ├── components/                # Reusable UI components
│   │   └── ui/accordion.tsx
│   ├── data/                      # Assessment options and action data
│   ├── lib/
│   │   └── supabase.ts            # Supabase Auth client setup
│   ├── pages/                     # Route-level React pages
│   │   ├── LoginPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── AboutRoomPage.tsx
│   │   ├── RoomAssessmentPage.tsx
│   │   ├── HeatExperiencePage.tsx
│   │   ├── HeatScorePage.tsx
│   │   ├── ActionPlanPage.tsx
│   │   ├── MyPlanPage.tsx
│   │   └── PreviousAssessmentsPage.tsx
│   ├── styles/                    # Design tokens and global/component styles
│   ├── types/assessment.ts        # TypeScript assessment models
│   ├── utils/                     # Score and recommendation logic
│   ├── App.tsx                    # App state, routes and auth/session lifecycle
│   └── main.tsx                   # React/Vite entry point
├── .env.example                   # Safe environment-variable template
├── .gitignore                     # Git exclusions for local environment files
├── package.json                   # Frontend scripts and dependencies
├── vercel.json                    # Vercel rewrites and SPA fallback
└── vite.config.ts                 # Vite configuration
```

## Local Installation and Setup

### Prerequisites

- Node.js and npm
- Python 3.11 or a compatible Python environment
- A Supabase project configured for Authentication and the `heat_assessments` table

### 1. Install frontend dependencies

From the project root:

```bash
npm install
```

### 2. Install Python dependencies

```bash
python -m pip install -r api/requirements.txt
```

### 3. Configure local environment variables

Copy the supplied template and fill in your own project values:

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

Do not commit `.env.local`.

### 4. Start the FastAPI assessment API

Run this from the project root:

```bash
python -m uvicorn api.assessment:app --host 127.0.0.1 --port 8001 --env-file .env.local
```

The assessment API is available locally at:

```text
http://127.0.0.1:8001
```

### 5. Start the React/Vite frontend

In a second terminal at the project root:

```bash
npm run dev
```

Vite normally serves the app at:

```text
http://localhost:5173
```

If Vite chooses another port, use the URL it prints in the terminal. The API allows the local Vite origins on ports `5173`, `5174`, and `5175` for both `localhost` and `127.0.0.1`.

### Useful frontend commands

```bash
npm run build
npm run lint
npm run preview
```

## Environment Variables

Use `.env.example` as the variable-name template. Do not place secret values in frontend code, `VITE_*` variables, committed files, screenshots, or documentation.

| Variable | Used by | Purpose |
|---|---|---|
| `SUPABASE_URL` | Python API | Base URL for Supabase Auth and REST requests. |
| `SUPABASE_PUBLISHABLE_KEY` | Python API | Used to verify incoming access tokens with Supabase Auth. |
| `SUPABASE_SECRET_KEY` | Python API only | Server-side key used for database REST requests. Never expose it to React or give it a `VITE_*` name. |
| `VITE_SUPABASE_URL` | React/Vite frontend | Supabase project URL for the browser authentication client. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | React/Vite frontend | Browser-safe key for the Supabase authentication client. |
| `VITE_API_BASE_URL` | React/Vite frontend | API base URL; local development targets the API on port `8001`, while production can use same-origin `/api`. |
| `APP_BASE_URL` | Environment template | Documents the local application/API base address; it is not read by the current frontend or assessment API source. |
| `DATABASE_URL` | Environment template | Reserved database connection setting; it is not read by the current frontend or assessment API source. |

## Python API Endpoints

Assessment endpoints require an `Authorization: Bearer <Supabase access token>` header. The backend verifies the token before using the authenticated user ID.

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `POST` | `/api/assessment` | Required | Validates and saves an assessment. The API stores the verified user ID and email instead of trusting browser-submitted identity fields. Returns `201` with the created assessment ID. |
| `GET` | `/api/assessment?id=<id>` | Required | Retrieves one assessment only when its ID belongs to the verified user. Returns `404` when absent or owned by another user. |
| `GET` | `/api/assessment` | Required | Returns up to 50 assessments for the verified user, ordered by `created_at` descending. Returns `[]` when there are no records. |
| `GET` | `/api/health` | Not required | Returns a minimal health response from `api/health.py`. |

### Local health endpoint note

`api/assessment.py` and `api/health.py` are separate FastAPI application modules. The assessment command above serves `api.assessment:app`. To test the health module locally, run it separately:

```bash
python -m uvicorn api.health:app --host 127.0.0.1 --port 8002
```

The local health endpoint is then available at `http://127.0.0.1:8002/api/health`. In Vercel, the `api/health.py` serverless function is exposed through `/api/health`.

## Security

- `.env` and `.env.*` files are ignored by Git, while `.env.example` remains trackable as a value-free template.
- `SUPABASE_SECRET_KEY` is read only by `api/assessment.py`; it is not referenced by React source or any `VITE_*` variable.
- The browser sends the current Supabase access token only in an `Authorization` header for protected API requests.
- The backend verifies each token with Supabase Auth instead of trusting a browser-submitted user ID or email.
- New assessment rows receive the verified user ID and email on the server.
- Assessment retrieval filters by the verified `user_id`; another user's ID returns `404`.
- Assessment-list results return only display-required fields rather than owner identifiers.

## Cloud Deployment

The application is configured for Vercel deployment.

- `vercel.json` rewrites `/api/assessment` to the Python assessment function and `/api/health` to the health function.
- A final catch-all rewrite serves `index.html` to support client-side React Router navigation.
- The frontend defaults to `/api` when `VITE_API_BASE_URL` is not supplied, enabling same-origin production API requests.
- Configure production environment variables in Vercel project settings. Keep `SUPABASE_SECRET_KEY` server-side; expose only intended browser-safe Vite variables to the frontend build.
- GitHub integration can deploy the connected repository to Vercel. Review environment variables and test protected save/retrieval flows after deployment.

## Verification Checklist

Before submitting or deploying changes:

```bash
npm run build
npm run lint
python -m py_compile api/assessment.py
```

Then manually verify that a signed-in user can save an assessment, view it in **My Previous Assessments**, and cannot access another user's records.
```

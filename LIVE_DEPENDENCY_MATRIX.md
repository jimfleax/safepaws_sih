# Live Dependency Matrix

## P6 (Database & Backend)
- **Runtime State**: BLOCKED. FastAPI crashes on any database-reliant endpoint.
- **Database State**: PostgreSQL + PostGIS is offline. Docker is unavailable. Native portable installation blocked by OSGeo download timeouts for PostGIS binaries.
- **Migration State**: BLOCKED. `alembic upgrade head` cannot be run without a live PostgreSQL instance.
- **Backend State**: Uvicorn starts successfully, but all DB DI dependencies fail on execution (`[WinError 1225] Connection refused`).

## P7 (Scientific Integrity & Documentation)
- **Documentation State**: `DEMO_RUNBOOK.md` updated with exact startup sequence, acknowledging the manual PostGIS setup requirement.
- **Scientific State**: Explicit Demonstrator / Prototype Mode indicator verified. No fake metrics are being exposed or calculated.
- **Demo Runbook State**: Up-to-date and tracks the controlled deterministic scaffold for the demo.
- **Demo Checklist State**: Up-to-date with explicit pass/fail gates.

## P8 (Frontend & Browser Test)
- **Frontend State**: Vite server starts successfully. M0 local storage/mock fallbacks are disabled.
- **Browser Test State**: BLOCKED. The E2E integration verification requires the backend to successfully fulfill API requests, which is blocked by the database runtime failure.

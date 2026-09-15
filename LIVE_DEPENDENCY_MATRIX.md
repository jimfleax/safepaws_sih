# Live Dependency Matrix

## P6 (Database & Backend)
- **Runtime State**: SUCCESS. FastAPI is running on `localhost:8000`.
- **Database State**: SUCCESS. PostgreSQL + PostGIS is running natively. Process instability fixed by detaching from Job Objects using WMI.
- **Migration State**: SUCCESS. `alembic upgrade head` runs properly.
- **Backend State**: SUCCESS. API responds to real requests (e.g. `200 OK` on `/api/v1/pets/register`). Validation schemas verified.

## P7 (Scientific Integrity & Documentation)
- **Documentation State**: SUCCESS. `codebase_documentation.md`, `DEMO_RUNBOOK.md` updated with architecture maps and runtime expectations.
- **Scientific State**: SUCCESS. Explicit Demonstrator / Prototype Mode indicator verified. No fake metrics are being exposed or calculated. Model stubs correctly simulate deterministic behavior based on appended file bytes.
- **Demo Runbook State**: Up-to-date and tracks the controlled deterministic scaffold for the demo.
- **Demo Checklist State**: Up-to-date.

## P8 (Frontend & Browser Test)
- **Frontend State**: SUCCESS. Vite server starts successfully, file watcher ignored `pgsql_bin` to prevent extreme HMR CPU usage.
- **Browser Test State**: SUCCESS. Playwright E2E (`Happy Path: Register -> Enroll -> Identify -> Sighting`, and negative tests) passed! Selectors and modal timeout issues resolved. No mocks are used in the frontend; it relies on the real backend API.

**STATUS: DEMO LOCKED 🔒**

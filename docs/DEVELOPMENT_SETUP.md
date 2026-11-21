# SafePaws Developer Setup & Operations Guide

**Document Status:** Verified Repository Baseline  
**Branch:** `frontend`  
**HEAD:** `57e63848ed48c275a97d180e4d094f3077ff00df`  
**Last Updated:** November 21, 2026  

---

## 1. Environment Configurations & `.env` Architecture

SafePaws uses decoupled configuration across its frontend and backend services.

### Backend Configuration (`backend/.env`)

The backend uses Pydantic Settings ([backend/app/core/config.py](file:///home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih/backend/app/core/config.py)) to load environment variables from `backend/.env`.

```bash
# Template: backend/.env.example
PROJECT_NAME="SafePaws API"
VERSION="0.1.0"
API_V1_STR="/api/v1"
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
DEBUG="True"

# SQLite Development Toggle (Optional):
# Setting USE_SQLITE_DEV=True bypasses PostgreSQL and uses local SQLite
USE_SQLITE_DEV=False
```

**Loading & Precedence Rules:**
1. **Pydantic Model Config:** Configured with `SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")`. The file must be named `.env` and reside in the current working directory from which `uvicorn` is executed (`backend/`).
2. **Database URL Resolution:** The property `effective_database_url` checks `USE_SQLITE_DEV`:
   - If `USE_SQLITE_DEV=True`, it returns `sqlite+aiosqlite:///./safepaws_dev.db`.
   - If `USE_SQLITE_DEV=False`, it returns `DATABASE_URL` (pointing to PostgreSQL).
3. **Threshold Placeholders:** `MATCH_THRESHOLD` (0.85) and `AMBIGUOUS_THRESHOLD` (0.70) are provisional placeholders for development.

### Frontend Configuration (`frontend/.env.example`)

The frontend uses Vite environment variables prefixed with `VITE_` or deployment-injected runtime variables (e.g. `GEMINI_API_KEY`, `APP_URL`).

---

## 2. Developer Workflow Commands

> [!NOTE]
> The commands below are classified into **[VERIFIED / TESTED]** (executed and verified functional in the environment) and **[INSPECTED]** (derived from `package.json`, project scripts, and docs, intended for the designated host OS).

### Frontend Development

#### [INSPECTED — Windows Host Target]
The primary frontend development target is Windows, where `@rollup/rollup-win32-x64-msvc` matches the operating system architecture:
```powershell
cd frontend
npm run dev
# Starts Vite on port 3000 (host: 0.0.0.0) -> http://localhost:3000
```

#### [VERIFIED / TESTED — Linux Agent Environment]
- **Tested & Verified:** Playwright automated testing using system Google Chrome:
  ```bash
  # Verified command executing Playwright headlessly with system Google Chrome:
  NODE_PATH=node_modules node -e "const { chromium } = require('playwright'); (async () => { const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable', headless: true, args: ['--no-sandbox'] }); console.log('Chrome launched successfully'); await browser.close(); })();"
  ```
- **Known Blocker Tested:** Running `./node_modules/.bin/vite` directly inside this Linux container was tested and failed with:
  `Error: Cannot find module @rollup/rollup-linux-x64-gnu`  
  *Root Cause:* Dependencies were installed in a Windows environment. Rollup requires an optional platform-specific native binary that is absent for Linux x64.
  *Safe Resolution:* Run the frontend on the Windows host, or in a Docker container built with Linux dependencies. Do NOT run broad `npm install` without authorization.

---

### Backend API Development

#### Option A: Zero-Setup SQLite Mode [INSPECTED]
Allows instant API development without running PostgreSQL or PostGIS:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ..\docs\requirements-windows-venv-manifest.txt

# Run with SQLite
$env:USE_SQLITE_DEV="True"
uvicorn app.main:app --reload --port 8000
# OpenAPI Docs: http://localhost:8000/docs
```

#### Option B: Containerized PostGIS Mode [INSPECTED]
```powershell
cd scripts\deployment
docker compose up -d

cd ..\..\backend
uvicorn app.main:app --reload --port 8000
```

#### Running Tests [INSPECTED]
```powershell
cd backend
pytest tests/
```

---

## 3. Database & Port Considerations

### Potential Port 5432 Configuration Conflict
- The local Windows PostgreSQL cluster (`pgsql_data/`) listens on port `5432`.
- [scripts/deployment/docker-compose.yml](file:///home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih/scripts/deployment/docker-compose.yml) publishes port `5432:5432`.
- **Potential Conflict:** If a local PostgreSQL daemon is already running on port 5432, running `docker compose up -d` will fail with a port binding conflict.
- **Port 5433 Mapping Architecture:** When remapping Docker to `5433:5432`, ensure:
  1. `docker-compose.yml` maps `"5433:5432"`.
  2. `backend/.env` sets `DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5433/safepaws"`.
  3. The 14 standalone scripts in `backend/` that hardcode `:5432` are refactored to read from `settings.DATABASE_URL`.

---

## 4. Git Safety Restrictions & Manual Integration

- **Preventing Staging Traps:** `.vscode/settings.json` is configured with `"git.enableSmartCommit": false`. Always stage files intentionally per workstream.
- **Hook Safeguards:** `.git/hooks/pre-commit` and `.git/hooks/pre-push` actively block unauthorized automation with `exit 1`.
- **Sync Watcher Inactive:** [scripts/sync_and_merge.ps1](file:///home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih/scripts/sync_and_merge.ps1#L12) contains an active `break` safeguard at line 12. Do NOT run automated commit loops.

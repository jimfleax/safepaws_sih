# SafePaws Demo Startup Script
# Run this from the safepaws_sih/ root each time you start the demo machine.

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot

$pgBin  = "$Root\pgsql_bin\pgsql\bin"
$pgData = "$Root\pgsql_data"

# 1 ── Start PostgreSQL if not already running ─────────────────────────────────
$running = & "$pgBin\pg_ctl.exe" -D $pgData status 2>&1
if ($running -match "server is running") {
    Write-Host "[DB]  PostgreSQL already running." -ForegroundColor Green
} else {
    Write-Host "[DB]  Starting PostgreSQL..." -ForegroundColor Cyan
    # Use WMI to completely detach the process from the current Job Object
    $cmd = "`"$pgBin\pg_ctl.exe`" -D `"$pgData`" -l `"$pgData\logfile`" start"
    Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $cmd | Out-Null
    Start-Sleep -Seconds 3
    Write-Host "[DB]  PostgreSQL started." -ForegroundColor Green
}

# 2 ── Run migrations (idempotent) ────────────────────────────────────────────
Write-Host "[Migration] Running alembic upgrade head..." -ForegroundColor Cyan
Push-Location "$Root\backend"
alembic upgrade head
Pop-Location
Write-Host "[Migration] Done." -ForegroundColor Green

# 3 ── Start FastAPI backend ──────────────────────────────────────────────────
Write-Host "[Backend] Starting FastAPI on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" `
    -ArgumentList "-NoExit", "-Command", "cd `"$Root\backend`"; & `"$Root\.venv\Scripts\python.exe`" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

Start-Sleep -Seconds 2
Write-Host "[Backend] FastAPI started." -ForegroundColor Green

# 4 ── Start React frontend ───────────────────────────────────────────────────
Write-Host "[Frontend] Starting Vite on http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" `
    -ArgumentList "-NoExit", "-Command", "cd `"$Root`"; npm run dev"

Write-Host ""
Write-Host "====================================" -ForegroundColor Yellow
Write-Host " SafePaws Demo is RUNNING" -ForegroundColor Yellow
Write-Host "  DB:        localhost:5432/safepaws" -ForegroundColor Yellow
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow

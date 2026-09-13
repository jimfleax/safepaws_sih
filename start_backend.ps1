Write-Host "SafePaws Backend Startup Script"
Write-Host "==============================="
Write-Host ""
Write-Host "1. Verifying PostgreSQL Connection..."
$dbUp = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 5432)
    $tcp.Close()
    $dbUp = $true
    Write-Host "PostgreSQL is reachable!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: PostgreSQL is not reachable on 127.0.0.1:5432" -ForegroundColor Yellow
    Write-Host "The backend will start, but database operations will return 503 Service Unavailable." -ForegroundColor Yellow
}

if ($dbUp) {
    Write-Host "2. Running Alembic Migrations..."
    cd backend
    alembic upgrade head
    cd ..
}

Write-Host "3. Starting FastAPI Backend..."
cd backend
python -m uvicorn app.main:app --reload

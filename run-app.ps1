# Start TerbitTravel Full Application
Write-Host "Starting TerbitTravel Full Application..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

Write-Host "Fixing CORS settings..." -ForegroundColor Yellow
Set-Location $backendDir
npm run cors-fix

Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; npm run dev"

Write-Host "Starting tunnel..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; npm run tunnel"

Write-Host "Starting frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm run dev"

Write-Host "Application started successfully!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Tunnel: Check tunnel window for the URL" -ForegroundColor Cyan
Write-Host "Use Ctrl+C in each window to exit separately" -ForegroundColor Yellow

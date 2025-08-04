# Start TerbitTravel Application
Write-Host "Starting TerbitTravel Application..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "Fixing CORS settings..." -ForegroundColor Yellow
npm run cors-fix

Write-Host "Starting server and tunnel..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command npm run dev"
Start-Process powershell -ArgumentList "-Command npm run tunnel"

Write-Host "Application started!" -ForegroundColor Green
Write-Host "Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Use Ctrl+C in each window to exit separately" -ForegroundColor Yellow

@echo off
echo ===================================================
echo TERBIT TRAVEL - RESTART DEV ENVIRONMENT WITH CORS FIX
echo ===================================================

:: Stop running processes
echo [1/4] Stopping existing processes...
taskkill /F /IM node.exe /T > nul 2>&1
echo.

:: Run CORS Debug Script
echo [2/4] Checking CORS configuration...
cd backend
node scripts/debug-cors.js
echo.

:: Start backend with updated settings
echo [3/4] Starting backend with updated CORS settings...
start "TerbitTravel Backend" cmd /c "cd backend && npm start"
echo.
timeout /t 5 > nul

:: Start frontend
echo [4/4] Starting frontend...
start "TerbitTravel Frontend" cmd /c "cd frontend && npm run dev"
echo.

echo ===================================================
echo All services restarted with CORS fixes!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================

pause

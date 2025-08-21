@echo off
echo Starting TerbitTravel Development Environment...
echo ================================================

echo.
echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd /d backend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo [2/3] Starting Frontend Dev Server...
start "Frontend Server" cmd /k "cd /d frontend && npm run dev -- --host localhost --port 5173"

timeout /t 3 /nobreak > nul

echo.
echo [3/3] Starting Localtunnel...
start "Localtunnel" cmd /k "cd /d backend && npm run tunnel"

echo.
echo ================================================
echo All services started successfully!
echo.
echo Backend:   http://localhost:5000
echo Frontend:  http://localhost:5173 (NOT 127.0.0.1)
echo Tunnel:    Check tunnel window for URL
echo.
echo Press any key to exit this launcher...
pause > nul

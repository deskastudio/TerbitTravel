@echo off
echo Starting TerbitTravel Full Application...
echo =========================================

echo Fixing CORS settings...
cd backend
call npm run cors-fix

echo Starting backend server...
start cmd /k "cd backend && npm run dev"

echo Starting tunnel...
start cmd /k "cd backend && npm run tunnel"

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo Application started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Tunnel: Check tunnel window for the URL
echo Use Ctrl+C in each window to exit separately

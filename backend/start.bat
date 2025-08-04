@echo off
echo Starting TerbitTravel Application...
echo ======================================

echo Fixing CORS settings...
call npm run cors-fix

echo Starting server and tunnel...
start cmd /k npm run dev
start cmd /k npm run tunnel

echo Application started!
echo Server: http://localhost:5000
echo Use Ctrl+C to exit each window separately

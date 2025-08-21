@echo off
echo ===================================================
echo TERBIT TRAVEL - CORS FIX AND START BACKEND
echo ===================================================

cd "%~dp0"

:: Run CORS Fix script
echo [1/3] Running CORS fix script...
node scripts\fixCors.js
echo.

:: Start tunnel
echo [2/3] Setting up localtunnel...
start "TerbitTravel Tunnel" cmd /c "node scripts\startTunnel.js"
echo.
timeout /t 5 > nul

:: Start backend server
echo [3/3] Starting backend server...
npm start

echo ===================================================

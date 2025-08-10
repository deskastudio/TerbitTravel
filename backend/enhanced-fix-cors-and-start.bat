@echo off
echo ===================================================
echo TERBIT TRAVEL - ENHANCED CORS FIX AND START BACKEND
echo ===================================================

cd "%~dp0"

:: Stop existing Node.js processes
echo [1/4] Stopping existing Node.js processes...
taskkill /F /IM node.exe /T > nul 2>&1
echo.
timeout /t 2 > nul

:: Run Enhanced CORS Fix script
echo [2/4] Running enhanced CORS fix script...
node scripts\enhanced-fix-cors.js
echo.
timeout /t 2 > nul

:: Start tunnel
echo [3/4] Setting up localtunnel...
start "TerbitTravel Tunnel" cmd /c "node scripts\startTunnel.js"
echo.
timeout /t 5 > nul

:: Start backend server
echo [4/4] Starting backend server...
npm start

echo ===================================================

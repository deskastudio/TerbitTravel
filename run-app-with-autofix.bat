@echo off
title TerbitTravel Application Runner with Auto-Fix
echo [94m====================================[0m
echo [94m TerbitTravel Application Starter [0m
echo [94m====================================[0m

echo.
echo [93mChecking for Vite cache issues...[0m

:: Check if node_modules\.vite exists in frontend
if exist "frontend\node_modules\.vite" (
    echo [93mFound Vite cache, cleaning up...[0m
    rmdir /s /q "frontend\node_modules\.vite"
    echo [92mVite cache cleaned successfully![0m
) else (
    echo [92mNo Vite cache found, continuing...[0m
)

:: Check for port conflicts
echo [93mChecking for port conflicts...[0m
set PORT_IN_USE=0
netstat -ano | findstr :5173 > nul
if %ERRORLEVEL% EQU 0 (
    echo [91mWARNING: Port 5173 is already in use![0m
    echo [93mAttempting to free port...[0m
    
    :: Get PID
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        set PID=%%a
    )
    
    echo [93mTerminating process with PID %PID%...[0m
    taskkill /F /PID %PID%
    if %ERRORLEVEL% EQU 0 (
        echo [92mSuccessfully freed port 5173![0m
    ) else (
        echo [91mFailed to free port. Please close the application using port 5173 manually.[0m
        pause
    )
) else (
    echo [92mPort 5173 is available![0m
)

:: Run CORS fix
echo.
echo [93mFixing CORS settings...[0m
cd backend
call npm run cors-fix
echo [92mCORS settings fixed![0m

:: Start backend server
echo.
echo [92mStarting backend server...[0m
start "Backend Server" cmd /k "cd backend && npm run dev"

:: Start tunnel
echo.
echo [92mStarting tunnel...[0m
start "Localtunnel" cmd /k "cd backend && npm run tunnel"

:: Start frontend with cache clearing
echo.
echo [92mStarting frontend...[0m
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo [92mApplication started successfully![0m
echo [96mBackend: http://localhost:5000[0m
echo [96mFrontend: http://localhost:5173[0m
echo [96mTunnel: Check tunnel window for the URL[0m
echo.
echo [93mUse Ctrl+C in each window to exit separately[0m
echo.

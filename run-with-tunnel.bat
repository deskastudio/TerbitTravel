@echo off
echo ====== Terbit Travel App Launcher with Tunnel Support ======
echo.
echo This script will start both the backend and frontend for Terbit Travel
echo with proper tunnel configuration for image URL handling.
echo.
echo [1/3] Starting Backend with Localtunnel...
cd backend
start cmd /k "npm start"

timeout /t 5 /nobreak

echo [2/3] Starting Localtunnel for Backend...
cd backend
start cmd /k "npx localtunnel --port 5000 --subdomain terbit-travel"

timeout /t 5 /nobreak

echo [3/3] Starting Frontend...
cd ../frontend
start cmd /k "npm run dev"

echo.
echo ====== All Services Started ======
echo.
echo Frontend: http://localhost:5173
echo Backend API (local): http://localhost:5000
echo Backend API (tunnel): https://terbit-travel.loca.lt
echo.
echo Note: You can access the application at http://localhost:5173
echo Images will automatically use the tunnel URL when needed.

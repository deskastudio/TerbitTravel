# Fix Vite 504 Timeout Errors
Write-Host "Fixing Vite 504 Timeout Errors" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "frontend"
$nodeModulesDir = Join-Path $frontendDir "node_modules"

# Step 1: Clear Vite cache
Write-Host "Step 1: Cleaning Vite cache..." -ForegroundColor Yellow
$viteCache = Join-Path $nodeModulesDir ".vite"
if (Test-Path $viteCache) {
    Write-Host "Removing .vite cache directory..." -ForegroundColor Yellow
    Remove-Item -Path $viteCache -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Vite cache cleaned!" -ForegroundColor Green
} else {
    Write-Host "✓ No Vite cache found, skipping..." -ForegroundColor Green
}

# Step 2: Clean browser cache files
Write-Host "Step 2: Cleaning Vite browser cache files..." -ForegroundColor Yellow
Set-Location $frontendDir
Write-Host "Running: npm run clean:cache" -ForegroundColor Yellow
try {
    # Add clean:cache script to package.json if not present
    $packageJsonPath = Join-Path $frontendDir "package.json"
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    
    if (-not $packageJson.scripts."clean:cache") {
        Write-Host "Adding clean:cache script to package.json..." -ForegroundColor Yellow
        $packageJson.scripts | Add-Member -Name "clean:cache" -Value "rimraf node_modules/.vite" -MemberType NoteProperty
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
        
        # Install rimraf if not present
        Write-Host "Installing rimraf dependency..." -ForegroundColor Yellow
        npm install rimraf --save-dev
    }
    
    npm run clean:cache
    Write-Host "✓ Browser cache cleaned!" -ForegroundColor Green
} catch {
    Write-Host "! Could not run npm script. Skipping..." -ForegroundColor Yellow
}

# Step 3: Fix port issues
Write-Host "Step 3: Checking for port conflicts..." -ForegroundColor Yellow
$port5173InUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173InUse) {
    Write-Host "! Port 5173 is already in use." -ForegroundColor Red
    Write-Host "  Process ID using port: $($port5173InUse.OwningProcess)" -ForegroundColor Yellow
    
    $shouldKill = Read-Host "Do you want to kill the process using port 5173? (y/n)"
    if ($shouldKill -eq "y") {
        try {
            Stop-Process -Id $port5173InUse.OwningProcess -Force
            Write-Host "✓ Process killed!" -ForegroundColor Green
        } catch {
            Write-Host "! Failed to kill process. Try running this script as administrator." -ForegroundColor Red
        }
    }
} else {
    Write-Host "✓ No port conflicts found!" -ForegroundColor Green
}

# Step 4: Fix node_modules issues
Write-Host "Step 4: Checking for node_modules issues..." -ForegroundColor Yellow
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "! node_modules directory not found, installing dependencies..." -ForegroundColor Yellow
    Set-Location $frontendDir
    npm install
    Write-Host "✓ Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "✓ node_modules directory exists!" -ForegroundColor Green
}

Write-Host "`nAll fixes applied! Try running your application again." -ForegroundColor Cyan
Write-Host "If issues persist, try running 'npm run dev' directly in the frontend directory." -ForegroundColor Cyan

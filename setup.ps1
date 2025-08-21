# switch-node.ps1
# Simple script to switch Node version to 24.4.0 using nvm

Write-Host "Switching to Node.js version 24.4.0..." -ForegroundColor Cyan

# Check if nvm is available
$nvmCommand = Get-Command nvm -ErrorAction SilentlyContinue
if (-not $nvmCommand) {
    Write-Host "NVM not found! Please install nvm-windows first." -ForegroundColor Red
    Write-Host "Download from: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor Yellow
    exit 1
}

# Switch to Node 24.4.0
try {
    Write-Host "Executing: nvm use 24.4.0" -ForegroundColor Gray
    nvm use 24.4.0
    
    # Manual PATH fix for Node 24.4.0 (backup method)
    $nodePath = "$env:APPDATA\nvm\v24.4.0"
    if (Test-Path $nodePath) {
        $env:PATH = "$nodePath;$env:PATH"
    }
    
    # Verify the switch was successful
    $nodeVersion = node -v 2>$null
    $npmVersion = npm -v 2>$null
    
    if ($nodeVersion -eq "v24.4.0") {
        Write-Host "✅ Successfully switched to Node.js $nodeVersion" -ForegroundColor Green
        Write-Host "✅ NPM version: $npmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to switch to Node.js 24.4.0" -ForegroundColor Red
        Write-Host "Current version: $nodeVersion" -ForegroundColor Yellow
        
        # Check if version is installed
        Write-Host "Checking available Node versions..." -ForegroundColor Yellow
        nvm list
        
        Write-Host "If 24.4.0 is not installed, run:" -ForegroundColor Cyan
        Write-Host "  nvm install 24.4.0" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error switching Node version: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Current environment:" -ForegroundColor Magenta
Write-Host "  Node: $(node -v 2>$null)" -ForegroundColor Gray
Write-Host "  NPM:  $(npm -v 2>$null)" -ForegroundColor Gray
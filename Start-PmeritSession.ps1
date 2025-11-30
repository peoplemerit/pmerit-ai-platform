# PMERIT Session Startup Script v1.0

Write-Host ""
Write-Host "===== PMERIT SESSION STARTUP =====" -ForegroundColor Cyan
Write-Host ""

$frontendPath = "E:\pmerit\pmerit-ai-platform"
$backendPath = "E:\pmerit\pmerit-api-worker"

# Check Frontend
Write-Host "Checking Frontend..." -ForegroundColor Yellow
Set-Location $frontendPath
git fetch origin 2>$null
$feStatus = git status 2>&1
if ($feStatus -match "up to date") {
    Write-Host "  Frontend: UP TO DATE" -ForegroundColor Green
} elseif ($feStatus -match "behind") {
    Write-Host "  Frontend: BEHIND - pulling..." -ForegroundColor Yellow
    git pull origin main
} else {
    Write-Host "  Frontend: CHECK MANUALLY" -ForegroundColor Red
}

Write-Host ""

# Check Backend
Write-Host "Checking Backend..." -ForegroundColor Yellow
Set-Location $backendPath
git fetch origin 2>$null
$beStatus = git status 2>&1
if ($beStatus -match "up to date") {
    Write-Host "  Backend: UP TO DATE" -ForegroundColor Green
} elseif ($beStatus -match "behind") {
    Write-Host "  Backend: BEHIND - pulling..." -ForegroundColor Yellow
    git pull origin main
} else {
    Write-Host "  Backend: CHECK MANUALLY" -ForegroundColor Red
}

Write-Host ""

# Read State
$stateFile = Join-Path $frontendPath "docs\aados\STATE.json"
if (Test-Path $stateFile) {
    $state = Get-Content $stateFile | ConvertFrom-Json
    Write-Host "===== CURRENT STATE =====" -ForegroundColor Cyan
    Write-Host "  Phase: $($state.current_phase) - $($state.phase_name)"
    Write-Host "  Task:  $($state.active_requirement) - $($state.requirement_description)"
    Write-Host "  Attempt: $($state.attempt_count)/$($state.max_attempts)"
    Write-Host ""
}

Write-Host "===== READY =====" -ForegroundColor Green
Write-Host "Say PMERIT CONTINUE to your AI assistant."
Write-Host ""

Set-Location $frontendPath
Param(
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"

Write-Host "Setting GOPROXY to improve module downloads"
$env:GOPROXY = "https://proxy.golang.org,direct"

function Build-GoModule($path) {
  Write-Host "Building $path"
  Push-Location $path
  go build ./...
  Pop-Location
}

Build-GoModule "backend/api-gateway"
Build-GoModule "backend/device-connect"
Build-GoModule "backend/core-message-bus"
Build-GoModule "backend/data-store"
Build-GoModule "backend/asset-manager"
Build-GoModule "backend/alert-center"
Build-GoModule "backend/rule-engine"

try {
  Build-GoModule "backend/device-gateway"
} catch {
  Write-Warning "device-gateway build failed (likely due to external module fetch). You can use Docker build to compile it." 
}

if (-not $SkipFrontend) {
  Write-Host "Building frontend web-ui"
  Push-Location "web-ui"
  npm install
  npm run build
  Pop-Location
}

Write-Host "Build completed"

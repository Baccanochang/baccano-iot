# build.ps1
Param(
    [switch]$SkipFrontend,
    [switch]$Run
)

$ErrorActionPreference = "Stop"
Write-Host "Using existing GOPROXY"

# 确保 build 目录存在
$buildDir = "build"
if (!(Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

function Build-Package($modulePath) {
    $moduleName = Split-Path $modulePath -Leaf
    $outputPath = Join-Path $buildDir "$moduleName.exe"
    Write-Host "Building $moduleName -> $outputPath"
    Push-Location $modulePath
    go build -o "../$outputPath"
    Pop-Location
}

# 后端模块列表
$modules = @(
    "backend/core-message-bus",
    "backend/api-gateway",
    "backend/device-manager",
    "backend/asset-manager",
    "backend/alert-center",
    "backend/data-store",
    "backend/device-connect",
    "backend/device-gateway",
    "backend/rule-engine"
)

foreach ($mod in $modules) {
    if (Test-Path $mod) {
        try {
            Build-Package $mod
        } catch {
            Write-Warning "Build failed for $mod`: $($_.Exception.Message)"
        }
    } else {
        Write-Warning "Module directory not found: $mod"
    }
}

# 前端构建
if (-not $SkipFrontend) {
    Write-Host "Building frontend web-ui"
    Push-Location "web-ui"
    npm install
    npm run build
    Pop-Location
}

Write-Host "Build completed"
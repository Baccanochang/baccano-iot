# clean.ps1
Param(
    [switch]$CleanNodeModules
)

$ErrorActionPreference = "Stop"

# 清理 build 目录
$buildDir = "build"
if (Test-Path $buildDir) {
    Write-Host "Removing $buildDir/"
    Remove-Item -Recurse -Force $buildDir
}

# 清理前端
$webUiDir = "web-ui"
if (Test-Path $webUiDir) {
    Push-Location $webUiDir

    if (Test-Path "dist") {
        Write-Host "Removing dist/"
        Remove-Item -Recurse -Force "dist"
    }

    if ($CleanNodeModules -and (Test-Path "node_modules")) {
        Write-Host "Removing node_modules/"
        Remove-Item -Recurse -Force "node_modules"
    }

    Pop-Location
} else {
    Write-Warning "Frontend directory not found: $webUiDir"
}

Write-Host "Clean completed."
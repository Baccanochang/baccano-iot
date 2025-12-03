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

$buildDir = "backend/build"
if (Test-Path $buildDir) {
    Write-Host "Removing $buildDir/"
    Remove-Item -Recurse -Force $buildDir
}

# 清理各模块中的二进制文件
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
        $moduleName = Split-Path $mod -Leaf
        $exePath = Join-Path $mod "$moduleName.exe"
        if (Test-Path $exePath) {
            Write-Host "Removing $exePath"
            Remove-Item -Force $exePath
        }
        
        # 清理可能的 Linux/macOS 二进制文件
        $linuxPath = Join-Path $mod $moduleName
        if (Test-Path $linuxPath) {
            Write-Host "Removing $linuxPath"
            Remove-Item -Force $linuxPath
        }
    }
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
# clean-docker.ps1 - 清理Docker构建产物
Param(
    [switch]$CleanImages,
    [switch]$CleanContainers,
    [switch]$Help
)

if ($Help) {
    Write-Host "清理Docker构建产物"
    Write-Host "用法: ./clean-docker.ps1 [选项]"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -CleanImages    删除构建的Docker镜像"
    Write-Host "  -CleanContainers 删除并停止运行的容器"
    Write-Host "  -Help           显示此帮助信息"
    exit 0
}

$ErrorActionPreference = "Stop"

# 清理 build 目录
$buildDir = "build"
if (Test-Path $buildDir) {
    Write-Host "删除 $buildDir/"
    Remove-Item -Recurse -Force $buildDir
}

# 清理各模块中的二进制文件
$modules = @(
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
        $exePath = Join-Path $mod "$moduleName"
        if (Test-Path $exePath) {
            Write-Host "删除 $exePath"
            Remove-Item -Force $exePath
        }
    }
}

# 清理前端
$webUiDir = "web-ui"
if (Test-Path $webUiDir) {
    Push-Location $webUiDir

    if (Test-Path "dist") {
        Write-Host "删除 dist/"
        Remove-Item -Recurse -Force "dist"
    }

    Pop-Location
}

# 清理Docker资源
if ($CleanContainers) {
    Write-Host "停止并删除相关容器..."
    docker-compose down
}

if ($CleanImages) {
    Write-Host "删除构建的镜像..."
    $images = docker images -q "baccano*"
    if ($images) {
        docker rmi $images -f
    }
}

Write-Host "清理完成."
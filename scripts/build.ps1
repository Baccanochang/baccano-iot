# build.ps1
Param(
    [switch]$SkipFrontend,
    [switch]$Run,
    [switch]$Linux,
    [switch]$Help
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
    
    # 根据平台设置不同的输出路径和扩展名
    # if ($Linux) {
    #     $outputName = $moduleName  # Linux 二进制文件无扩展名
    #     $env:GOOS = "linux"
    #     $env:GOARCH = "amd64"
    #     $env:CGO_ENABLED = "0"
    # } else {
    $outputName = "$moduleName.exe"  # Windows 二进制文件
    # }
    
    $outputPath = Join-Path $buildDir $outputName
    Write-Host "Building $moduleName -> $outputPath"
    Push-Location $modulePath
    try {
        go build -o "../$outputPath"
        Write-Host "Successfully built $moduleName"
    } catch {
        Write-Warning "Build failed for $modulePath`: $($_.Exception.Message)"
    } finally {
        # 清理环境变量
        if ($Linux) {
            Remove-Item Env:GOOS -ErrorAction SilentlyContinue
            Remove-Item Env:GOARCH -ErrorAction SilentlyContinue
            Remove-Item Env:CGO_ENABLED -ErrorAction SilentlyContinue
        }
    }
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
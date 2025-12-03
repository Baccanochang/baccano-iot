# build-docker.ps1 - 构建二进制文件并准备Docker构建环境
Param(
    [switch]$SkipFrontend,
    [switch]$SkipBinaries,
    [switch]$Help
)

if ($Help) {
    Write-Host "构建二进制文件并准备Docker环境"
    Write-Host "用法: ./build-docker.ps1 [选项]"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -SkipFrontend  跳过前端构建"
    Write-Host "  -SkipBinaries  跳过二进制构建，假设已经构建完成"
    Write-Host "  -Help          显示此帮助信息"
    exit 0
}

$ErrorActionPreference = "Stop"
Write-Host "使用现有的GOPROXY"

# 确保 build 目录存在
$buildDir = "build"
if (!(Test-Path $buildDir)) {
    New-Item -ItemType Directory -Path $buildDir | Out-Null
}

# 构建后端二进制文件
if (-not $SkipBinaries) {
    function Build-Package($modulePath) {
        $moduleName = Split-Path $modulePath -Leaf
        $outputPath = Join-Path $buildDir "$moduleName.exe"
        Write-Host "构建 $moduleName -> $outputPath"
        Push-Location $modulePath
        try {
            # 为Linux构建
            $env:GOOS = "linux"
            $env:GOARCH = "amd64"
            $env:CGO_ENABLED = "0"
            go build -o "../$outputPath"
            Write-Host "成功构建 $moduleName (Linux)"
        } catch {
            Write-Warning "构建 $modulePath 失败: $($_.Exception.Message)"
        } finally {
            # 恢复环境变量
            Remove-Item Env:GOOS -ErrorAction SilentlyContinue
            Remove-Item Env:GOARCH -ErrorAction SilentlyContinue
            Remove-Item Env:CGO_ENABLED -ErrorAction SilentlyContinue
        }
        Pop-Location
    }

    # 后端模块列表
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
            try {
                Build-Package $mod
            } catch {
                Write-Warning "处理 $mod 时发生错误: $($_.Exception.Message)"
            }
        } else {
            Write-Warning "找不到模块目录: $mod"
        }
    }
}

# 将二进制文件复制到各个模块目录
function Copy-Binaries() {
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
            $sourcePath = Join-Path $buildDir "$moduleName.exe"
            $destPath = Join-Path $mod "$moduleName"
            
            if (Test-Path $sourcePath) {
                Write-Host "复制 $sourcePath -> $destPath"
                Copy-Item $sourcePath $destPath
            } else {
                Write-Warning "找不到二进制文件: $sourcePath"
            }
        }
    }
}

# 复制二进制文件
Copy-Binaries

# 前端构建
if (-not $SkipFrontend) {
    Write-Host "构建前端 web-ui"
    Push-Location "web-ui"
    try {
        npm install
        npm run build
    } finally {
        Pop-Location
    }
}

Write-Host "Docker构建准备完成"
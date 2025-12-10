# 批量启动脚本 - Windows PowerShell版本
# 启动所有后端服务

Write-Host "开始启动所有后端服务..."

# 设置服务列表
$services = @(
    @{Name="api-gateway"; Port=8080}
    @{Name="auth-service"; Port=8087}
    @{Name="device-connect"; Port=8090}
    @{Name="device-manager"; Port=8082}
    @{Name="asset-manager"; Port=8083}
    @{Name="rule-engine"; Port=8085}
    @{Name="alert-center"; Port=8084}
)

# 确保logs目录存在
if (-not (Test-Path -Path ".\logs")) {
    New-Item -ItemType Directory -Path ".\logs" | Out-Null
}

# 启动每个服务
foreach ($service in $services) {
    $serviceName = $service.Name
    $servicePort = $service.Port
    $jarPath = ".\backend\$serviceName\target\$serviceName-1.0.0.jar"
    $logPath = ".\logs\$serviceName.log"
    
    Write-Host "正在启动 $serviceName 服务 (端口: $servicePort)..."
    
    # 检查jar文件是否存在
    if (Test-Path -Path $jarPath) {
        # 启动服务
        Start-Process -FilePath "java" -ArgumentList "-jar", $jarPath -RedirectStandardOutput $logPath -RedirectStandardError $logPath -NoNewWindow -PassThru
        Write-Host "✓ $serviceName 服务已启动，日志输出到: $logPath"
    } else {
        Write-Host "✗ 未找到 $serviceName 的jar文件: $jarPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "所有服务启动完成！"
Write-Host "您可以使用 stop-all.ps1 脚本停止所有服务。"

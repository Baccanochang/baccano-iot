# 批量停止脚本 - Windows PowerShell版本
# 停止所有后端服务

Write-Host "开始停止所有后端服务..."

# 设置服务列表
$services = @(
    "api-gateway"
    "auth-service"
    "device-connect"
    "device-manager"
    "asset-manager"
    "rule-engine"
    "alert-center"
)

# 查找并停止每个服务的进程
foreach ($service in $services) {
    Write-Host "正在停止 $service 服务..."
    
    # 查找包含服务名称的Java进程
    $processes = Get-WmiObject -Class Win32_Process | Where-Object {$_.CommandLine -like "*$service*" -and $_.Name -eq "java.exe"}
    
    if ($processes.Count -gt 0) {
        foreach ($process in $processes) {
            # 终止进程
            $process | Stop-Process -Force
            Write-Host "✓ $service 服务已停止 (PID: $($process.ProcessId))"
        }
    } else {
        Write-Host "✗ 未找到运行中的 $service 服务"
    }
}

Write-Host ""
Write-Host "所有服务停止完成！"
Write-Host "您可以使用 start-all.ps1 脚本再次启动所有服务。"

#!/bin/bash

# 批量停止脚本 - Linux/Mac Shell版本
# 停止所有后端服务

echo "开始停止所有后端服务..."

# 设置服务列表
services=(  
    "api-gateway"  
    "auth-service"  
    "device-connect"  
    "device-manager"  
    "asset-manager"  
    "rule-engine"  
    "alert-center"  
)

# 查找并停止每个服务的进程
for service in "${services[@]}"; do
    echo "正在停止 $service 服务..."
    
    # 查找包含服务名称的Java进程
    pids=$(ps aux | grep "$service" | grep "java" | grep -v "grep" | awk '{print $2}')
    
    if [ -n "$pids" ]; then
        # 终止进程
        for pid in $pids; do
            kill -9 "$pid" 2>/dev/null
            echo "✓ $service 服务已停止 (PID: $pid)"
        done
    else
        echo "✗ 未找到运行中的 $service 服务"
    fi
done

echo ""
echo "所有服务停止完成！"
echo "您可以使用 start-all.sh 脚本再次启动所有服务。"

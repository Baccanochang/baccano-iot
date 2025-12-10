#!/bin/bash

# 批量启动脚本 - Linux/Mac Shell版本
# 启动所有后端服务

echo "开始启动所有后端服务..."

# 设置服务列表
declare -A services=(  
    ["api-gateway"]=8080  
    ["auth-service"]=8087  
    ["device-connect"]=8090  
    ["device-manager"]=8082  
    ["asset-manager"]=8083  
    ["rule-engine"]=8085  
    ["alert-center"]=8084  
)

# 确保logs目录存在
mkdir -p ./logs

# 启动每个服务
for service in "${!services[@]}"; do
    service_name=$service
    service_port=${services[$service]}
    jar_path="./backend/$service_name/target/$service_name-1.0.0.jar"
    log_path="./logs/$service_name.log"
    
    echo "正在启动 $service_name 服务 (端口: $service_port)..."
    
    # 检查jar文件是否存在
    if [ -f "$jar_path" ]; then
        # 启动服务
        nohup java -jar "$jar_path" > "$log_path" 2>&1 &
        echo "✓ $service_name 服务已启动，日志输出到: $log_path"
    else
        echo "✗ 未找到 $service_name 的jar文件: $jar_path" >&2
    fi
done

echo ""
echo "所有服务启动完成！"
echo "您可以使用 stop-all.sh 脚本停止所有服务。"

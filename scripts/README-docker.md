# Docker 构建说明

本项目已更新为在本地构建二进制文件后再复制到 Docker 镜像中的构建方式，这样可以提高构建速度并减少镜像大小。

## 构建步骤

### 1. 本地构建二进制文件并准备 Docker 环境

```powershell
# 构建所有后端二进制文件和前端
.\scripts\build-docker.ps1

# 仅构建后端二进制文件（跳过前端）
.\scripts\build-docker.ps1 -SkipFrontend

# 使用已存在的二进制文件，仅复制到各模块目录
.\scripts\build-docker.ps1 -SkipBinaries
```

### 2. 使用 Docker Compose 构建和启动服务

```powershell
# 构建并启动所有服务
docker-compose up --build

# 后台运行服务
docker-compose up --build -d

# 仅构建不启动
docker-compose build
```

## 清理

### 1. 清理本地构建产物

```powershell
# 清理二进制文件和前端构建产物
.\scripts\clean-docker.ps1

# 额外清理 Docker 容器和镜像
.\scripts\clean-docker.ps1 -CleanContainers -CleanImages
```

### 2. 使用 Docker Compose 清理

```powershell
# 停止并删除容器
docker-compose down

# 停止并删除容器和网络
docker-compose down --remove-orphans

# 删除镜像
docker-compose down --rmi all
```

## 构建方式变更说明

### 旧方式（多阶段构建）
- 在 Docker 容器内构建二进制文件
- 需要在容器内下载依赖
- 构建时间较长，镜像体积较大

### 新方式（本地构建）
- 在本地构建二进制文件（Linux AMD64）
- 直接复制二进制文件到镜像
- 构建速度快，镜像体积小
- 本地构建可以更好地利用缓存和并行构建

## 注意事项

1. 二进制文件是针对 Linux AMD64 架构构建的，确保您的 Docker 环境支持此架构
2. 前端构建产物会直接复制到 Nginx 容器中
3. 所有服务都配置了 `restart: unless-stopped` 策略，提高稳定性
4. web-ui 服务现在运行在 80 端口，而不是之前的 4173 端口

## 故障排除

### 二进制文件构建失败

如果遇到二进制文件构建失败，可以尝试：

1. 检查 Go 环境是否正确安装
2. 更新 Go 模块依赖：
   ```powershell
   cd backend/[module-name]
   go mod tidy
   ```
3. 检查代码是否有编译错误

### Docker 构建失败

如果遇到 Docker 构建失败，可以尝试：

1. 检查二进制文件是否存在于模块目录中
2. 确保二进制文件具有可执行权限
3. 检查 Dockerfile 路径是否正确

### 服务启动失败

如果服务启动失败，可以尝试：

1. 查看服务日志：
   ```powershell
   docker-compose logs [service-name]
   ```
2. 检查端口是否被占用
3. 检查环境变量配置是否正确
# Baccano-IoT 物联网平台

一个高性能、高可扩展性、功能全面的企业级开源物联网平台，融合 ThingsBoard、JetLinks 等平台的优点，支持海量设备连接、设备与资产管理、规则引擎处理、实时与历史数据可视化。

## 📋 目录

- [项目概述](#项目概述)
- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [核心功能](#核心功能)
- [API 文档](#api-文档)
- [协议接入](#协议接入)
- [部署指南](#部署指南)
- [开发指南](#开发指南)
- [贡献指南](#贡献指南)

## 🎯 项目概述

Baccano-IoT 采用微服务架构，基于领域驱动设计，前后端分离，致力于为企业提供完整的物联网解决方案。平台支持设备连接管理、数据处理、规则引擎、资产管理和可视化展示等核心功能。

### 主要特点

- **微服务架构**：松耦合、高可扩展的模块化设计
- **多协议支持**：MQTT、CoAP、HTTP 等主流物联网协议
- **物模型驱动**：标准化的设备模型定义，支持设备影子
- **规则引擎**：灵活的规则链配置，支持数据流转和处理
- **高性能存储**：TDengine 时序数据库 + PostgreSQL 关系型数据库
- **实时监控**：实时数据可视化与告警管理
- **多租户支持**：企业级租户隔离与管理

## 🏗️ 系统架构

```mermaid
graph TB
    subgraph 设备层
        A[设备端]
    end
    
    subgraph 接入层
        B[设备网关集群]
    end
    
    subgraph 服务层
        C[设备连接服务]
        D[规则引擎服务]
        E[数据存储服务]
        F[告警引擎服务]
        G[设备管理服务]
        H[资产管理服务]
    end
    
    subgraph 基础设施
        I[核心消息总线]
        J[PostgreSQL]
        K[TDengine]
        L[Redis]
    end
    
    subgraph 应用层
        M[API网关]
        N[Web UI]
    end
    
    A -- MQTT/CoAP/HTTP --> B
    B -- gRPC --> C
    C -- 发布消息 --> I
    I -- 异步通信 --> D
    I -- 异步通信 --> E
    I -- 异步通信 --> F
    I -- 异步通信 --> G
    I -- 异步通信 --> H
    D -- 写入 --> J
    D -- 写入 --> K
    E -- 写入 --> J
    E -- 写入 --> K
    F -- 写入 --> J
    E -- 读取 --> L
    M -- HTTP --> G
    M -- HTTP --> H
    M -- HTTP --> D
    N -- HTTP --> M
```

## 🛠️ 技术栈

### 后端技术栈

- **语言**: Go 1.21+
- **通信协议**: gRPC、MQTT、CoAP、HTTP
- **消息队列**: NATS JetStream
- **数据库**:
  - PostgreSQL (关系型数据、元数据)
  - TDengine (时序数据)
  - Redis (缓存、会话)
- **微服务**: Docker、Kubernetes

### 前端技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design 5.x
- **状态管理**: React Query (服务端状态) + Recoil/Zustand (客户端状态)
- **图表**: @ant-design/charts
- **实时通信**: Socket.IO Client

## 🚀 快速开始

### 前置要求

- Go 1.21+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16+ (本地开发)
- TDengine 3+ (本地开发)
- Redis 7+ (本地开发)

### 使用 Docker Compose 启动

1. 克隆项目
```bash
git clone https://github.com/your-org/baccano-iot.git
cd baccano-iot
```

2. 启动所有服务
```bash
# PowerShell
./scripts/docker-up.ps1

# Bash
./scripts/docker-up.sh
```

3. 访问系统
- 前端界面: http://localhost:5173
- API 网关: http://localhost:8080
- MQTT 端口: 1883
- CoAP 端口: 5683/UDP

### 本地开发环境

1. 构建后端服务
```powershell
# PowerShell
./scripts/build.ps1

# 如需跳过前端构建
./scripts/build.ps1 -SkipFrontend
```

2. 启动前端
```bash
cd web-ui
npm install
npm run dev
```

3. 启动后端服务
```bash
# 在各服务目录下执行
go run main.go
```

## 📁 项目结构

```
baccano-iot/
├── backend/                      # 后端微服务
│   ├── api-gateway/              # API网关服务
│   ├── device-gateway/           # 设备网关服务
│   ├── device-connect/           # 设备连接服务
│   ├── device-manager/           # 设备管理服务
│   ├── asset-manager/            # 资产管理服务
│   ├── data-store/               # 数据存储服务
│   ├── rule-engine/              # 规则引擎服务
│   ├── alert-center/             # 告警中心服务
│   ├── core-message-bus/         # 核心消息总线
│   ├── proto/                    # gRPC协议定义
│   └── shared/                   # 共享库
├── web-ui/                       # 前端应用
│   ├── src/
│   │   ├── api/                  # API接口封装
│   │   ├── components/           # 公共组件
│   │   ├── features/             # 功能模块
│   │   ├── pages/                # 页面组件
│   │   ├── hooks/                # 自定义hooks
│   │   ├── stores/               # 状态管理
│   │   ├── @types/               # TypeScript类型定义
│   │   └── utils/                # 工具函数
│   ├── package.json
│   └── vite.config.ts
├── docs/                         # 文档
├── scripts/                      # 构建和部署脚本
├── docker-compose.yml            # Docker编排文件
├── project_design.md             # 项目设计文档
└── README.md                     # 项目说明文档
```

## ✨ 核心功能

### 设备连接与管理

- 支持海量设备并发连接
- 多协议接入 (MQTT、CoAP、HTTP)
- 设备生命周期管理
- 设备认证与安全控制
- 设备状态监控与诊断

### 物模型管理

- 标准化设备模型定义
- 属性、服务、事件管理
- 版本控制与兼容性检查
- 设备影子实现
- 物模型驱动数据校验

### 数据采集与存储

- 实时数据采集与处理
- 高性能时序数据存储
- 历史数据查询与分析
- 数据聚合与统计
- 数据备份与恢复

### 规则引擎

- 可视化规则链设计
- 多种规则节点类型
- 条件判断与动作执行
- 数据流转与转换
- 定时任务与调度

### 告警中心

- 实时告警监控
- 多级告警策略
- 告警通知与推送
- 告警确认与处理
- 告警统计与分析

### 资产管理

- 树形资产结构
- 设备与资产关联
- 地理位置管理
- 资产属性定义
- 资产统计分析

### 数据可视化

- 实时数据监控
- 多样化图表展示
- 自定义仪表盘
- 数据趋势分析
- 报表生成与导出

## 📚 API 文档

### 认证

```bash
# 用户登录，获取JWT
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

### 设备管理

```bash
# 创建设备
POST /api/v1/devices
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度传感器01",
  "productId": "product-uuid",
  "credential": "device-secret"
}

# 获取设备详情
GET /api/v1/devices/{deviceId}
Authorization: Bearer {jwt}

# 获取设备物模型
GET /api/v1/devices/{deviceId}/thing-model
Authorization: Bearer {jwt}

# 调用设备服务
POST /api/v1/devices/{deviceId}/rpc
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "service": "reboot",
  "params": {
    "delay": 10
  }
}
```

### 数据查询

```bash
# 获取设备最新遥测数据
GET /api/v1/telemetry/{deviceId}/latest
Authorization: Bearer {jwt}

# 获取历史遥测数据
GET /api/v1/telemetry/{deviceId}/history?startTs=1672531200000&endTs=1672617600000&interval=1h
Authorization: Bearer {jwt}

# 获取设备事件
GET /api/v1/events/{deviceId}?limit=10&offset=0
Authorization: Bearer {jwt}
```

### 物模型管理

```bash
# 创建产品
POST /api/v1/products
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度传感器",
  "description": "高精度温度监测设备",
  "protocol": "MQTT"
}

# 更新产品物模型
PUT /api/v1/products/{productId}/thing-model
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "schemaVersion": "1.0",
  "properties": [
    {
      "identifier": "temperature",
      "name": "温度",
      "accessMode": "r",
      "dataType": {
        "type": "float",
        "specs": {
          "min": -50,
          "max": 150,
          "unit": "℃"
        }
      }
    }
  ],
  "services": [],
  "events": []
}
```

## 🔌 协议接入

### MQTT 协议

```bash
# 连接参数
Host: localhost
Port: 1883
ClientID: {deviceId}
Username: {productId}
Password: {credential}

# 上报遥测数据
Topic: v1/{productId}/{deviceId}/telemetry
Payload: 
{
  "temperature": 25.6,
  "humidity": 65.2
}
```

### CoAP 协议

```bash
# 上报遥测数据
Method: POST
Host: localhost
Port: 5683
Path: /v1/{productId}/{deviceId}/telemetry
Content-Format: application/json
Payload: 
{
  "temperature": 25.6,
  "humidity": 65.2
}
```

### HTTP 协议

```bash
# 上报遥测数据
POST /api/v1/{productId}/{deviceId}/telemetry
Authorization: Bearer {device-token}
Content-Type: application/json

{
  "temperature": 25.6,
  "humidity": 65.2
}
```

## 🚀 部署指南

### Docker 部署

使用提供的 `docker-compose.yml` 文件快速部署：

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f [service-name]

# 停止服务
docker-compose down
```

### Kubernetes 部署

1. 构建镜像
```bash
# 构建后端服务镜像
docker build -t baccano-iot/api-gateway ./backend/api-gateway
# ... 其他服务

# 构建前端镜像
docker build -t baccano-iot/web-ui ./web-ui
```

2. 部署到 Kubernetes
```bash
# 应用 Kubernetes 配置
kubectl apply -f k8s/
```

### 环境变量配置

| 服务 | 环境变量 | 默认值 | 说明 |
|------|---------|--------|------|
| api-gateway | JWT_SECRET | dev-secret | JWT签名密钥 |
| api-gateway | DEVICE_MANAGER_URL | http://device-manager:8082 | 设备管理服务地址 |
| device-connect | NATS_URL | nats://nats:4222 | NATS服务地址 |
| device-connect | REDIS_ADDR | redis:6379 | Redis服务地址 |
| device-connect | PG_URL | postgres://postgres:postgres@postgres:5432/iot | PostgreSQL连接字符串 |
| web-ui | VITE_API_BASE_URL | http://api-gateway:8080 | API网关地址 |

## 🧪 开发指南

### 后端开发

1. 服务结构
```
backend/{service}/
├── cmd/
│   └── main.go                 # 服务入口
├── internal/
│   ├── grpc/                   # gRPC服务实现
│   ├── http/                   # HTTP服务实现
│   ├── domain/                 # 业务逻辑
│   └── infrastructure/         # 基础设施
├── pkg/                        # 公共包
├── go.mod
└── Dockerfile
```

2. 代码规范
- 遵循 Go 官方代码规范
- 使用 golangci-lint 进行代码检查
- 使用 godoc 格式编写注释
- 单元测试覆盖率 > 80%

3. 数据库操作
- 使用 GORM 或 sqlx 进行数据库操作
- 数据库变更使用 golang-migrate 管理
- 编写测试时使用 testcontainers

### 前端开发

1. 组件规范
```tsx
// 组件文件结构
ComponentName/
├── index.tsx               # 组件入口
├── ComponentName.tsx       # 组件实现
├── ComponentName.test.tsx  # 组件测试
├── styles.module.less      # 组件样式
└── types.ts               # 类型定义
```

2. 代码规范
- 遵循 React 18 + TypeScript 规范
- 使用 ESLint + Prettier 进行代码格式化
- 组件和函数使用 JSDoc 注释
- 单元测试覆盖率 > 80%

3. 状态管理
- 服务端状态使用 React Query 管理
- 全局客户端状态使用 Recoil/Zustand
- 组件内状态使用 useState/useReducer

### 调试与测试

1. 本地调试
```bash
# 启动依赖服务
docker-compose up -d postgres redis nats

# 启动单个服务进行调试
go run ./backend/api-gateway
```

2. 测试
```bash
# 后端单元测试
go test ./...

# 前端单元测试
cd web-ui && npm test

# 集成测试
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ⚡ 性能优化

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

### Issue 模板

报告 Bug 时请提供：

- 环境信息 (OS、Go版本、浏览器版本等)
- 重现步骤
- 期望行为
- 实际行为
- 相关日志或截图

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢以下开源项目的支持：

- [NATS](https://nats.io/) - 高性能消息系统
- [TDengine](https://www.taosdata.com/) - 时序数据库
- [Gin](https://gin-gonic.com/) - Go Web框架
- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI组件库

---

如有任何问题或建议，欢迎提交 Issue 或联系维护者。

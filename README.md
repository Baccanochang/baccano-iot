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

Baccano-IoT 是一款面向企业级客户的高性能、高可扩展性开源物联网平台，采用微服务架构和领域驱动设计，前后端分离，为企业提供从设备接入到数据处理、分析和可视化的完整物联网解决方案。平台旨在帮助企业快速构建和部署物联网应用，降低开发成本，提高运营效率。

### 平台定位

- **企业级**：支持大规模设备接入和高并发数据处理
- **开源**：完全开源，可自由定制和扩展
- **一体化**：提供从设备接入到数据可视化的全栈解决方案
- **可扩展**：模块化设计，支持按需扩展功能模块

### 目标用户

- **物联网解决方案提供商**：快速构建行业物联网解决方案
- **工业制造企业**：实现设备联网和工业互联网转型
- **能源电力企业**：智能电网和能源管理
- **智慧城市建设者**：城市物联网基础设施建设
- **智慧农业从业者**：农业物联网应用开发

### 典型应用场景

- 工业设备远程监控与维护
- 智能电表/水表/燃气表数据采集与分析
- 智能家居设备管理与控制
- 智慧城市公共设施监控
- 农业环境监测与自动化控制
- 物流车辆跟踪与管理

### 核心优势

- **微服务架构**：松耦合、高可扩展的模块化设计，支持独立部署和弹性伸缩
- **多协议支持**：全面支持 MQTT、CoAP、HTTP、Modbus、OPC UA 等主流物联网协议
- **物模型驱动**：标准化的设备模型定义，支持设备影子和双向数据同步
- **规则引擎**：可视化规则链设计，支持复杂数据流转和处理逻辑
- **高性能存储**：TDengine 时序数据库 + PostgreSQL 关系型数据库，兼顾时序数据和关系数据存储
- **实时监控**：毫秒级数据处理和实时可视化展示
- **多租户支持**：企业级租户隔离与资源管理
- **安全可靠**：端到端数据加密，完善的认证授权机制
- **开放生态**：丰富的 API 和插件机制，支持第三方系统集成

## 🏗️ 系统架构

Baccano-IoT 采用分层微服务架构，各服务之间通过 NATS 消息总线进行通信，实现松耦合设计。系统整体分为以下几层：

### 架构分层

```mermaid
graph TB
    subgraph 设备层
        Device1[设备1]
        Device2[设备2]
        DeviceN[设备N]
    end
    
    subgraph 接入层
        MQTTBroker[MQTT Broker]
        CoAPServer[CoAP Server]
        HTTPServer[HTTP Server]
        ProtocolAdapter[协议适配器<br>Modbus/OPC UA]
    end
    
    subgraph 服务层
        DeviceConnect[设备连接服务<br>device-connect]
        RuleEngine[规则引擎服务<br>rule-engine]
        DeviceManager[设备管理服务<br>device-manager]
        AssetManager[资产管理服务<br>asset-manager]
        AlertCenter[告警中心服务<br>alert-center]
        AuthService[认证授权服务<br>auth-service]
    end
    
    subgraph 存储层
        TDengine[TDengine<br>时序数据库]
        PostgreSQL[PostgreSQL<br>关系型数据库]
        Redis[Redis<br>缓存数据库]
    end
    
    subgraph 应用层
        APIGateway[API网关<br>api-gateway]
        WebUI[Web管理界面<br>web-ui]
        OpenAPI[开放API接口]
    end
    
    %% 设备到接入层连接
    Device1 -->|MQTT| MQTTBroker
    Device2 -->|CoAP| CoAPServer
    DeviceN -->|HTTP| HTTPServer
    Device1 -->|Modbus| ProtocolAdapter
    Device2 -->|OPC UA| ProtocolAdapter
    
    %% 接入层到服务层
    MQTTBroker -->|消息转发| DeviceConnect
    CoAPServer -->|数据上报| DeviceConnect
    HTTPServer -->|数据上报| DeviceConnect
    ProtocolAdapter -->|协议转换| DeviceConnect
    
    %% 服务层内部通信
    DeviceConnect -->|设备数据| RuleEngine
    DeviceConnect -->|设备状态| DeviceManager
    RuleEngine -->|处理后数据| AssetManager
    RuleEngine -->|告警触发| AlertCenter
    DeviceManager -->|设备配置| DeviceConnect
    
    %% 服务层到存储层
    DeviceConnect -->|时序数据| TDengine
    DeviceManager -->|设备元数据| PostgreSQL
    AssetManager -->|资产数据| TDengine
    AlertCenter -->|告警记录| PostgreSQL
    
    %% 服务层缓存
    DeviceConnect -->|设备状态缓存| Redis
    DeviceManager -->|设备元数据缓存| Redis
    
    %% 存储层到服务层
    TDengine -->|历史数据查询| DeviceConnect
    PostgreSQL -->|元数据| DeviceManager
    Redis -->|缓存数据| DeviceConnect
    
    %% 服务层到应用层
    DeviceManager -->|API| APIGateway
    AssetManager -->|API| APIGateway
    AlertCenter -->|告警数据| APIGateway
    AuthService -->|认证授权| APIGateway
    WebUI -->|管理界面| APIGateway
    
    %% 应用层
    APIGateway -->|前端请求| WebUI
    APIGateway -->|第三方集成| OpenAPI
    WebUI -->|用户交互| APIGateway
    
    %% 监控链路
    subgraph 监控层
        Prometheus[Prometheus<br>监控服务]
        Grafana[可视化展示]
        Jaeger[Tracing<br>分布式追踪]
    end
    
    DeviceConnect -->|监控数据| Prometheus
    RuleEngine -->|监控数据| Prometheus
    Prometheus -->|数据| Grafana
    DeviceConnect -->|链路| Jaeger
    RuleEngine -->|链路| Jaeger
    Jaeger -->|追踪数据| Grafana
```

### 服务组件说明

| 服务名称 | 主要功能 | 技术栈 | 端口 |
|---------|---------|-------|------|
| api-gateway | API 网关，请求路由、负载均衡、认证授权 | Java + Spring Cloud Gateway | 8080 |
| device-connect | 设备连接管理、协议适配 | Java + SpringBoot + Eclipse Mosquitto | 1883/8883 (MQTT)<br>5683 (CoAP)<br>8081 (HTTP) |
| device-manager | 设备模型管理、设备生命周期管理 | Java + SpringBoot + Dubbo | 8082 |
| rule-engine | 规则引擎、数据处理 | Java + SpringBoot + Drools | 8083 |
| asset-manager | 资产管理、资产树构建 | Java + SpringBoot + Dubbo | 8084 |
| data-store | 数据持久化服务 | Java + SpringBoot + MyBatis Plus | 8085 |
| alert-center | 告警管理、告警分发 | Java + SpringBoot + WebSocket | 8086 |
| auth-service | 认证授权、JWT 管理 | Java + SpringBoot + Spring Security | 8087 |
| protocol-adapter | 工业协议适配服务 | Java + SpringBoot + modbus4j | 8088 |
| nacos-server | 服务注册与配置中心 | Java + Nacos | 8848 |

### 技术实现细节

- **服务发现与配置**：基于 Nacos 实现服务注册发现和配置管理
- **负载均衡**：API 网关层和 Dubbo 框架实现请求的智能路由和负载均衡
- **弹性伸缩**：结合 Kubernetes HPA 实现服务的自动扩缩容
- **容错机制**：Spring Cloud Circuit Breaker 实现服务熔断、限流、降级
- **分布式事务**：基于 Seata 实现分布式事务管理
- **数据一致性**：最终一致性设计，支持数据重试和幂等性处理
- **消息通信**：基于 RocketMQ 实现服务间异步通信
- **缓存机制**：Redis 实现热点数据缓存和会话管理

## 🛠️ 技术栈

### 后端技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **开发语言** | Java | 17+ | 成熟稳定的企业级开发语言，拥有丰富的生态系统和社区支持 |
| **核心框架** | SpringBoot | 4.0 | 简化Spring应用开发的框架，提供自动配置、起步依赖等特性 |
| **微服务框架** | SpringCloud Alibaba | 2023.x | 基于SpringCloud的微服务解决方案，提供服务发现、配置管理等功能 |
| **服务注册与配置中心** | Nacos | 2.3+ | 提供服务注册发现和配置管理，支持动态配置更新和服务健康检查 |
| **ORM框架** | MyBatis Plus | 3.5.x | 基于MyBatis的增强工具，简化CRUD操作，支持Lambda表达式 |
| **RPC框架** | Dubbo | 3.3+ | 高性能的Java RPC框架，适合微服务间通信 |
| **消息队列** | RocketMQ | 5.2+ | 高可靠、高吞吐量的分布式消息队列，适合大规模消息场景 |
| **关系型数据库** | PostgreSQL | 16+ | 强大的关系型数据库，支持JSON数据类型，适合存储设备元数据和业务数据 |
| **时序数据库** | TDengine | 3.2+ | 专为物联网设计的时序数据库，高效存储和查询时序数据，支持数据压缩 |
| **缓存数据库** | Redis | 7.2+ | 高性能键值存储，适合缓存设备状态和热点数据 |
| **设备协议** | Eclipse Mosquitto | 2.0+ | 成熟稳定的MQTT Broker，支持MQTT 3.1.1/5.0 |
| **容器化** | Docker | 24.0+ | 轻量级容器技术，简化服务部署和管理 |
| **编排工具** | Kubernetes | 1.27+ | 强大的容器编排平台，支持服务发现、负载均衡、自动扩缩容 |
| **构建工具** | Maven | 3.9+ | 强大的项目管理和构建工具，适合Java项目 |

### 前端技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **框架** | React | 18.3.1 | 组件化开发、虚拟DOM、优秀的生态系统 |
| **语言** | TypeScript | 20.10.0 | 类型安全、增强代码可维护性和可读性 |
| **构建工具** | Vite | 6.3.5 | 快速的冷启动和热更新，适合大型项目开发 |
| **UI组件库** | Radix UI | ^1.2.3 | 无样式、可访问的UI组件，提供良好的开发体验 |
| **CSS框架** | Tailwind CSS | - | 实用优先的CSS框架，简化样式开发 |
| **表单库** | React Hook Form | 7.55.0 | 高性能、易用的React表单库 |
| **图表库** | Recharts | 2.15.2 | 基于React的图表库，支持多种图表类型 |
| **工具库** | clsx, tailwind-merge | - | 简化CSS类名管理 |
| **日期处理** | react-day-picker | 8.10.1 | 轻量级的React日期选择器 |
| **动画库** | embla-carousel-react | 8.6.0 | 轻量级的React轮播组件 |
| **状态管理** | React Context API | - | React内置的状态管理方案 |
| **实时通信** | WebSocket | - | 浏览器原生支持的双向通信协议 |

### 监控与运维技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **监控系统** | Prometheus | 2.47+ | 强大的开源监控系统，适合收集和存储时序监控数据 |
| **可视化** | Grafana | 10.2+ | 丰富的可视化图表，支持多种数据源，适合监控数据展示 |
| **日志管理** | ELK Stack | 8.x | 完整的日志收集、存储和分析解决方案 |
| **链路追踪** | SkyWalking | 9.7+ | 分布式系统的应用性能监控工具，适合微服务架构 |
| **告警管理** | Prometheus Alertmanager | 0.26+ | 灵活的告警管理系统，支持多种告警渠道 |

### 安全技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **认证授权** | Spring Security | 6.x | 提供全面的安全解决方案，包括认证、授权、防护等 |
| **JWT库** | JJWT | 0.12+ | 易于使用的JWT库，支持JWT的创建、解析和验证 |
| **加密算法** | AES-256 + RSA-2048 | - | 工业级加密算法，确保数据传输和存储安全 |
| **API安全** | Spring Cloud Gateway | 4.0+ | 基于SpringBoot的API网关，支持路由、过滤、限流等功能 |
| **设备认证** | 密钥认证 + 证书认证 | - | 支持多种设备认证方式，确保设备接入安全 |

## 🚀 快速开始

### 前置要求

| 环境 | 版本 | 说明 |
|------|------|------|
| **Docker** | 24.0+ | 用于容器化部署 |
| **Docker Compose** | 2.20+ | 用于编排多容器应用 |
| **Git** | 2.30+ | 用于代码版本控制 |
| **Node.js** | 18.18+ | 用于前端开发和构建 |
| **npm** | 9.8+ | 用于前端依赖管理 |
| **Java** | 17+ | 用于后端开发和构建 |
| **Maven** | 3.9+ | 用于后端依赖管理和构建 |

### 1. 使用 Docker Compose 快速部署

#### 1.1 克隆项目

```bash
git clone https://github.com/your-org/baccano-iot.git
cd baccano-iot
```

#### 1.2 配置环境变量

创建 `.env` 文件，根据需要修改配置：

```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量
```

#### 1.3 启动所有服务

```bash
# Linux/macOS
docker-compose up -d

# Windows PowerShell
docker-compose up -d
```

#### 1.4 查看服务状态

```bash
docker-compose ps
```

#### 1.5 访问系统

| 服务 | 地址 | 说明 |
|------|------|------|
| **Web 管理界面** | http://localhost:5173 | 平台管理控制台 |
| **API 网关** | http://localhost:8080 | 平台 API 入口 |
| **MQTT Broker** | tcp://localhost:1883 | MQTT 设备接入地址 |
| **MQTT Broker (SSL)** | ssl://localhost:8883 | MQTT 设备接入地址 (SSL) |
| **CoAP Server** | coap://localhost:5683 | CoAP 设备接入地址 |
| **Grafana 监控** | http://localhost:3000 | 系统监控界面 (admin/admin) |

#### 1.6 停止服务

```bash
# 停止服务但保留数据
docker-compose down

# 停止服务并删除所有数据
docker-compose down -v
```

### 2. 本地开发环境搭建

#### 2.1 克隆项目

```bash
git clone https://github.com/your-org/baccano-iot.git
cd baccano-iot
```

#### 2.2 启动依赖服务

使用 Docker Compose 启动基础依赖服务：

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 2.3 构建后端服务

```bash
# 进入后端目录
cd backend

# 构建所有服务
mvn clean package -DskipTests

# 或单独构建某个服务
cd api-gateway
mvn clean package -DskipTests
```

#### 2.4 启动后端服务

```bash
# 启动 Nacos 服务（若使用外部 Nacos 可跳过）
cd nacos-server
mvn spring-boot:run

# 启动 API 网关
cd api-gateway
java -jar target/api-gateway-1.0.0.jar

# 启动设备连接服务
cd device-connect
java -jar target/device-connect-1.0.0.jar

# 启动设备管理服务
cd device-manager
java -jar target/device-manager-1.0.0.jar

# 启动规则引擎服务
cd rule-engine
java -jar target/rule-engine-1.0.0.jar

# 启动告警中心服务
cd alert-center
java -jar target/alert-center-1.0.0.jar
```

#### 2.5 启动前端服务

```bash
# 进入前端目录
cd web-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 2.6 访问开发环境

- 前端开发地址: http://localhost:5173
- API 网关地址: http://localhost:8080
- 各服务日志可在对应服务目录下查看

### 3. 验证部署

#### 3.1 设备连接测试

使用 MQTT 客户端测试设备连接：

```bash
# 使用 mosquitto_pub 发布设备数据
mosquitto_pub -h localhost -p 1883 -u "product1" -P "device1" -t "v1/product1/device1/telemetry" -m '{"temperature": 25.6, "humidity": 65.2}'
```

#### 3.2 API 调用测试

```bash
# 获取设备列表
curl -X GET http://localhost:8080/api/v1/devices -H "Authorization: Bearer {your-jwt-token}"
```

### 4. 常见问题

#### 4.1 端口冲突

如果遇到端口冲突，可以修改 `docker-compose.yml` 文件中的端口映射，或停止占用对应端口的服务。

#### 4.2 服务启动失败

查看服务日志获取详细错误信息：

```bash
docker-compose logs -f [service-name]
```

#### 4.3 数据库连接问题

确保 PostgreSQL、TDengine 和 Redis 服务正常运行，检查环境变量配置是否正确。

## 📁 项目结构

### 整体结构

```
baccano-iot/
├── backend/                      # 后端微服务集群（Maven多模块项目）
│   ├── pom.xml                   # 父POM文件
│   ├── common/                   # 公共模块
│   │   ├── pom.xml               # 公共模块POM
│   │   ├── common-core           # 核心公共组件
│   │   ├── common-utils          # 工具类
│   │   └── common-mybatis        # MyBatis扩展
│   ├── api-gateway/              # API网关服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── auth-service/             # 认证授权服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── device-connect/           # 设备连接服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── device-manager/           # 设备管理服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── asset-manager/            # 资产管理服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── rule-engine/              # 规则引擎服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   ├── alert-center/             # 告警中心服务
│   │   ├── pom.xml               # 服务POM文件
│   │   ├── src/                  # 源代码
│   │   └── target/               # 构建输出目录
│   └── protocol-adapter/         # 协议适配服务
│       ├── pom.xml               # 服务POM文件
│       ├── src/                  # 源代码
│       └── target/               # 构建输出目录
├── web-ui/                       # 前端应用
│   ├── src/
│   │   ├── api/                  # API接口封装 - 与后端服务交互
│   │   ├── components/           # 公共组件 - 可复用UI组件
│   │   ├── features/             # 功能模块 - 业务功能实现
│   │   │   ├── dashboard/        # 仪表盘功能
│   │   │   ├── device/           # 设备管理功能
│   │   │   ├── asset/            # 资产管理功能
│   │   │   ├── rule/             # 规则引擎功能
│   │   │   └── alert/            # 告警管理功能
│   │   ├── pages/                # 页面组件 - 路由页面
│   │   ├── hooks/                # 自定义hooks - 业务逻辑复用
│   │   ├── styles/               # 样式文件 - 全局和组件样式
│   │   ├── @types/               # TypeScript类型定义
│   │   └── utils/                # 工具函数 - 通用工具
│   ├── public/                   # 静态资源
│   ├── package.json              # 前端依赖配置
│   ├── vite.config.ts            # Vite构建配置
│   └── tsconfig.json             # TypeScript配置
├── docs/                         # 项目文档
│   ├── architecture/             # 架构文档
│   ├── api/                      # API文档
│   ├── deployment/               # 部署文档
│   ├── development/              # 开发文档
│   └── user-guide/               # 用户指南
├── scripts/                      # 构建和部署脚本
│   ├── build.sh                  # 构建脚本
│   ├── deploy.sh                 # 部署脚本
│   └── docker-up.sh              # Docker启动脚本
├── k8s/                          # Kubernetes部署配置
├── docker/                       # Docker相关配置
│   ├── Dockerfile.api-gateway    # API网关Dockerfile
│   ├── Dockerfile.auth-service   # 认证服务Dockerfile
│   └── ...                       # 其他服务Dockerfile
├── .env.example                  # 环境变量示例
├── docker-compose.yml            # Docker Compose配置
├── docker-compose.dev.yml        # 开发环境Docker Compose配置
├── docker-compose.test.yml       # 测试环境Docker Compose配置
├── project_design.md             # 项目设计文档
└── README.md                     # 项目说明文档
```

### 模块间依赖关系

```mermaid
graph TD
    WebUI --> APIGateway
    APIGateway --> AuthService
    APIGateway --> DeviceManager
    APIGateway --> AssetManager
    APIGateway --> RuleEngine
    APIGateway --> AlertCenter
    
    DeviceGateway --> DeviceConnect
    ProtocolAdapter --> DeviceConnect
    DeviceConnect --> Redis
    DeviceConnect --> TDengine
    DeviceConnect --> RocketMQ
    
    DeviceManager --> PostgreSQL
    DeviceManager --> Redis
    DeviceManager --> RocketMQ
    
    AssetManager --> PostgreSQL
    AssetManager --> TDengine
    AssetManager --> RocketMQ
    
    RuleEngine --> PostgreSQL
    RuleEngine --> TDengine
    RuleEngine --> RocketMQ
    
    AlertCenter --> PostgreSQL
    AlertCenter --> RocketMQ
    AlertCenter --> WebSocket
    
    AuthService --> PostgreSQL
    AuthService --> Redis
    
    subgraph 服务注册与配置中心
        Nacos[Nacos]
    end
    
    APIGateway --> Nacos
    AuthService --> Nacos
    DeviceConnect --> Nacos
    DeviceManager --> Nacos
    AssetManager --> Nacos
    RuleEngine --> Nacos
    AlertCenter --> Nacos
    ProtocolAdapter --> Nacos
    
    subgraph 消息队列
        RocketMQ[RocketMQ]
    end
    
    subgraph 数据库
        PostgreSQL[PostgreSQL]
        TDengine[TDengine]
        Redis[Redis]
    end
```

### 模块职责说明

#### 后端服务

| 模块 | 主要职责 | 核心功能 | 技术栈 |
|------|----------|----------|--------|
| **api-gateway** | 统一API入口 | 请求路由、负载均衡、认证授权、限流熔断 | Spring Cloud Gateway、Spring Security |
| **auth-service** | 认证授权 | 用户认证、设备认证、权限管理、JWT生成 | Spring Security、JJWT |
| **device-connect** | 设备连接管理 | 设备连接维护、心跳检测、数据转发 | SpringBoot、Netty |
| **device-manager** | 设备管理 | 设备注册、设备配置、设备状态管理 | SpringBoot、MyBatis Plus |
| **asset-manager** | 资产管理 | 资产树管理、设备关联、资产属性 | SpringBoot、MyBatis Plus |
| **rule-engine** | 规则引擎 | 规则定义、规则执行、数据处理 | SpringBoot、Drools |
| **alert-center** | 告警中心 | 告警生成、告警通知、告警处理 | SpringBoot、WebSocket |
| **protocol-adapter** | 协议适配 | Modbus/OPC UA协议转换 | SpringBoot、modbus4j |
| **common** | 公共模块 | 公共组件、工具类、扩展 | SpringBoot |

#### 前端应用

| 模块 | 主要职责 | 核心功能 |
|------|----------|----------|
| **api** | API接口封装 | 统一API调用、错误处理、请求拦截 |
| **components** | 公共组件 | UI组件复用、样式统一 |
| **features/dashboard** | 仪表盘 | 设备概览、数据统计、告警统计 |
| **features/device** | 设备管理 | 设备列表、设备详情、设备控制 |
| **features/asset** | 资产管理 | 资产树、资产详情、设备关联 |
| **features/rule** | 规则引擎 | 规则定义、规则链设计、规则执行 |
| **features/alert** | 告警管理 | 告警列表、告警详情、告警处理 |
| **styles** | 样式管理 | 全局样式、主题配置 |
| **utils** | 工具函数 | 通用工具、辅助函数 |

## ✨ 核心功能

### 1. 设备连接与管理

#### 设计架构

设备连接管理采用分层设计，支持海量设备并发连接，具备高可用性和弹性伸缩能力。

```mermaid
graph TD
    subgraph 设备接入层
        MQTT[MQTT Broker Cluster]
        CoAP[CoAP Server Cluster]
        HTTP[HTTP Server Cluster]
        MODBUS[Modbus Adapter]
        OPCUA[OPC UA Adapter]
    end
    
    subgraph 连接管理层
        DeviceSession[设备会话管理]
        AuthManager[认证授权管理]
        HeartbeatManager[心跳检测]
        MessageRouter[消息路由]
    end
    
    subgraph 设备管理层
        DeviceRegistry[设备注册中心]
        ConfigManager[配置管理]
        StatusTracker[状态跟踪]
        CommandExecutor[命令执行]
    end
    
    MQTT --> DeviceSession
    CoAP --> DeviceSession
    HTTP --> DeviceSession
    MODBUS --> DeviceSession
    OPCUA --> DeviceSession
    
    DeviceSession --> AuthManager
    DeviceSession --> HeartbeatManager
    DeviceSession --> MessageRouter
    
    AuthManager --> DeviceRegistry
    DeviceSession --> DeviceRegistry
    MessageRouter --> ConfigManager
    MessageRouter --> StatusTracker
    MessageRouter --> CommandExecutor
```

#### 核心特性

- **多协议支持**：全面支持 MQTT 3.1.1/5.0、CoAP、HTTP、Modbus RTU/TCP、OPC UA 等协议
- **海量连接**：单实例支持 10 万级设备并发连接，集群可扩展至百万级
- **设备生命周期管理**：完整的设备注册、激活、在线、离线、注销生命周期管理
- **双向通信**：支持设备数据上报和平台下发控制命令
- **认证授权**：支持设备密钥认证、证书认证、用户名密码认证等多种认证方式
- **状态监控**：实时监控设备连接状态、在线时长、消息统计等
- **心跳机制**：可配置的心跳检测机制，及时发现设备离线

#### 技术实现

- 使用 Eclipse Mosquitto 作为 MQTT Broker，支持集群部署
- CoAP 服务基于 Californium 实现，支持 DTLS 加密
- 设备会话管理采用 Netty + Redis 存储，保证高可用性
- 消息路由基于 RocketMQ 消息总线，实现异步通信
- 服务注册与发现基于 Nacos 实现

### 2. 物模型管理

#### 设计理念

物模型是连接物理世界和数字世界的桥梁，采用标准化的模型定义，实现设备的数字化表示。

#### 模型结构

```json
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
  "services": [
    {
      "identifier": "reboot",
      "name": "重启设备",
      "input": [],
      "output": {
        "result": {
          "type": "string"
        }
      }
    }
  ],
  "events": [
    {
      "identifier": "over_temperature",
      "name": "温度过高",
      "params": {
        "temperature": {
          "type": "float"
        }
      }
    }
  ]
}
```

#### 核心特性

- **标准化定义**：采用 JSON Schema 标准化设备模型定义
- **属性管理**：支持可读/可写/读写属性，自动数据类型校验
- **服务调用**：支持设备远程服务调用，双向数据传递
- **事件上报**：支持设备事件上报，用于异常通知和状态变更
- **设备影子**：实现设备状态的云端镜像，支持离线设备操作
- **版本控制**：支持物模型版本管理和兼容性检查
- **模型继承**：支持模型继承和复用，提高开发效率

#### 技术实现

- 物模型定义存储在 PostgreSQL 中，使用 MyBatis Plus 进行数据访问
- 设备影子数据存储在 Redis 和 TDengine 中，实现设备状态的云端镜像
- 数据校验基于 Spring Validation + JSON Schema 实现
- 支持设备模型的导入导出和批量管理
- 服务间通信基于 Dubbo 实现

### 3. 数据采集与存储

#### 架构设计

数据采集与存储采用分层设计，支持实时数据处理和历史数据查询，具备高性能和高可靠性。

```mermaid
graph TD
    subgraph 数据采集层
        MessageQueue[NATS JetStream]
        ProtocolAdapter[协议适配器]
    end
    
    subgraph 数据处理层
        DataValidator[数据校验]
        DataTransformer[数据转换]
        DataEnricher[数据 enrichment]
    end
    
    subgraph 存储层
        TDengine[TDengine 时序库]
        PostgreSQL[PostgreSQL 关系库]
        Redis[Redis 缓存]
    end
    
    subgraph 数据访问层
        QueryEngine[查询引擎]
        API[REST API]
        SDK[客户端 SDK]
    end
    
    MessageQueue --> DataValidator
    ProtocolAdapter --> MessageQueue
    DataValidator --> DataTransformer
    DataTransformer --> DataEnricher
    DataEnricher --> TDengine
    DataEnricher --> PostgreSQL
    DataEnricher --> Redis
    
    TDengine --> QueryEngine
    PostgreSQL --> QueryEngine
    Redis --> QueryEngine
    QueryEngine --> API
    QueryEngine --> SDK
```

#### 核心特性

- **实时数据采集**：支持毫秒级数据采集和处理
- **高性能存储**：TDengine 时序数据库，支持高压缩率和快速查询
- **多样化存储**：根据数据类型选择合适的存储方案
- **数据生命周期管理**：支持数据自动过期和归档
- **高效查询**：支持时间范围查询、聚合查询、多维度分析
- **数据导出**：支持数据导出为 CSV、JSON 等格式

#### 技术实现

- 实时数据通过 RocketMQ 消息总线进行流转
- 时序数据存储在 TDengine 中，使用 TDengine JDBC 驱动访问
- 元数据和业务数据存储在 PostgreSQL 中，使用 MyBatis Plus 进行数据访问
- 热点数据和设备状态缓存在 Redis 中，使用 Spring Data Redis 访问
- 查询引擎基于 Spring Boot + MyBatis Plus 实现，支持 SQL 和 REST API 两种查询方式
- 服务注册与配置基于 Nacos 实现

### 4. 规则引擎

#### 设计架构

规则引擎采用可视化规则链设计，支持复杂的数据处理逻辑和业务规则，具备高扩展性和易用性。

```mermaid
graph TD
    subgraph 规则定义层
        RuleEditor[可视化规则编辑器]
        RuleStore[规则存储]
        RuleCompiler[规则编译]
    end
    
    subgraph 规则执行层
        RuleScheduler[规则调度]
        RuleExecutor[规则执行器]
        NodeProcessor[节点处理器]
        ContextManager[上下文管理]
    end
    
    subgraph 规则节点库
        FilterNode[过滤节点]
        TransformNode[转换节点]
        EnrichNode[ enrichment 节点]
        AlertNode[告警节点]
        ActionNode[动作节点]
        TimerNode[定时器节点]
    end
    
    RuleEditor --> RuleStore
    RuleStore --> RuleCompiler
    RuleCompiler --> RuleExecutor
    
    RuleScheduler --> RuleExecutor
    RuleExecutor --> NodeProcessor
    NodeProcessor --> ContextManager
    
    NodeProcessor --> FilterNode
    NodeProcessor --> TransformNode
    NodeProcessor --> EnrichNode
    NodeProcessor --> AlertNode
    NodeProcessor --> ActionNode
    NodeProcessor --> TimerNode
```

#### 核心特性

- **可视化规则设计**：拖拽式规则链设计，无需编码
- **丰富的规则节点**：支持过滤、转换、 enrichment 、告警、动作等多种节点类型
- **条件判断**：支持复杂的条件表达式和逻辑组合
- **动作执行**：支持发送告警、调用 API、存储数据等多种动作
- **定时任务**：支持基于时间的规则触发
- **规则版本管理**：支持规则的版本控制和灰度发布
- **高并发执行**：支持规则的并行执行和负载均衡

#### 技术实现

- 规则定义采用 JSON 格式存储在 PostgreSQL 中
- 规则执行基于 Drools + DAG (有向无环图) 实现
- 支持规则的动态加载、更新和热部署
- 规则执行状态实时监控和统计
- 使用 Spring Boot Actuator 实现监控和管理
- 服务注册与配置基于 Nacos 实现

### 5. 告警中心

#### 设计架构

告警中心采用分布式设计，支持实时告警监控、多级告警策略和多样化通知方式，具备高可靠性和可扩展性。

```mermaid
graph TD
    subgraph 告警生成层
        AlertDetector[告警检测器]
        RuleEngine[规则引擎]
        ManualTrigger[手动触发]
    end
    
    subgraph 告警处理层
        AlertProcessor[告警处理器]
        Deduplication[告警去重]
        Correlation[告警关联]
        Escalation[告警升级]
    end
    
    subgraph 告警存储层
        AlertStore[告警存储]
        AlertHistory[告警历史]
        AlertStats[告警统计]
    end
    
    subgraph 告警通知层
        NotificationManager[通知管理器]
        Email[Email 通知]
        SMS[SMS 通知]
        WebHook[WebHook]
        AppPush[App 推送]
        WeChat[微信通知]
        DingTalk[钉钉通知]
    end
    
    AlertDetector --> AlertProcessor
    RuleEngine --> AlertDetector
    ManualTrigger --> AlertDetector
    
    AlertProcessor --> Deduplication
    Deduplication --> Correlation
    Correlation --> Escalation
    Escalation --> AlertStore
    
    AlertStore --> AlertHistory
    AlertStore --> AlertStats
    AlertStore --> NotificationManager
    
    NotificationManager --> Email
    NotificationManager --> SMS
    NotificationManager --> WebHook
    NotificationManager --> AppPush
    NotificationManager --> WeChat
    NotificationManager --> DingTalk
```

#### 核心特性

- **多渠道告警触发**：支持规则触发、手动触发等多种告警生成方式
- **智能告警处理**：告警去重、关联分析、升级策略
- **多样化通知方式**：支持 Email、SMS、WebHook、App 推送、微信、钉钉等
- **告警生命周期管理**：告警确认、处理、关闭、归档
- **告警统计分析**：支持多维度告警统计和趋势分析
- **告警抑制**：支持告警抑制规则，减少告警风暴

#### 技术实现

- 告警数据存储在 PostgreSQL 中，使用 MyBatis Plus 进行数据访问
- 告警通知采用 Spring Boot Async + RocketMQ 异步处理，支持批量发送
- 支持告警模板自定义，基于 Freemarker 模板引擎
- 告警统计数据实时更新，使用 Redis 实现缓存
- 服务注册与配置基于 Nacos 实现

### 6. 资产管理

#### 设计架构

资产管理采用树形结构设计，支持设备与资产的关联管理，具备地理位置管理和资产属性定义功能。

```mermaid
graph TD
    subgraph 资产模型层
        AssetType[资产类型定义]
        AssetProperty[资产属性定义]
        AssetRelation[资产关系定义]
    end
    
    subgraph 资产管理层
        AssetTree[资产树管理]
        DeviceAssociator[设备关联]
        GeoManager[地理位置管理]
        PropertyManager[属性管理]
    end
    
    subgraph 资产应用层
        AssetViewer[资产可视化]
        AssetStats[资产统计]
        AssetAlarm[资产告警]
        AssetReport[资产报表]
    end
    
    AssetType --> AssetTree
    AssetProperty --> PropertyManager
    AssetRelation --> AssetTree
    
    AssetTree --> AssetViewer
    DeviceAssociator --> AssetTree
    GeoManager --> AssetViewer
    PropertyManager --> AssetStats
    
    AssetViewer --> AssetStats
    AssetStats --> AssetReport
    AssetTree --> AssetAlarm
```

#### 核心特性

- **树形资产结构**：支持无限层级的资产树结构
- **设备关联**：支持多对多的设备与资产关联
- **地理位置管理**：支持资产地理位置标记和地图可视化
- **资产属性定义**：支持自定义资产属性和数据类型
- **资产统计分析**：支持资产数量、状态、告警等多维度统计
- **资产报表**：支持资产信息导出和报表生成

#### 技术实现

- 资产数据存储在 PostgreSQL 中，使用 MyBatis Plus 进行数据访问
- 地理位置数据支持多种坐标系，基于 GeoTools 实现
- 资产树采用递归查询和 Redis 缓存优化
- 支持资产的批量导入导出，基于 EasyExcel 实现
- 服务注册与配置基于 Nacos 实现

### 7. 数据可视化

#### 设计架构

数据可视化采用模块化设计，支持实时数据监控、多样化图表展示和自定义仪表盘，具备良好的用户体验。

```mermaid
graph TD
    subgraph 数据源层
        RealTimeData[实时数据流]
        HistoricalData[历史数据集]
        AssetData[资产数据]
        AlarmData[告警数据]
    end
    
    subgraph 可视化组件层
        ChartLibrary[图表库]
        DashboardBuilder[仪表盘构建器]
        WidgetManager[组件管理器]
        DataSourceManager[数据源管理]
    end
    
    subgraph 可视化应用层
        RealTimeMonitor[实时监控]
        HistoricalAnalysis[历史分析]
        CustomDashboard[自定义仪表盘]
        ReportGenerator[报表生成]
        MapVisualization[地图可视化]
    end
    
    RealTimeData --> DataSourceManager
    HistoricalData --> DataSourceManager
    AssetData --> DataSourceManager
    AlarmData --> DataSourceManager
    
    DataSourceManager --> DashboardBuilder
    ChartLibrary --> WidgetManager
    WidgetManager --> DashboardBuilder
    
    DashboardBuilder --> RealTimeMonitor
    DashboardBuilder --> HistoricalAnalysis
    DashboardBuilder --> CustomDashboard
    DashboardBuilder --> ReportGenerator
    DashboardBuilder --> MapVisualization
```

#### 核心特性

- **实时数据监控**：支持毫秒级数据更新和展示
- **多样化图表**：支持折线图、柱状图、饼图、散点图、热力图等多种图表类型
- **自定义仪表盘**：拖拽式仪表盘设计，支持多种组件组合
- **数据趋势分析**：支持历史数据对比和趋势预测
- **地图可视化**：支持资产和设备的地图展示
- **报表生成与导出**：支持自定义报表模板和多种导出格式

#### 技术实现

- 基于 Recharts 实现图表展示（与前端实际使用的图表库一致）
- 实时数据通过 Spring WebSocket 推送
- 仪表盘模板保存和共享基于 PostgreSQL 实现
- 报表生成基于 Spring Boot Async 实现异步处理
- 服务注册与配置基于 Nacos 实现

### 8. 认证与授权

#### 设计架构

认证与授权采用 OAuth 2.0 + JWT 架构，支持多租户隔离和细粒度权限控制。

```mermaid
graph TD
    subgraph 认证层
        OAuth2Server[OAuth 2.0 Server]
        JWTManager[JWT 管理]
        UserStore[用户存储]
        DeviceStore[设备存储]
    end
    
    subgraph 授权层
        RBAC[基于角色的权限控制]
        PolicyEngine[策略引擎]
        PermissionStore[权限存储]
    end
    
    subgraph 应用层
        APIProtection[API 保护]
        WebUIProtection[Web UI 保护]
        DeviceAccessControl[设备访问控制]
    end
    
    OAuth2Server --> JWTManager
    OAuth2Server --> UserStore
    OAuth2Server --> DeviceStore
    
    JWTManager --> APIProtection
    JWTManager --> WebUIProtection
    JWTManager --> DeviceAccessControl
    
    RBAC --> PolicyEngine
    PolicyEngine --> PermissionStore
    PolicyEngine --> APIProtection
    PolicyEngine --> WebUIProtection
```

#### 核心特性

- **多租户支持**：基于租户的资源隔离和权限控制
- **细粒度权限**：支持基于角色和资源的细粒度权限控制
- **多种认证方式**：支持用户名密码、短信验证码、第三方登录等
- **设备认证**：支持设备密钥认证和证书认证
- **安全审计**：完整的操作日志和安全审计

#### 技术实现

- 基于 Spring Security + OAuth 2.0 协议实现认证授权
- JWT 用于无状态认证，基于 JJWT 库实现
- RBAC 模型实现权限管理，基于 Spring Security ACL
- 支持权限的动态更新和 Redis 缓存
- 服务注册与配置基于 Nacos 实现

## 📚 API 文档

### API 概述

Baccano-IoT 提供 RESTful API 接口，支持设备管理、数据查询、规则引擎、告警管理等功能。所有 API 均通过 API 网关统一暴露，采用 OAuth 2.0 + JWT 认证机制。

### 认证授权

#### 1. 用户认证

```bash
# 用户登录，获取JWT
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**响应示例：**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "username": "admin",
    "tenant_id": "tenant-123"
  }
}
```

#### 2. 设备认证

设备可以通过 MQTT/CoAP/HTTP 协议进行认证，支持以下认证方式：

- **密钥认证**：使用设备密钥进行认证
- **证书认证**：使用 X.509 证书进行认证
- **Token 认证**：使用预先生成的设备 Token 进行认证

### API 版本管理

API 采用版本化设计，版本号通过 URL 路径区分，例如 `/api/v1/` 表示 API 版本 1.0。

### 错误处理

所有 API 错误均返回统一的错误格式：

```json
{
  "code": "ERROR_CODE",
  "message": "错误描述",
  "details": {
    "field": "错误字段",
    "reason": "错误原因"
  }
}
```

### 核心 API 接口

#### 1. 设备管理 API

##### 创建设备

```bash
POST /api/v1/devices
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度传感器01",
  "productId": "product-123",
  "deviceType": "sensor",
  "tenantId": "tenant-123",
  "labels": ["temperature", "indoor"],
  "location": {
    "latitude": 39.9042,
    "longitude": 116.4074,
    "altitude": 0
  },
  "credential": {
    "type": "secret",
    "secret": "device-secret-123"
  }
}
```

##### 获取设备列表

```bash
GET /api/v1/devices?page=1&pageSize=20&status=online&productId=product-123
Authorization: Bearer {jwt}
```

##### 获取设备详情

```bash
GET /api/v1/devices/{deviceId}
Authorization: Bearer {jwt}
```

##### 更新设备信息

```bash
PUT /api/v1/devices/{deviceId}
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度传感器01_更新",
  "labels": ["temperature", "outdoor"]
}
```

##### 删除设备

```bash
DELETE /api/v1/devices/{deviceId}
Authorization: Bearer {jwt}
```

##### 批量创建设备

```bash
POST /api/v1/devices/batch
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "devices": [
    {
      "name": "温度传感器02",
      "productId": "product-123",
      "credential": {
        "type": "secret",
        "secret": "device-secret-02"
      }
    },
    {
      "name": "温度传感器03",
      "productId": "product-123",
      "credential": {
        "type": "secret",
        "secret": "device-secret-03"
      }
    }
  ]
}
```

#### 2. 设备控制 API

##### 调用设备服务

```bash
POST /api/v1/devices/{deviceId}/rpc
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "service": "reboot",
  "params": {
    "delay": 10
  },
  "timeout": 30
}
```

##### 下发设备配置

```bash
POST /api/v1/devices/{deviceId}/config
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "config": {
    "interval": 60,
    "threshold": 30
  }
}
```

##### 获取设备配置

```bash
GET /api/v1/devices/{deviceId}/config
Authorization: Bearer {jwt}
```

#### 3. 物模型管理 API

##### 创建产品

```bash
POST /api/v1/products
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度传感器",
  "description": "高精度温度监测设备",
  "protocol": "MQTT",
  "tenantId": "tenant-123"
}
```

##### 更新产品物模型

```bash
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
    },
    {
      "identifier": "humidity",
      "name": "湿度",
      "accessMode": "r",
      "dataType": {
        "type": "float",
        "specs": {
          "min": 0,
          "max": 100,
          "unit": "%"
        }
      }
    }
  ],
  "services": [
    {
      "identifier": "reboot",
      "name": "重启设备",
      "input": [
        {
          "name": "delay",
          "dataType": {
            "type": "integer",
            "specs": {
              "min": 0,
              "max": 3600
            }
          }
        }
      ],
      "output": {
        "result": {
          "type": "string"
        }
      }
    }
  ],
  "events": [
    {
      "identifier": "over_temperature",
      "name": "温度过高",
      "params": {
        "temperature": {
          "type": "float"
        },
        "threshold": {
          "type": "float"
        }
      }
    }
  ]
}
```

##### 获取产品物模型

```bash
GET /api/v1/products/{productId}/thing-model
Authorization: Bearer {jwt}
```

#### 4. 数据查询 API

##### 获取设备最新遥测数据

```bash
GET /api/v1/telemetry/{deviceId}/latest?keys=temperature,humidity
Authorization: Bearer {jwt}
```

##### 获取历史遥测数据

```bash
GET /api/v1/telemetry/{deviceId}/history?startTs=1672531200000&endTs=1672617600000&interval=1h&keys=temperature
Authorization: Bearer {jwt}
```

##### 获取设备事件

```bash
GET /api/v1/events/{deviceId}?startTs=1672531200000&endTs=1672617600000&limit=10&offset=0&type=over_temperature
Authorization: Bearer {jwt}
```

##### 批量查询设备数据

```bash
POST /api/v1/telemetry/batch/latest
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "deviceIds": ["device-123", "device-456"],
  "keys": ["temperature", "humidity"]
}
```

#### 5. 规则引擎 API

##### 创建规则

```bash
POST /api/v1/rules
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "温度告警规则",
  "productId": "product-123",
  "enabled": true,
  "nodes": [
    {
      "id": "filter-1",
      "type": "filter",
      "config": {
        "condition": "temperature > 30"
      }
    },
    {
      "id": "alert-1",
      "type": "alert",
      "config": {
        "level": "warning",
        "message": "设备温度过高: ${temperature}℃"
      }
    }
  ],
  "connections": [
    {
      "from": "filter-1",
      "to": "alert-1",
      "relation": "true"
    }
  ]
}
```

##### 获取规则列表

```bash
GET /api/v1/rules?page=1&pageSize=20&enabled=true&productId=product-123
Authorization: Bearer {jwt}
```

##### 启用/禁用规则

```bash
POST /api/v1/rules/{ruleId}/status
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "enabled": false
}
```

#### 6. 告警管理 API

##### 获取告警列表

```bash
GET /api/v1/alerts?page=1&pageSize=20&level=warning&status=active&deviceId=device-123
Authorization: Bearer {jwt}
```

##### 确认告警

```bash
POST /api/v1/alerts/{alertId}/acknowledge
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "acknowledgedBy": "admin",
  "comment": "已收到告警，正在处理"
}
```

##### 关闭告警

```bash
POST /api/v1/alerts/{alertId}/close
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "closedBy": "admin",
  "comment": "告警已处理完毕"
}
```

##### 获取告警统计

```bash
GET /api/v1/alerts/stats?startTs=1672531200000&endTs=1672617600000&groupBy=level
Authorization: Bearer {jwt}
```

#### 7. 资产管理 API

##### 创建资产

```bash
POST /api/v1/assets
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "name": "生产车间A",
  "assetType": "workshop",
  "parentId": "asset-001",
  "tenantId": "tenant-123",
  "location": {
    "latitude": 39.9042,
    "longitude": 116.4074
  },
  "properties": {
    "area": 1000,
    "capacity": 500
  }
}
```

##### 获取资产树

```bash
GET /api/v1/assets/tree?rootId=asset-001&depth=2
Authorization: Bearer {jwt}
```

##### 关联设备到资产

```bash
POST /api/v1/assets/{assetId}/devices
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "deviceIds": ["device-123", "device-456"]
}
```

### SDK 支持

Baccano-IoT 提供多种语言的 SDK，方便开发者快速集成平台功能：

- **Java SDK**: 支持 Java 17+，适用于后端服务开发
- **JavaScript SDK**: 支持浏览器和 Node.js 环境
- **Python SDK**: 支持 Python 3.8+，适用于数据分析和脚本开发
- **C/C++ SDK**: 适用于嵌入式设备开发

### API 最佳实践

1. **使用 HTTPS**: 生产环境中建议使用 HTTPS 加密通信
2. **合理设置超时**: 根据业务需求设置合适的请求超时时间
3. **使用分页查询**: 对于大量数据查询，使用分页参数控制返回数据量
4. **缓存频繁访问的数据**: 对于频繁访问的设备数据，可以使用缓存提高性能
5. **合理使用批量接口**: 对于批量操作，使用批量接口减少 API 请求次数
6. **监控 API 调用**: 监控 API 调用频率和响应时间，及时发现问题
7. **遵循 API 版本规则**: 关注 API 版本更新，及时迁移到新的 API 版本

### 限流与配额

API 网关实现了限流机制，保护系统免受恶意请求攻击：

- **请求频率限制**: 每个租户默认每秒最多 100 个请求
- **并发连接限制**: 每个租户默认最多 50 个并发连接
- **数据量限制**: 单个请求返回数据量默认不超过 1MB

### 文档自动生成

平台提供 Swagger UI 文档，方便开发者查阅和测试 API：

- Swagger UI 地址: http://localhost:8080/swagger-ui
- API 文档 JSON: http://localhost:8080/v3/api-docs

### API 变更通知

对于 API 变更，平台将通过以下方式通知开发者：

- 版本更新日志
- 邮件通知（需订阅）
- 平台公告

### API 支持与反馈

如有 API 相关问题或建议，可通过以下渠道反馈：

- GitHub Issues: https://github.com/your-org/baccano-iot/issues
- 社区论坛: https://forum.baccano-iot.io
- 邮件支持: support@baccano-iot.io

## 🔌 协议接入

Baccano-IoT 支持多种物联网协议，设备可以通过不同的协议接入平台。平台采用统一的协议适配层，将不同协议的设备数据转换为统一的内部格式进行处理。

### 1. MQTT 协议

MQTT 是物联网领域最常用的协议之一，Baccano-IoT 支持 MQTT 3.1.1 和 MQTT 5.0 版本，支持 QoS 0、1、2 三个服务质量等级。

#### 连接参数

| 参数 | 说明 | 示例 |
|------|------|------|
| **Host** | MQTT Broker 地址 | localhost |
| **Port** | MQTT Broker 端口 | 1883 (TCP) / 8883 (SSL/TLS) |
| **ClientID** | 客户端 ID，建议使用设备 ID | device-123 |
| **Username** | 用户名，使用产品 ID | product-123 |
| **Password** | 密码，使用设备密钥 | device-secret-123 |
| **Clean Session** | 是否清除会话 | true/false |
| **Keep Alive** | 心跳间隔（秒） | 60 |

#### 主题结构

平台采用分层主题结构，便于设备数据的路由和处理：

```
v1/{productId}/{deviceId}/{messageType}/{subType}
```

#### 遥测数据上报

```bash
# 主题
v1/{productId}/{deviceId}/telemetry

# 负载格式
{
  "timestamp": 1672531200000,  # 可选，设备本地时间戳
  "temperature": 25.6,         # 温度数据
  "humidity": 65.2,            # 湿度数据
  "pressure": 1013.25          # 气压数据
}

# 使用 mosquitto_pub 工具发布数据
mosquitto_pub -h localhost -p 1883 -u "product-123" -P "device-secret-123" -t "v1/product-123/device-123/telemetry" -m '{"temperature": 25.6, "humidity": 65.2}'
```

#### 设备属性上报

```bash
# 主题
v1/{productId}/{deviceId}/attributes

# 负载格式
{
  "firmwareVersion": "1.0.0",
  "batteryLevel": 85,
  "signalStrength": -65
}
```

#### 设备事件上报

```bash
# 主题
v1/{productId}/{deviceId}/events/{eventType}

# 负载格式
{
  "timestamp": 1672531200000,
  "temperature": 85.5,
  "threshold": 80.0
}

# 示例：温度过高事件
mosquitto_pub -h localhost -p 1883 -u "product-123" -P "device-secret-123" -t "v1/product-123/device-123/events/over_temperature" -m '{"temperature": 85.5, "threshold": 80.0}'
```

#### 接收平台命令

```bash
# 订阅主题
v1/{productId}/{deviceId}/commands/+  # 订阅所有命令
或
v1/{productId}/{deviceId}/commands/{commandType}  # 订阅特定类型命令

# 使用 mosquitto_sub 工具订阅命令
mosquitto_sub -h localhost -p 1883 -u "product-123" -P "device-secret-123" -t "v1/product-123/device-123/commands/+"
```

#### 命令响应

```bash
# 主题
v1/{productId}/{deviceId}/commands/{commandId}/response

# 负载格式
{
  "success": true,
  "result": "设备已重启",
  "error": null
}
```

### 2. CoAP 协议

CoAP 是一种轻量级的物联网协议，适合资源受限的设备，Baccano-IoT 支持 CoAP 1.0 版本，支持 DTLS 加密。

#### 连接参数

| 参数 | 说明 | 示例 |
|------|------|------|
| **Host** | CoAP Server 地址 | localhost |
| **Port** | CoAP Server 端口 | 5683 (UDP) / 5684 (DTLS) |
| **Protocol** | 传输协议 | UDP/DTLS |
| **Path** | 请求路径 | /v1/{productId}/{deviceId}/{messageType} |

#### 遥测数据上报

```bash
# 请求方法
POST

# 请求路径
/v1/{productId}/{deviceId}/telemetry

# 请求头
Content-Format: application/json

# 请求体
{
  "temperature": 25.6,
  "humidity": 65.2
}

# 使用 coap-client 工具发送数据
coap-client -m post -e '{"temperature": 25.6, "humidity": 65.2}' coap://localhost:5683/v1/product-123/device-123/telemetry
```

#### 设备属性上报

```bash
# 请求方法
POST

# 请求路径
/v1/{productId}/{deviceId}/attributes

# 请求体
{
  "firmwareVersion": "1.0.0",
  "batteryLevel": 85
}
```

#### 获取设备配置

```bash
# 请求方法
GET

# 请求路径
/v1/{productId}/{deviceId}/config

# 使用 coap-client 工具获取配置
coap-client -m get coap://localhost:5683/v1/product-123/device-123/config
```

### 3. HTTP 协议

HTTP 协议是一种通用的网络协议，适合偶尔上报数据的设备，Baccano-IoT 支持 HTTP 1.1 版本，支持 HTTPS 加密。

#### 基础 URL

```
http://localhost:8081/v1
```

#### 认证方式

HTTP 协议支持两种认证方式：

1. **基本认证（Basic Auth）**：使用产品 ID 作为用户名，设备密钥作为密码
2. **API Key 认证**：在请求头中添加 `X-Api-Key` 字段

#### 遥测数据上报

```bash
# 请求方法
POST

# 请求 URL
http://localhost:8081/v1/{productId}/{deviceId}/telemetry

# 请求头
Content-Type: application/json
Authorization: Basic cHJvZHVjdC0xMjM6ZGV2aWNlLXNlY3JldC0xMjM=

# 请求体
{
  "temperature": 25.6,
  "humidity": 65.2,
  "timestamp": 1672531200000
}

# 使用 curl 工具发送数据
curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic cHJvZHVjdC0xMjM6ZGV2aWNlLXNlY3JldC0xMjM=" -d '{"temperature": 25.6, "humidity": 65.2}' http://localhost:8081/v1/product-123/device-123/telemetry
```

#### 设备属性上报

```bash
# 请求方法
POST

# 请求 URL
http://localhost:8081/v1/{productId}/{deviceId}/attributes

# 请求体
{
  "firmwareVersion": "1.0.0",
  "batteryLevel": 85
}
```

#### 调用设备服务

```bash
# 请求方法
POST

# 请求 URL
http://localhost:8081/v1/{productId}/{deviceId}/rpc

# 请求体
{
  "service": "reboot",
  "params": {
    "delay": 10
  }
}
```

### 4. Modbus 协议

Modbus 是一种工业通信协议，Baccano-IoT 通过协议适配器支持 Modbus RTU 和 Modbus TCP 两种模式。

#### 配置参数

| 参数 | 说明 | 示例 |
|------|------|------|
| **Protocol** | 协议类型 | RTU/TCP |
| **Serial Port** | 串口（仅 RTU） | /dev/ttyUSB0 |
| **Baud Rate** | 波特率（仅 RTU） | 9600 |
| **Data Bits** | 数据位（仅 RTU） | 8 |
| **Parity** | 校验位（仅 RTU） | None/Odd/Even |
| **Stop Bits** | 停止位（仅 RTU） | 1 |
| **Host** | 主机地址（仅 TCP） | 192.168.1.100 |
| **Port** | 端口（仅 TCP） | 502 |
| **Slave ID** | 从站地址 | 1 |
| **Polling Interval** | 轮询间隔（毫秒） | 1000 |

#### 数据映射

需要在平台中配置 Modbus 寄存器与设备物模型属性的映射关系：

| 设备属性 | 寄存器类型 | 寄存器地址 | 数据类型 | 缩放因子 |
|----------|------------|------------|----------|----------|
| temperature | Holding Register | 0x0000 | Float32 | 0.1 |
| humidity | Holding Register | 0x0002 | Float32 | 0.1 |
| status | Coil | 0x0000 | Boolean | 1 |

### 5. OPC UA 协议

OPC UA 是一种工业自动化领域的通信协议，Baccano-IoT 通过协议适配器支持 OPC UA 协议。

#### 配置参数

| 参数 | 说明 | 示例 |
|------|------|------|
| **Endpoint URL** | OPC UA 服务器地址 | opc.tcp://localhost:4840 |
| **Security Mode** | 安全模式 | None/Sign/SignAndEncrypt |
| **Security Policy** | 安全策略 | None/Basic256/Basic256Sha256 |
| **Username** | 用户名 | admin |
| **Password** | 密码 | password |
| **Polling Interval** | 轮询间隔（毫秒） | 1000 |
| **Subscription Interval** | 订阅间隔（毫秒） | 500 |

#### 节点映射

需要在平台中配置 OPC UA 节点与设备物模型属性的映射关系：

| 设备属性 | OPC UA 节点 ID | 数据类型 |
|----------|----------------|----------|
| temperature | ns=2;s=Temperature | Double |
| humidity | ns=2;s=Humidity | Double |
| pressure | ns=2;s=Pressure | Double |

### 6. 协议适配最佳实践

1. **选择合适的协议**：根据设备的资源情况、网络环境和业务需求选择合适的协议
2. **使用加密通信**：生产环境中建议使用 SSL/TLS/DTLS 加密通信
3. **合理设置数据上报频率**：根据业务需求设置合适的数据上报频率，避免网络拥塞
4. **使用批量上报**：对于多属性设备，使用批量上报减少协议开销
5. **添加时间戳**：设备上报数据时添加本地时间戳，便于数据时序分析
6. **实现心跳机制**：定期发送心跳包，确保设备在线状态
7. **处理网络异常**：实现重连机制，处理网络波动和异常情况
8. **优化数据格式**：使用紧凑的数据格式（如 CBOR）减少数据传输量
9. **监控协议性能**：监控协议通信性能，及时发现和解决问题

### 7. 协议测试工具

平台提供了多种协议测试工具，方便开发者测试设备接入：

| 协议 | 测试工具 | 说明 |
|------|----------|------|
| MQTT | MQTT.fx、mosquitto_pub/sub | 桌面客户端和命令行工具 |
| CoAP | CoAP Client、libcoap | 桌面客户端和命令行工具 |
| HTTP | Postman、curl | 桌面客户端和命令行工具 |
| Modbus | Modbus Poll、QModMaster | 桌面测试工具 |
| OPC UA | UaExpert、OPC UA Client | 桌面测试工具 |

### 8. 协议网关扩展

平台支持通过插件方式扩展协议支持，开发者可以根据需要添加新的协议适配器：

1. **基于现有适配器扩展**：修改现有协议适配器代码，添加新的协议支持
2. **开发新的适配器**：基于平台提供的 SDK 开发新的协议适配器
3. **使用第三方适配器**：集成第三方协议转换网关

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

# 停止服务并删除所有数据
docker-compose down -v
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

# 查看部署状态
kubectl get pods -n baccano-iot

# 查看服务状态
kubectl get services -n baccano-iot

# 查看日志
kubectl logs -f deployment/api-gateway -n baccano-iot
```

### 环境变量配置

| 服务           | 环境变量           | 默认值                                         | 说明                 |
| -------------- | ------------------ | ---------------------------------------------- | -------------------- |
| api-gateway    | JWT_SECRET         | dev-secret                                     | JWT签名密钥          |
| api-gateway    | DEVICE_MANAGER_URL | http://device-manager:8082                     | 设备管理服务地址     |
| api-gateway    | ASSET_MANAGER_URL  | http://asset-manager:8084                      | 资产管理服务地址     |
| api-gateway    | RULE_ENGINE_URL    | http://rule-engine:8083                        | 规则引擎服务地址     |
| api-gateway    | ALERT_CENTER_URL   | http://alert-center:8086                       | 告警中心服务地址     |
| device-connect | NATS_URL           | nats://nats:4222                               | NATS服务地址         |
| device-connect | REDIS_ADDR         | redis:6379                                     | Redis服务地址        |
| device-connect | PG_URL             | postgres://postgres:postgres@postgres:5432/iot | PostgreSQL连接字符串 |
| device-connect | TDENGINE_URL       | http://tdengine:6041                           | TDengine连接地址     |
| rule-engine    | NATS_URL           | nats://nats:4222                               | NATS服务地址         |
| alert-center   | NATS_URL           | nats://nats:4222                               | NATS服务地址         |
| web-ui         | VITE_API_BASE_URL  | http://api-gateway:8080                        | API网关地址          |
| web-ui         | VITE_WS_BASE_URL   | ws://api-gateway:8080                          | WebSocket地址        |

### 监控与运维

#### 1. 监控系统

平台集成了 Prometheus 和 Grafana 监控系统，用于监控各服务的运行状态和性能指标：

- **Prometheus 地址**：http://localhost:9090
- **Grafana 地址**：http://localhost:3000 (admin/admin)

#### 2. 日志管理

平台使用 Loki 进行日志管理，支持日志的收集、查询和可视化：

- **Loki 地址**：http://localhost:3100
- **Grafana Loki 数据源**：http://loki:3100

#### 3. 链路追踪

平台集成了 Jaeger 分布式追踪系统，用于追踪微服务间的调用链路：

- **Jaeger 地址**：http://localhost:16686

#### 4. 健康检查

各服务提供健康检查接口，用于监控服务的运行状态：

```bash
# API 网关健康检查
curl http://localhost:8080/actuator/health

# 设备管理服务健康检查
curl http://localhost:8082/actuator/health
```

#### 5. 性能优化

1. **数据库优化**：
   - 为常用查询字段创建索引
   - 调整数据库连接池大小
   - 定期清理过期数据

2. **缓存优化**：
   - 合理设置缓存过期时间
   - 使用分布式缓存减少数据库压力

3. **服务优化**：
   - 调整服务线程池大小
   - 优化服务间通信
   - 使用异步处理减少响应时间

4. **网络优化**：
   - 使用 CDN 加速静态资源访问
   - 优化网络传输协议

#### 6. 安全加固

1. **网络安全**：
   - 使用防火墙限制访问
   - 配置 TLS/SSL 加密
   - 实现网络隔离

2. **数据安全**：
   - 数据加密存储
   - 定期数据备份
   - 实现数据脱敏

3. **访问控制**：
   - 实现最小权限原则
   - 定期审计访问日志
   - 实现多因素认证

4. **代码安全**：
   - 定期进行代码审计
   - 修复安全漏洞
   - 使用安全编码规范

### 升级与迁移

#### 1. 版本升级

平台支持平滑升级，升级步骤如下：

1. 备份数据库
2. 停止旧版本服务
3. 启动新版本服务
4. 执行数据库迁移脚本
5. 验证服务运行状态

#### 2. 数据迁移

平台提供数据迁移工具，支持不同版本间的数据迁移：

```bash
# 执行数据迁移
docker run --rm -v ./migration:/migration baccano-iot/migration-tool:latest
```

### 高可用部署

为了提高系统的可用性，建议采用以下高可用部署方案：

1. **服务集群化**：将核心服务部署为集群模式
2. **数据库主从复制**：PostgreSQL 和 Redis 采用主从复制架构
3. **消息总线集群**：NATS 采用集群模式
4. **负载均衡**：在 API 网关和设备网关前部署负载均衡器
5. **多可用区部署**：跨可用区部署服务，提高容灾能力

## 🧪 开发指南

### 后端开发

1. 服务结构

```
backend/{service}/
├── src/                     # 源代码目录
│   ├── main/                # 主程序目录
│   │   └── java/            # Java源代码
│   │       └── io/          # 包结构
│   │           └── baccano/ # 项目包
│   │               └── iot/  # 模块包
│   │                   ├── Application.java  # 主类
│   │                   ├── config/          # 配置类
│   │                   ├── controller/      # REST控制器
│   │                   ├── service/         # 业务逻辑
│   │                   ├── mapper/          # MyBatis映射器
│   │                   ├── entity/          # 实体类
│   │                   ├── dto/             # 数据传输对象
│   │                   ├── vo/              # 视图对象
│   │                   ├── exception/       # 异常处理
│   │                   └── utils/           # 工具类
│   └── test/                # 测试代码目录
│       └── java/            # Java测试代码
│           └── io/          # 测试包结构
│               └── baccano/ # 测试项目包
│                   └── iot/  # 测试模块包
├── resources/               # 资源目录
│   ├── application.yml      # 应用配置
│   ├── application-dev.yml  # 开发环境配置
│   ├── application-prod.yml # 生产环境配置
│   └── mapper/              # MyBatis映射文件
├── target/                  # 构建输出目录
├── pom.xml                  # Maven依赖配置
├── Dockerfile               # Docker构建文件
└── README.md                # 服务说明文档
```

2. 代码规范

- 遵循 Spring Boot 代码规范
- 使用 Alibaba Java Coding Guidelines 进行代码检查
- 使用 Javadoc 格式编写注释
- 类、方法、变量命名清晰，遵循驼峰命名法
- 单元测试覆盖率 > 80%
- 集成测试覆盖率 > 60%

3. 数据库操作

- 使用 MyBatis Plus 进行数据库操作
- 数据库变更使用 Flyway 或 Liquibase 管理
- 编写测试时使用 H2 内存数据库或 TestContainers 启动临时数据库
- 事务处理使用 Spring @Transactional 注解
- 复杂查询使用 MyBatis 动态 SQL

4. 微服务开发

- 使用 Dubbo 进行服务间通信
- 使用 Nacos 进行服务注册与配置管理
- 实现服务健康检查和优雅关闭
- 使用 Spring Cloud Circuit Breaker 实现服务容错
- 使用 Spring Cloud Gateway 实现 API 网关

5. 消息队列

- 使用 RocketMQ 进行消息传递
- 消息格式使用 JSON
- 实现消息重试和死信队列机制
- 消息处理采用 Spring Boot @EventListener 或 RocketMQ Listener

### 前端开发

1. 组件规范

```tsx
// 组件文件结构
ComponentName/
├── index.tsx               # 组件入口导出
├── ComponentName.tsx       # 组件实现
├── ComponentName.test.tsx  # 组件测试
├── types.ts                # 类型定义
└── hooks.ts                # 组件相关 hooks
```

2. 代码规范

- 遵循 React 18 + TypeScript 规范
- 使用 ESLint + Prettier 进行代码格式化
- 组件和函数使用 JSDoc 注释
- 函数组件优先使用 React Hooks
- 避免使用 Class 组件
- 单元测试覆盖率 > 80%

3. 状态管理

- **表单状态**：使用 React Hook Form 管理
- **组件内状态**：使用 useState/useReducer 管理
- **全局状态**：使用 React Context API 管理

4. API 调用

- 所有 API 调用封装在 `src/api` 目录下
- 使用原生 fetch API 或 Axios 作为 HTTP 客户端
- 实现请求拦截器和响应拦截器
- 统一处理错误和认证

5. 样式规范

- 使用 Tailwind CSS 编写样式
- 组件样式采用内联或单独的 CSS 文件
- 遵循 Tailwind CSS 最佳实践
- 支持响应式设计
- 使用 clsx 和 tailwind-merge 管理 CSS 类名

### 调试与测试

1. 本地调试

```bash
# 启动依赖服务
docker-compose -f docker-compose.dev.yml up -d

# 启动后端服务（以API网关为例）
cd backend/api-gateway
mvn spring-boot:run

# 启动前端服务
cd web-ui
npm run dev
```

2. 日志调试

- 后端服务使用 SLF4J + Logback 日志框架，支持不同日志级别
- 前端使用控制台日志，支持开发环境和生产环境不同配置
- 使用 ELK Stack 进行日志收集和分析

3. 单元测试

```bash
# 后端单元测试
cd backend
mvn test

# 运行特定模块的测试
cd api-gateway
mvn test

# 生成测试覆盖率报告
mvn test jacoco:report

# 查看测试覆盖率
open target/site/jacoco/index.html

# 前端单元测试
cd web-ui
npm test

# 生成前端测试覆盖率报告
npm test -- --coverage
```

4. 集成测试

```bash
# 启动集成测试环境
docker-compose -f docker-compose.test.yml up -d

# 运行集成测试
cd backend
mvn verify -DskipUnitTests

# 停止集成测试环境
docker-compose -f docker-compose.test.yml down
```

5. E2E 测试

```bash
# 启动 E2E 测试
cd web-ui
npm run e2e

# 使用 Cypress 进行可视化 E2E 测试
npm run e2e:open
```

### CI/CD 流程

1. GitHub Actions

平台使用 GitHub Actions 实现 CI/CD 流程：

- **代码检查**：自动进行代码格式检查和静态分析
- **单元测试**：自动运行单元测试
- **集成测试**：自动运行集成测试
- **镜像构建**：自动构建 Docker 镜像
- **镜像推送**：自动推送到镜像仓库
- **部署**：自动部署到测试环境

2. 构建脚本

```bash
# 构建所有后端服务
cd backend
mvn clean package -DskipTests

# 构建特定后端服务
cd api-gateway
mvn clean package -DskipTests

# 构建前端
cd web-ui
npm run build

# 运行所有测试
cd backend
mvn test
```

3. 版本管理

- 使用语义化版本控制
- 每次发布创建一个标签
- 自动生成 CHANGELOG

### 开发最佳实践

1. **代码复用**：提取公共代码到 common 模块
2. **依赖管理**：使用 Maven 管理依赖，避免版本冲突
3. **配置管理**：使用 Spring Boot 配置文件和 Nacos 配置中心
4. **错误处理**：统一异常处理机制，使用 @RestControllerAdvice
5. **日志记录**：使用 SLF4J + Logback，统一日志格式
6. **监控指标**：集成 Spring Boot Actuator 和 Prometheus
7. **链路追踪**：使用 SkyWalking 进行分布式链路追踪
8. **安全编码**：遵循 Spring Security 最佳实践
9. **文档更新**：使用 Swagger 自动生成 API 文档
10. **代码审查**：所有代码变更必须经过代码审查

### 开发工具推荐

1. **后端开发**
   - IntelliJ IDEA 或 Eclipse + Spring Boot 插件
   - Postman 或 Insomnia 用于 API 测试
   - DBeaver 用于数据库管理
   - MyBatis Plugin 用于 MyBatis 映射文件编辑

2. **前端开发**
   - VS Code + React 插件
   - Chrome DevTools 用于调试
   - Storybook 用于组件开发和测试
   - Cypress 用于 E2E 测试
   - Tailwind CSS IntelliSense 用于样式开发

3. **DevOps 工具**
   - Docker Desktop 用于本地容器管理
   - Kubernetes Lens 用于 Kubernetes 管理
   - Prometheus + Grafana 用于监控
   - SkyWalking 用于链路追踪
   - ELK Stack 用于日志管理
   - Nacos Console 用于服务管理和配置管理

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

- 环境信息 (OS、Java版本、浏览器版本等)
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
- [Spring Boot](https://spring.io/projects/spring-boot) - Java后端框架
- [Nacos](https://nacos.io/) - 服务注册与配置中心
- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI组件库

---

如有任何问题或建议，欢迎提交 Issue 或联系维护者。

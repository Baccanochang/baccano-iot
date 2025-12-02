# Baccano-IoT 物联网平台设计文档

## 1. 项目概述

**项目名称：** Baccano-IoT
**目标：** 构建一个高性能、高可扩展性、功能全面的企业级开源物联网平台。融合 ThingsBoard、JetLinks 等平台的优点，支持海量设备连接、设备与资产管理、规则引擎处理、实时与历史数据可视化。
**核心原则：** 微服务架构、松耦合、领域驱动设计、前后端分离。
**目标用户：** AI代码生成助手。文档旨在提供足够精确的结构、接口、数据模型和流程描述，以便生成可工作的、结构良好的Golang和React代码。

## 2. 系统架构

### 2.1. 总体架构图（逻辑描述）

采用 **微服务 + 消息总线** 的云原生架构。

```
[设备端] --(MQTT/CoAP/HTTP)--> [物联网网关集群] --(gRPC)--> [设备连接服务]
                                                                 |
                                                                 v
[设备连接服务] --(发布消息)--> [核心消息总线: NATS JetStream / Apache Pulsar]
                                                                 |
    +----------------+----------------+----------------+---------+----------------+
    |                |                |                |                        |
    v                v                v                v                        v
[规则引擎服务]  [数据存储服务]  [告警引擎服务]  [设备管理服务]           [其他微服务]
    |                |                |                |                        |
    v                v                v                v                        v
[规则链执行]    [写入TSDB/RDB]  [触发告警]      [更新状态/元数据]      [用户服务/资产服务...]
```

### 2.2. 核心组件与服务划分

1. **`device-gateway` (设备网关):**

   * **职责：** 专为处理海量设备**长连接**而设计。负责协议适配、基础解码、连接维护、并将消息转发给后端服务。
   * **协议：** MQTT (主要)、CoAP、HTTP。
   * **通信：** 通过 **gRPC** 与 `device-connect` 服务交互。
2. **`device-connect` (设备连接服务):**

   * **职责：** 设备连接与消息的**中心枢纽**。验证设备认证、管理设备在线状态、将设备消息发布到消息总线、并接收来自其他服务的下行指令。
3. **`core-message-bus` (核心消息总线):**

   * **技术选型：** NATS JetStream 或 Apache Pulsar。
   * **职责：** 作为系统背板，所有微服务间**异步通信**的通道。主题设计如：`device.telemetry.{deviceId}`, `device.event.{eventType}`, `device.rpc.request`, `device.rpc.response`。
4. **`rule-engine` (规则引擎服务):**

   * **职责：** 从消息总线订阅设备数据与事件，通过**规则链**进行可编排的数据处理、过滤、转发、聚合。
   * **核心概念：** `规则链` -> `规则节点`。节点类型包括：消息过滤器、数据转换(JavaScript)、属性设置、RPC调用、保存到数据库、发布到Kafka、HTTP推送等。
5. **`data-store` (数据存储服务):**

   * **职责：** 统一管理平台所有数据的存储与查询。对接不同的数据库。
   * **存储分层：**
     * **时序数据 (高并发写入，按时间查询):** **TDengine**。存储设备遥测数据。
     * **关系/元数据 (复杂查询，事务):** **PostgreSQL**。存储设备档案、产品模型、用户、资产结构、规则链配置、告警定义。
     * **缓存:** **Redis**。存储设备实时状态（在线/离线）、会话信息、高频访问的元数据。
6. **`device-manager` (设备管理服务):**

   * **职责：** 提供设备的生命周期管理（创、删、改、查）、物模型管理、设备影子、设备分组、固件升级管理。
7. **`asset-manager` (资产管理服务):**

   * **职责：** 管理客户、工厂、区域、设备组等逻辑资产结构。支持树形结构，设备可关联到资产。
8. **`alert-center` (告警中心服务):**

   * **职责：** 基于规则引擎触发的条件或自定义规则，产生、管理、通知告警。支持告警等级、去重、静默、通知模板（邮件、Webhook、短信）。
9. **`api-gateway` (API网关):**

   * **职责：** 所有前端和外部API请求的**统一入口**。基于 **Go + Gin**。负责路由、认证、限流、日志。
   * **认证：** JWT Token。
10. **`web-ui` (前端应用):**

    * **技术栈：** React 18 + TypeScript + Vite + Ant Design 5.x + Recoil/Zustand + React Query。
    * **架构：** 微前端就绪的SPA应用，通过API网关与后端通信。
    * **模块：** 仪表盘、设备管理、资产树、规则链设计器、数据可视化、告警中心、系统管理。

## 3. 数据模型设计 (核心实体)

### 3.1. PostgreSQL 主要表结构

#### 3.1.1. 产品模型（物模型核心）

```sql
-- 产品表（设备型号）
CREATE TABLE product (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36),
  name VARCHAR(255),
  description TEXT,
  model_type VARCHAR(50), -- 直连设备、网关子设备
  protocol VARCHAR(50),   -- MQTT, CoAP, ...
  created_time TIMESTAMPTZ DEFAULT NOW(),
  updated_time TIMESTAMPTZ DEFAULT NOW()
);

-- 物模型定义表（与产品一对一或一对多，支持版本）
CREATE TABLE thing_model (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) REFERENCES product(id),
  version VARCHAR(50) DEFAULT '1.0',
  is_default BOOLEAN DEFAULT TRUE,
  metadata JSONB, -- 物模型完整定义，遵循物模型规范
  created_time TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, version)
);

-- 物模型属性定义（从metadata中解析出来，便于查询）
CREATE TABLE thing_model_property (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36) REFERENCES thing_model(id),
  identifier VARCHAR(100), -- 属性标识符，如 temperature
  name VARCHAR(255),
  data_type VARCHAR(50), -- int, float, double, string, bool, enum, struct
  access_mode VARCHAR(20), -- r(只读), w(只写), rw(读写)
  unit VARCHAR(50),
  description TEXT,
  specifications JSONB, -- 详细规格：最小值、最大值、步长、枚举值等
  is_telemetry BOOLEAN DEFAULT TRUE, -- 是否为遥测数据
  is_attribute BOOLEAN DEFAULT FALSE, -- 是否为设备属性
  created_time TIMESTAMPTZ DEFAULT NOW()
);

-- 物模型服务定义（设备可调用的方法）
CREATE TABLE thing_model_service (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36) REFERENCES thing_model(id),
  identifier VARCHAR(100), -- 服务标识符
  name VARCHAR(255),
  call_type VARCHAR(20), -- sync(同步), async(异步)
  description TEXT,
  input_params JSONB, -- 输入参数定义
  output_params JSONB, -- 输出参数定义
  created_time TIMESTAMPTZ DEFAULT NOW()
);

-- 物模型事件定义
CREATE TABLE thing_model_event (
  id VARCHAR(36) PRIMARY KEY,
  model_id VARCHAR(36) REFERENCES thing_model(id),
  identifier VARCHAR(100), -- 事件标识符
  name VARCHAR(255),
  event_type VARCHAR(20), -- info, warn, error
  description TEXT,
  output_data JSONB, -- 事件输出数据定义
  created_time TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.1.2. 设备与数据表

```sql
-- 设备档案
CREATE TABLE device (
  id VARCHAR(36) PRIMARY KEY,
  product_id VARCHAR(36) REFERENCES product(id),
  model_id VARCHAR(36) REFERENCES thing_model(id), -- 当前使用的物模型版本
  asset_id VARCHAR(36), -- 关联的资产ID
  tenant_id VARCHAR(36),
  name VARCHAR(255),
  credential VARCHAR(255), -- 认证密钥 (token, username等)
  last_online_time TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE,
  meta_data JSONB, -- 扩展元数据
  created_time TIMESTAMPTZ DEFAULT NOW(),
  updated_time TIMESTAMPTZ DEFAULT NOW()
);

-- 设备影子（期望属性/报告属性）
CREATE TABLE device_shadow (
  device_id VARCHAR(36) PRIMARY KEY REFERENCES device(id),
  desired JSONB, -- 期望属性（云端下发的配置）
  reported JSONB, -- 报告属性（设备上报的状态）
  metadata JSONB, -- 元数据：版本、时间戳等
  version BIGINT DEFAULT 0,
  created_time TIMESTAMPTZ DEFAULT NOW(),
  updated_time TIMESTAMPTZ DEFAULT NOW()
);

-- 设备属性快照（物模型中定义的属性）
CREATE TABLE device_attribute (
  id VARCHAR(36) PRIMARY KEY,
  device_id VARCHAR(36) REFERENCES device(id),
  identifier VARCHAR(100), -- 属性标识符
  key VARCHAR(255), -- 属性键
  value JSONB, -- 属性值
  data_type VARCHAR(50),
  update_time TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, identifier)
);

-- 资产（组织、客户、地点等树形结构）
CREATE TABLE asset (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36),
  parent_id VARCHAR(36) REFERENCES asset(id),
  name VARCHAR(255),
  type VARCHAR(50), -- customer, site, building, room
  path VARCHAR(1024), -- 树路径，用于快速查询子孙
  additional_info JSONB,
  created_time TIMESTAMPTZ DEFAULT NOW()
);

-- 规则链
CREATE TABLE rule_chain (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36),
  name VARCHAR(255),
  root_rule_node_id VARCHAR(36), -- 指向第一个规则节点
  configuration JSONB, -- 整个规则链的JSON定义
  created_time TIMESTAMPTZ DEFAULT NOW()
);

-- 告警记录
CREATE TABLE alert (
  id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36),
  device_id VARCHAR(36),
  rule_id VARCHAR(255), -- 触发告警的规则标识
  type VARCHAR(100),
  severity VARCHAR(20), -- CRITICAL, MAJOR, WARNING, INFO
  status VARCHAR(20), -- ACTIVE, ACKNOWLEDGED, CLEARED
  details JSONB,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_time TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2. TDengine 超级表设计 (时序数据)

```sql
-- 设备遥测数据超级表（基于物模型动态创建子表）
CREATE STABLE IF NOT EXISTS device_telemetry (
  ts TIMESTAMP,
  device_id NCHAR(36),
  -- 以下为采集的物理量，根据物模型动态调整，这里为示例
  temperature DOUBLE,
  humidity DOUBLE,
  pressure DOUBLE,
  -- 通用字段，存储未定义的标签或值
  tags JSON,
  fields JSON
) TAGS (tenant_id NCHAR(36), product_id NCHAR(36), model_id NCHAR(36));

-- 设备事件超级表
CREATE STABLE IF NOT EXISTS device_event (
  ts TIMESTAMP,
  device_id NCHAR(36),
  event_type NCHAR(50), -- online, offline, alarm_triggered, etc.
  event_data JSON
) TAGS (tenant_id NCHAR(36), product_id NCHAR(36), model_id NCHAR(36));
```

## 4. 物模型设计规范

### 4.1. 物模型JSON Schema

物模型采用标准的JSON格式定义，参考阿里云物模型规范，包含以下核心部分：

```json
{
  "schemaVersion": "1.0",
  "properties": [
    {
      "identifier": "temperature",
      "name": "温度",
      "accessMode": "rw",
      "dataType": {
        "type": "float",
        "specs": {
          "min": -100,
          "max": 300,
          "step": 0.1,
          "unit": "℃"
        }
      },
      "category": "telemetry", // telemetry, attribute, event
      "description": "环境温度传感器"
    }
  ],
  "services": [
    {
      "identifier": "reboot",
      "name": "重启设备",
      "callType": "async",
      "inputData": [
        {
          "identifier": "delay",
          "name": "延迟时间",
          "dataType": {
            "type": "int",
            "specs": {
              "min": 0,
              "max": 60,
              "unit": "秒"
            }
          }
        }
      ],
      "outputData": [
        {
          "identifier": "result",
          "name": "执行结果",
          "dataType": {
            "type": "bool"
          }
        }
      ]
    }
  ],
  "events": [
    {
      "identifier": "error",
      "name": "错误事件",
      "type": "error",
      "outputData": [
        {
          "identifier": "errorCode",
          "name": "错误码",
          "dataType": {
            "type": "int"
          }
        },
        {
          "identifier": "errorMessage",
          "name": "错误信息",
          "dataType": {
            "type": "string"
          }
        }
      ]
    }
  ]
}
```

### 4.2. 数据类型支持

1. **基础类型:** int32, int64, float, double, string, bool
2. **特殊类型:** enum (枚举), array (数组), struct (结构体), date, time
3. **扩展类型:** file (文件), password (密码), location (地理位置)

### 4.3. 物模型版本管理

1. 每个产品可以关联多个物模型版本
2. 设备绑定特定的物模型版本
3. 物模型变更时，支持向后兼容性检查
4. 提供物模型版本对比和迁移工具

## 5. 核心接口设计 (API Gateway)

### 5.1. 认证与租户

- `POST /api/v1/auth/login` - 用户登录，返回JWT。
- 所有请求头需包含：`Authorization: Bearer {jwt}`。JWT Claims 中包含 `tenant_id`, `user_id`, `roles`。

### 5.2. 产品与物模型管理

- `POST /api/v1/products` - 创建产品
- `PUT /api/v1/products/{productId}/thing-model` - 更新/创建物模型
- `GET /api/v1/products/{productId}/thing-models` - 获取物模型列表（支持版本）
- `GET /api/v1/products/{productId}/thing-models/{version}` - 获取指定版本物模型
- `POST /api/v1/products/{productId}/thing-models/validate` - 验证物模型定义
- `POST /api/v1/products/{productId}/thing-models/diff` - 对比物模型版本差异

### 5.3. 设备管理

- `POST /api/v1/devices` - 创建设备
- `GET /api/v1/devices/{deviceId}` - 获取设备详情
- `GET /api/v1/devices/{deviceId}/thing-model` - 获取设备物模型
- `POST /api/v1/devices/{deviceId}/rpc` - 向设备发送RPC请求（调用服务）
- `GET /api/v1/devices/{deviceId}/shadow` - 获取设备影子
- `PUT /api/v1/devices/{deviceId}/shadow/desired` - 更新设备影子期望属性
- `GET /api/v1/devices/{deviceId}/attributes` - 获取设备属性
- `POST /api/v1/devices/{deviceId}/attributes` - 批量更新设备属性

### 5.4. 数据查询

- `GET /api/v1/telemetry/{deviceId}/latest` - 获取设备最新遥测值
- `GET /api/v1/telemetry/{deviceId}/history` - 查询历史遥测数据 (参数：`startTs`, `endTs`, `interval`聚合)
- `GET /api/v1/events/{deviceId}` - 查询设备事件

### 5.5. 规则引擎

- `POST /api/v1/rule-chains` - 创建/更新规则链 (接收完整的规则链JSON配置)
- `POST /api/v1/rule-chains/{chainId}/root` - 设置规则链根节点

## 6. 关键流程与交互

### 6.1. 设备上线与数据上报流程

1. **设备连接:** 设备通过MQTT连接至 `device-gateway`，携带 `productId` 和 `credential`。
2. **连接认证:** `device-gateway` 通过gRPC调用 `device-connect` 进行认证。
3. **状态更新:** `device-connect` 验证成功后，在 **Redis** 中标记设备在线，更新 `device.last_online_time`。
4. **发布上线事件:** `device-connect` 向消息总线主题 `device.event.connect` 发布事件。
5. **数据上报:** 设备向主题 `v1/{productId}/{deviceId}/telemetry` 发布数据。
6. **网关转发:** `device-gateway` 接收后，封装为内部消息，通过gRPC发送给 `device-connect`。
7. **消息分发:** `device-connect` 将遥测数据发布到消息总线主题 `device.telemetry.{deviceId}`。
8. **规则处理:** `rule-engine` 订阅了相关主题，收到消息后执行匹配的规则链。
9. **数据存储:** 规则链中的 `Save Telemetry` 节点调用 `data-store` 服务，将数据写入 **TDengine**。

### 6.2. 物模型驱动数据处理流程

1. **设备注册:** 创建设备时，必须指定产品型号和物模型版本。
2. **数据校验:** 设备上报数据时，`device-connect` 根据物模型定义验证数据格式和范围。
3. **数据规范化:** 根据物模型定义，将原始数据转换为标准格式。
4. **影子同步:** 设备上报的属性更新设备影子中的 `reported` 部分。
5. **期望属性下发:** 当用户修改设备影子中的 `desired` 属性时，系统通过下行通道下发到设备。
6. **服务调用:** 用户通过API调用设备服务，系统转换为设备理解的RPC指令。

## 7. 前端架构设计

### 7.1. 技术栈

- **框架:** React 18 (函数组件 + Hooks)
- **语言:** TypeScript 5.x
- **构建工具:** Vite 5.x
- **UI组件库:** Ant Design 5.x + @ant-design/charts
- **状态管理:**
  - 全局状态: Recoil 或 Zustand
  - 服务端状态: React Query (TanStack Query)
- **路由:** React Router DOM 6.x
- **可视化:** ECharts for React, D3.js (复杂定制)
- **微前端准备:** 模块联邦 (Webpack 5 Module Federation)
- **实时通信:** Socket.IO Client
- **工具库:** axios, dayjs, lodash-es
- **JSON Schema处理:** react-jsonschema-form 或 @rjsf/core

### 7.2. 项目结构

```
src/
├── @types/                  # TypeScript 类型定义
├── api/                     # API 接口封装
│   ├── client.ts           # axios 实例配置
│   ├── devices/            # 设备相关API
│   ├── products/           # 产品与物模型相关API
│   ├── assets/             # 资产相关API
│   └── ...
├── components/             # 公共组件库
│   ├── common/            # 通用组件 (Button, Modal, Table等封装)
│   ├── charts/            # 图表组件封装
│   ├── data-display/      # 数据展示组件
│   └── layout/            # 布局组件
├── features/               # 功能模块 (按业务领域划分)
│   ├── dashboard/         # 仪表盘模块
│   ├── device-management/ # 设备管理模块
│   ├── product-mgmt/      # 产品与物模型管理模块
│   ├── rule-engine/       # 规则引擎模块
│   ├── asset-tree/        # 资产管理模块
│   └── ...
├── hooks/                  # 全局自定义hooks
├── layouts/                # 页面布局组件
├── pages/                  # 页面组件 (路由页面)
├── routes/                 # 路由配置
├── stores/                 # 全局状态管理
│   ├── auth.store.ts      # 认证状态
│   ├── ui.store.ts        # UI状态
│   └── ...
├── styles/                 # 全局样式
├── utils/                  # 工具函数
├── App.tsx                 # 根组件
└── main.tsx                # 应用入口
```

### 7.3. 物模型相关前端设计

#### 7.3.1. 物模型编辑器组件

- **可视化编辑器:** 基于JSON Schema的表单生成器
- **组件库:**
  - 属性定义表单（数据类型、访问模式、单位等）
  - 服务定义表单（输入输出参数、调用类型）
  - 事件定义表单（事件类型、输出数据）
- **实时预览:** 编辑时实时预览物模型JSON结构
- **验证功能:** 前端验证物模型格式正确性

#### 7.3.2. 产品管理模块

- **产品列表:** 展示所有产品，支持按协议、类型过滤
- **产品详情页:**
  - 基本信息管理
  - 物模型版本管理（列表、对比、切换默认版本）
  - 设备统计（基于该产品的设备数量、在线率等）

#### 7.3.3. 设备详情页增强（基于物模型）

- **动态表单生成:** 根据物模型定义自动生成设备控制表单
- **数据可视化:** 根据物模型中定义的属性类型选择合适的图表展示
- **服务调用面板:** 根据物模型中定义的服务生成调用界面
- **属性管理:** 设备属性值的查看和编辑（基于物模型验证）

#### 7.3.4. 规则引擎集成物模型

- **节点增强:** 规则节点可以引用物模型定义，进行类型安全的操作
- **智能提示:** 编辑规则时，根据物模型提供属性、服务、事件的智能提示
- **数据转换:** 基于物模型定义的数据类型进行自动转换和验证

### 7.4. 状态管理策略

- **React Query:** 管理所有服务端状态（设备数据、资产列表、告警记录等）
  - 自动缓存、去重、轮询、错误重试
  - 乐观更新（用于设备控制等场景）
- **Recoil/Zustand:** 管理客户端全局状态
  - 用户偏好设置
  - 主题切换
  - 侧边栏折叠状态
  - 全局加载状态
- **组件本地状态:** 使用 `useState`、`useReducer` 管理纯UI状态

### 7.5. 实时数据架构

- **WebSocket连接:** 通过 Socket.IO 连接 API Gateway
- **订阅机制:** 基于主题的订阅/发布
  - 用户订阅感兴趣的设备或资产
  - 后端推送对应主题的更新
- **数据聚合:** 前端对高频数据进行节流和聚合显示
- **离线处理:** 网络断开时缓存数据，重连后同步

## 8. 部署与配置

### 8.1. 技术栈汇总

- **后端:** Golang, gRPC, NATS/Pulsar, PostgreSQL, TDengine, Redis.
- **前端:** React 18, TypeScript, Vite, Ant Design, Recoil/Zustand, React Query.
- **部署:** Docker, Docker Compose (开发)，Kubernetes (生产)。

### 8.2. 配置中心

- 使用 **Consul** 或 **etcd** 作为微服务的配置中心与服务发现。
- 每个服务启动时从配置中心拉取数据库、消息总线等连接信息。

### 8.3. 前端部署

- **静态资源:** 通过 CDN 分发
- **环境配置:** 运行时环境变量注入
- **CI/CD:** 自动化构建、测试、部署流水线
- **健康检查:** 容器健康检查端点

---

**文档结束。**

**给AI的提示：** 此文档已详细描述了Baccano-IoT平台的技术架构，特别是新增的物模型设计、数据模型、API接口、核心流程及前端React架构。你可以根据此文档，分模块生成对应的Golang微服务代码（包括main.go, 内部结构体定义、gRPC服务、数据库操作、消息处理等）、React前端组件（包括TypeScript类型定义、组件结构、状态管理、API集成等）、以及Dockerfile和docker-compose.yml配置文件。请确保生成的代码遵循清晰的包结构、错误处理和日志记录。

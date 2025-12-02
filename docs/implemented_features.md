# Baccano-IoT 已完成功能与现状

本文件汇总当前代码库已实现的功能、关键接口与运行方式，供后续生成代码时作为知识库参考。

## 架构概览
- 微服务架构，服务包括：`api-gateway`、`device-gateway`、`device-connect`、`core-message-bus`、`data-store`、`device-manager`、`asset-manager`、`alert-center`、`rule-engine`、`web-ui`。
- 异步通信采用 NATS JetStream，主题示例：`device.telemetry.{deviceId}`、`device.event.connect`。

## 设备网关（device-gateway）
- 协议接入：
  - MQTT 服务器内嵌，监听 `:1883`，认证与转发通过 Hook：
    - 认证：`OnConnectAuthenticate` 验证（使用 `ClientID=deviceId`、`Username=productId`、`Password=credential`）→ gRPC `Authenticate`
    - 遥测：`OnPublish` 解析 `v1/{productId}/{deviceId}/telemetry` → gRPC `PublishTelemetry`
    - 代码：`backend/device-gateway/main.go:24-43`（认证与转发）
  - CoAP UDP 服务器，监听 `:5683`，路由 `/v1/{productId}/{deviceId}/telemetry`，Body 作为 JSON 遥测 → gRPC `PublishTelemetry`
    - 代码：`backend/device-gateway/main.go:58-70`
- 端口：`1883/TCP`、`5683/UDP`、`8070/TCP`（预留）。

## 设备连接服务（device-connect）
- gRPC 接口：`Authenticate`、`PublishTelemetry`
- 物模型驱动校验与标准化：
  - 从 API 网关拉取设备物模型：`GET /api/v1/devices/{deviceId}/thing-model`
  - 根据属性的数据类型执行规范化（`int`、`float`、`string`、`bool`）
  - 标准化后发布到消息总线 `device.telemetry.{deviceId}`
  - 代码：`backend/device-connect/internal/grpc/server.go:24-47`
- 在线状态与事件：
  - 认证成功后更新在线状态（Cache/RDB），发布 `device.event.connect`
  - 代码：`backend/device-connect/internal/grpc/server.go:17-22`

## 核心消息总线（core-message-bus）
- NATS JetStream 适配器：
  - 连接、JetStream 上下文、发布/订阅封装
  - 代码：`backend/core-message-bus/pkg/bus/nats.go:9-24`

## API 网关（api-gateway）
- 框架与中间件：Gin、JWT 鉴权、IP 令牌桶限流。
  - 代码：`backend/api-gateway/internal/http/middleware.go:17-46`
- 设备与产品接口：
  - 设备：创建、详情、影子、属性、RPC、设备物模型
    - 代码：`backend/api-gateway/main.go:88-100`、`backend/api-gateway/internal/http/devices.go:11-66`
  - 产品与物模型：创建、获取、列表、验证、差异对比
    - 代码：`backend/api-gateway/main.go:104-110`
- 数据查询代理：
  - 最新与历史遥测代理到 `data-store`
  - 代码：`backend/api-gateway/main.go:101-102`、`backend/api-gateway/internal/http/telemetry.go:6-22`
- 调试端点：健康与配置：`/debug/health`、`/debug/config`
  - 代码：`backend/api-gateway/internal/http/debug.go:8-16`

## 数据存储服务（data-store）
- 示例查询端点：
  - `GET /api/v1/telemetry/{deviceId}/latest`、`/history`
  - `GET /api/v1/events/{deviceId}`（示例返回）
  - 代码：`backend/data-store/main.go:7-28`
- 适配器接口（TSDB/RDB/Cache）定义：
  - 代码：`backend/data-store/internal/store/interface.go:3-8`
- 说明：目前为示例数据，尚未接入 TDengine 历史聚合与 PostgreSQL 事件分页。

## 规则引擎（rule-engine）
- 订阅遥测并触发示例告警：温度阈值（>80）→ 存储事件（PG）→ 调用告警中心创建告警。
  - 代码：`backend/rule-engine/main.go:16-29`
- 环境变量配置：`NATS_URL`、`PG_URL`，默认本地值。
  - 代码：`backend/rule-engine/main.go:18-23`

## 告警中心与资产管理
- 告警中心：创建、列表、详情、状态更新路由。
  - 代码：`backend/alert-center/main.go:8-23`
- 资产管理：资产列表、创建、详情路由。
  - 代码：`backend/asset-manager/main.go:8-22`

## 前端（web-ui）
- 技术栈：React 18 + TypeScript + Vite + Ant Design + React Query。
- 主要功能：
  - 设备详情页（影子、属性、服务调用占位，支持乐观更新计划）
    - 代码：`web-ui/src/pages/DeviceDetails.tsx:1-34`
  - 物模型编辑器：基于 `@rjsf/antd` 的 Schema 表单渲染
    - 代码：`web-ui/src/features/product-mgmt/ThingModelEditor.tsx:1`
  - 遥测趋势图：折线图展示历史数据
    - 代码：`web-ui/src/features/dashboard/TelemetryTrend.tsx`
  - 全局状态：React Query 客户端初始化
    - 代码：`web-ui/src/main.tsx:6-16`

## 部署与运行
- docker-compose：定义所有服务与端口映射（包括 `device-gateway` 的 `1883/TCP`、`5683/UDP`）。
  - 文件：`docker-compose.yml:1-94`
- 运行脚本：
  - 非 Docker 构建：`scripts/build.ps1`
    - 功能：逐模块 `go build ./...`，前端 `npm install && npm run build`
  - Docker 构建与启动：`scripts/docker-up.ps1`
    - 功能：`docker compose up --build -d` 启动全部服务
- 说明：当前本地环境如缺少外网访问或 Docker，将影响外部模块的拉取与容器运行。

## 协议接入与示例
- MQTT：
  - 连接：`tcp://<host>:1883`，`ClientID={deviceId}`，`Username={productId}`，`Password={credential}`
  - 发布：`v1/{productId}/{deviceId}/telemetry`，负载为 JSON 文本
- CoAP：
  - UDP `:5683`，路径：`/v1/{productId}/{deviceId}/telemetry`，Body 为 JSON 文本

## 待完善项（下一步）
- `data-store`：实现 TDengine 历史聚合与 PostgreSQL 事件分页，`api-gateway` 透传 `startTs`、`endTs`、`interval`。
- 规则引擎：提供规则链 JSON 配置与规则管理 API（创建、更新、设置根节点）。
- 前端：设备影子实时视图、属性变更的物模型校验与乐观更新；趋势图区间筛选与聚合。
- API 网关：提供 WebSocket/Socket.IO 实时订阅推送。
- 配置中心：接入 Consul/etcd 作为配置中心与服务发现。


# Baccano-IoT 后端开发计划

## 1. 项目基础架构搭建
已完成：
- 创建了父POM文件，定义了项目的基本信息和依赖管理
- 创建了common模块，包含：
  - common-core：核心公共组件（基础实体类、统一响应格式、全局异常处理、自定义业务异常）
  - common-utils：工具类（日期工具、字符串工具）
  - common-mybatis：MyBatis扩展模块（MyBatis Plus配置）
- 创建了api-gateway模块的POM文件
- 创建了auth-service模块的POM文件

## 2. 后续开发计划

### 2.1 认证授权服务（auth-service）
- 实现用户认证与授权功能
- 实现JWT生成与验证
- 实现设备认证功能
- 实现RBAC权限管理

### 2.2 API网关服务（api-gateway）
- 实现请求路由与负载均衡
- 实现认证授权拦截
- 实现限流熔断功能
- 实现日志记录

### 2.3 设备管理服务（device-manager）
- 实现设备注册与管理
- 实现物模型管理
- 实现设备配置管理
- 实现设备状态管理

### 2.4 设备连接服务（device-connect）
- 实现MQTT协议支持
- 实现CoAP协议支持
- 实现HTTP协议支持
- 实现设备会话管理
- 实现心跳检测机制

### 2.5 规则引擎服务（rule-engine）
- 实现规则定义与管理
- 实现规则执行引擎
- 实现规则节点库
- 实现可视化规则链设计

### 2.6 告警中心服务（alert-center）
- 实现告警生成与管理
- 实现告警通知机制
- 实现告警历史记录
- 实现告警统计分析

### 2.7 资产管理服务（asset-manager）
- 实现资产树管理
- 实现设备与资产关联
- 实现资产属性管理
- 实现资产地理位置管理

### 2.8 协议适配服务（protocol-adapter）
- 实现Modbus协议支持
- 实现OPC UA协议支持

## 3. 开发顺序
1. 优先完成auth-service和api-gateway，确保系统的认证授权机制可用
2. 然后开发device-manager和device-connect，实现设备的基本管理和连接功能
3. 接着开发rule-engine和alert-center，实现规则处理和告警功能
4. 最后开发asset-manager和protocol-adapter，实现资产管理和工业协议支持

## 4. 技术栈
- 开发语言：Java 17+
- 核心框架：SpringBoot 4.0
- 微服务框架：SpringCloud Alibaba 2023.x
- 服务注册与配置：Nacos 2.3+
- RPC框架：Dubbo 3.3+
- ORM框架：MyBatis Plus 3.5.x
- 消息队列：RocketMQ 5.2+
- 时序数据库：TDengine 3.2+
- 关系型数据库：PostgreSQL 16+
- 缓存数据库：Redis 7.2+
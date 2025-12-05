package com.baccano.iot.connect.entity;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 设备会话实体类
 *
 * @author baccano-iot
 */
@Data
public class DeviceSession {
    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 设备Key
     */
    private String deviceKey;

    /**
     * 产品ID
     */
    private String productId;

    /**
     * 设备状态 0:未连接 1:在线 2:离线 3:禁用
     */
    private Integer status;

    /**
     * 协议类型 mqtt/coap/http
     */
    private String protocol;

    /**
     * 客户端ID
     */
    private String clientId;

    /**
     * 设备IP
     */
    private String ip;

    /**
     * 设备端口
     */
    private Integer port;

    /**
     * 连接时间
     */
    private LocalDateTime connectTime;

    /**
     * 最后在线时间
     */
    private LocalDateTime lastOnlineTime;

    /**
     * 断开连接时间
     */
    private LocalDateTime disconnectTime;

    /**
     * 心跳时间
     */
    private LocalDateTime heartbeatTime;

    /**
     * 会话超时时间
     */
    private Integer timeout;

    /**
     * 会话属性，JSON格式
     */
    private String attributes;
}
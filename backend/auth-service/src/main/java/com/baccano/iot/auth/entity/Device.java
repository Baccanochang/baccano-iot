package com.baccano.iot.auth.entity;

import com.baccano.iot.auth.entity.JpaBaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;

/**
 * 设备实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "iot_device")
public class Device extends JpaBaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 设备名称
     */
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    /**
     * 设备唯一标识符
     */
    @Column(name = "device_key", unique = true, nullable = false, length = 100)
    private String deviceKey;

    /**
     * 产品ID
     */
    @Column(name = "product_id", nullable = false)
    private String productId;

    /**
     * 设备类型
     */
    @Column(name = "device_type", length = 50)
    private String deviceType;

    /**
     * 设备状态 0:未激活 1:在线 2:离线 3:禁用
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 设备版本
     */
    @Column(name = "version", length = 50)
    private String deviceVersion;

    /**
     * 设备描述
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * 设备标签，JSON格式
     */
    @Column(name = "tags", columnDefinition = "jsonb")
    private String tags;

    /**
     * 设备地理位置，JSON格式
     */
    @Column(name = "location", columnDefinition = "jsonb")
    private String location;

    /**
     * 最后在线时间
     */
    @Column(name = "last_online_time")
    private java.time.LocalDateTime lastOnlineTime;

    /**
     * 激活时间
     */
    @Column(name = "activate_time")
    private java.time.LocalDateTime activateTime;

    /**
     * 设备证书ID
     */
    @Column(name = "certificate_id")
    private String certificateId;
}
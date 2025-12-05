package com.baccano.iot.auth.entity;

import com.baccano.iot.auth.entity.JpaBaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;

/**
 * 设备凭证实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "iot_device_credential")
public class DeviceCredential extends JpaBaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 设备ID
     */
    @Column(name = "device_id", unique = true, nullable = false)
    private String deviceId;

    /**
     * 凭证类型 0:密钥认证 1:证书认证 2:Token认证
     */
    @Column(name = "type", nullable = false)
    private Integer type;

    /**
     * 凭证内容，根据凭证类型不同存储不同内容
     * 密钥认证: 存储密钥
     * 证书认证: 存储证书ID
     * Token认证: 存储Token
     */
    @Column(name = "content", nullable = false, length = 255)
    private String content;

    /**
     * 凭证状态 0:禁用 1:启用
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 凭证过期时间
     */
    @Column(name = "expire_time")
    private java.time.LocalDateTime expireTime;

    /**
     * 关联设备
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Device device;
}
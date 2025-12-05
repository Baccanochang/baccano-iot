package com.baccano.iot.device.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 设备实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("iot_device")
public class Device extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 设备名称
     */
    private String name;

    /**
     * 设备唯一标识符
     */
    private String deviceKey;

    /**
     * 产品ID
     */
    private String productId;

    /**
     * 设备类型
     */
    private String deviceType;

    /**
     * 设备状态 0:未激活 1:在线 2:离线 3:禁用
     */
    private Integer status;

    /**
     * 设备版本
     */
    private String deviceVersion;

    /**
     * 设备描述
     */
    private String description;

    /**
     * 设备标签，JSON格式
     */
    private String tags;

    /**
     * 设备地理位置，JSON格式
     */
    private String location;

    /**
     * 最后在线时间
     */
    private LocalDateTime lastOnlineTime;

    /**
     * 激活时间
     */
    private LocalDateTime activateTime;

    /**
     * 设备证书ID
     */
    private String certificateId;

    /**
     * 产品信息
     */
    // @TableField(exist = false)
    // private Product product;
}
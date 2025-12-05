package com.baccano.iot.device.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 设备配置实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("iot_device_config")
public class DeviceConfig extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 配置名称
     */
    private String name;

    /**
     * 配置键
     */
    private String configKey;

    /**
     * 配置值，JSON格式
     */
    private String configValue;

    /**
     * 配置类型
     */
    private String type;

    /**
     * 描述
     */
    private String description;

    /**
     * 状态 0:禁用 1:启用
     */
    private Integer status;

    /**
     * 生效时间
     */
    private String effectiveTime;

    /**
     * 失效时间
     */
    private String expireTime;
}
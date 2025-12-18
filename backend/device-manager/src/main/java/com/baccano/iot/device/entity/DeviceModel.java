package com.baccano.iot.device.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 物模型实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("iot_device_model")
public class DeviceModel extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 物模型名称
     */
    private String name;

    /**
     * 物模型编码
     */
    private String code;

    /**
     * 物模型描述
     */
    private String description;

    /**
     * 模型版本
     */
    private String modelVersion;

    /**
     * 模型内容，JSON格式
     */
    private String modelContent;

    /**
     * 状态 0:禁用 1:启用
     */
    private Integer status;

    /**
     * 产品ID
     */
    private String productId;

    /**
     * 模型类型 0:产品模型 1:设备模型
     */
    private Integer type;
}
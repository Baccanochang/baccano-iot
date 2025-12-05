package com.baccano.iot.alert.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 告警实体
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("alert")
public class Alert extends BaseEntity {
    /**
     * 告警类型
     */
    private String alertType;

    /**
     * 告警级别：1-紧急，2-重要，3-警告，4-信息
     */
    private Integer severity;

    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 告警内容
     */
    private String content;

    /**
     * 告警状态：0-未处理，1-已处理，2-已忽略
     */
    private Integer status;

    /**
     * 告警来源
     */
    private String source;

    /**
     * 规则ID
     */
    private Long ruleId;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 告警时间
     */
    private LocalDateTime alertTime;

    /**
     * 处理人
     */
    private String handler;

    /**
     * 处理时间
     */
    private LocalDateTime handleTime;

    /**
     * 处理备注
     */
    private String handleRemark;
}
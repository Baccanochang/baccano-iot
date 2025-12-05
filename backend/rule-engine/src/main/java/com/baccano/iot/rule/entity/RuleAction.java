package com.baccano.iot.rule.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 规则动作实体
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rule_action")
public class RuleAction extends BaseEntity {
    /**
     * 规则ID
     */
    private Long ruleId;

    /**
     * 动作类型
     */
    private String type;

    /**
     * 动作配置
     */
    private String config;

    /**
     * 排序
     */
    private Integer sort;
}
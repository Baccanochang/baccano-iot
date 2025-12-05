package com.baccano.iot.rule.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 规则条件实体
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rule_condition")
public class RuleCondition extends BaseEntity {
    /**
     * 规则ID
     */
    private Long ruleId;

    /**
     * 条件字段
     */
    private String field;

    /**
     * 操作符
     */
    private String operator;

    /**
     * 条件值
     */
    private String value;

    /**
     * 条件类型
     */
    private String type;

    /**
     * 排序
     */
    private Integer sort;
}
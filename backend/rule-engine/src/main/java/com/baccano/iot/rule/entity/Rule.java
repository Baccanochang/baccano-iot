package com.baccano.iot.rule.entity;

import com.baccano.iot.common.core.entity.BaseEntity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 规则实体
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rule")
public class Rule extends BaseEntity {
    /**
     * 规则名称
     */
    private String name;

    /**
     * 规则描述
     */
    private String description;

    /**
     * 规则类型
     */
    private String type;

    /**
     * 规则状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 触发条件
     */
    private String triggerCondition;

    /**
     * 规则优先级
     */
    private Integer priority;

    /**
     * 规则表达式
     */
    private String expression;

    /**
     * 规则动作列表
     */
    @TableField(exist = false)
    private List<RuleAction> actions;

    /**
     * 规则条件列表
     */
    @TableField(exist = false)
    private List<RuleCondition> conditions;
}
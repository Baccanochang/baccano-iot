package com.baccano.iot.rule.service;

import com.baccano.iot.rule.entity.Rule;

import java.util.Map;

/**
 * 规则引擎服务
 *
 * @author baccano-iot
 */
public interface RuleEngineService {
    /**
     * 初始化规则引擎
     */
    void init();

    /**
     * 加载规则
     *
     * @param rule 规则对象
     */
    void loadRule(Rule rule);

    /**
     * 卸载规则
     *
     * @param ruleId 规则ID
     */
    void unloadRule(Long ruleId);

    /**
     * 执行规则
     *
     * @param data 规则执行数据
     * @return 规则执行结果
     */
    Map<String, Object> executeRules(Map<String, Object> data);

    /**
     * 刷新规则
     */
    void refreshRules();

    /**
     * 检查规则引擎状态
     *
     * @return 规则引擎状态
     */
    boolean isRunning();
}
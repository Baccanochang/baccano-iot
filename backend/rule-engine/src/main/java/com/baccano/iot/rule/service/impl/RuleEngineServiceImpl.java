package com.baccano.iot.rule.service.impl;

import com.baccano.iot.rule.entity.Rule;
import com.baccano.iot.rule.service.RuleEngineService;
import lombok.extern.slf4j.Slf4j;
import org.kie.api.KieServices;
import org.kie.api.builder.*;
import org.kie.api.conf.EqualityBehaviorOption;
import org.kie.api.conf.EventProcessingOption;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.builder.model.KieBaseModel;
import org.kie.api.builder.model.KieModuleModel;
import org.kie.api.builder.model.KieSessionModel;
// import org.kie.api.conf.ClockTypeOption;
import org.kie.internal.io.ResourceFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 规则引擎服务实现类
 *
 * @author baccano-iot
 */
@Slf4j
@Service
public class RuleEngineServiceImpl implements RuleEngineService {
    @Value("${rule.engine.type}")
    private String ruleEngineType;

    @Value("${rule.engine.rules-path}")
    private String rulesPath;

    @Value("${rule.engine.refresh-interval}")
    private Long refreshInterval;

    private KieServices kieServices;
    private KieContainer kieContainer;
    private KieSession kieSession;
    private boolean isRunning;
    private ScheduledExecutorService scheduledExecutorService;

    /**
     * 初始化规则引擎
     */
    @PostConstruct
    @Override
    public void init() {
        log.info("初始化规则引擎，类型: {}", ruleEngineType);
        
        // 初始化KieServices
        kieServices = KieServices.Factory.get();
        
        // 构建KieContainer
        buildKieContainer();
        
        // 初始化KieSession
        kieSession = kieContainer.newKieSession();
        
        // 启动规则刷新定时器
        startRuleRefreshTimer();
        
        isRunning = true;
        log.info("规则引擎初始化成功");
    }

    /**
     * 构建KieContainer
     */
    private void buildKieContainer() {
        // 创建KieModule
        KieModuleModel kieModuleModel = kieServices.newKieModuleModel();
        KieBaseModel kieBaseModel = kieModuleModel.newKieBaseModel("defaultKieBase")
                .setDefault(true)
                .setEqualsBehavior(EqualityBehaviorOption.EQUALITY)
                .setEventProcessingMode(EventProcessingOption.STREAM);

        KieSessionModel kieSessionModel = kieBaseModel.newKieSessionModel("defaultKieSession")
                .setDefault(true)
                .setType(KieSessionModel.KieSessionType.STATEFUL);
                // .setClockType(ClockTypeOption.get("realtime"));

        // 创建KieBuilder
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        kieFileSystem.writeKModuleXML(kieModuleModel.toXML());

        // 加载规则文件
        loadRuleFiles(kieFileSystem);

        // 构建KieModule
        KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
        kieBuilder.buildAll();

        // 检查构建结果
        if (kieBuilder.getResults().hasMessages(Message.Level.ERROR)) {
            throw new RuntimeException("规则构建失败: " + kieBuilder.getResults().toString());
        }

        // 创建KieContainer
        KieRepository kieRepository = kieServices.getRepository();
        kieContainer = kieServices.newKieContainer(kieRepository.getDefaultReleaseId());
    }

    /**
     * 加载规则文件
     *
     * @param kieFileSystem KieFileSystem对象
     */
    private void loadRuleFiles(KieFileSystem kieFileSystem) {
        // 这里简化处理，实际应该从数据库或文件系统加载规则
        log.info("加载规则文件，路径: {}", rulesPath);
        
        // 示例规则文件，实际应该从配置的路径加载
        String ruleContent = "package com.baccano.iot.rule\n" +
                "\n" +
                "import java.util.Map\n" +
                "\n" +
                "rule \"temperatureAlert\"\n" +
                "    when\n" +
                "        $data : Map()\n" +
                "        $temperature : Number() from $data.get('temperature')\n" +
                "        eval($temperature > 30)\n" +
                "    then\n" +
                "        System.out.println('温度超过阈值，当前温度: ' + $temperature);\n" +
                "        $data.put('alert', true);\n" +
                "        $data.put('alertMessage', '温度超过30度');\n" +
                "end\n";
        
        kieFileSystem.write("src/main/resources/rules/temperatureAlert.drl", ruleContent);
    }

    /**
     * 启动规则刷新定时器
     */
    private void startRuleRefreshTimer() {
        scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
        scheduledExecutorService.scheduleAtFixedRate(this::refreshRules, refreshInterval, refreshInterval, TimeUnit.MILLISECONDS);
        log.info("规则刷新定时器启动，间隔: {}毫秒", refreshInterval);
    }

    @Override
    public void loadRule(Rule rule) {
        log.info("加载规则: id={}, name={}", rule.getId(), rule.getName());
        // 实际实现应该将规则转换为Drools规则文件并加载
    }

    @Override
    public void unloadRule(Long ruleId) {
        log.info("卸载规则: id={}", ruleId);
        // 实际实现应该从KieContainer中卸载指定规则
    }

    @Override
    public Map<String, Object> executeRules(Map<String, Object> data) {
        if (!isRunning) {
            log.warn("规则引擎未运行，无法执行规则");
            return data;
        }

        log.debug("执行规则，数据: {}", data);
        
        try {
            // 将数据插入KieSession
            kieSession.insert(data);
            
            // 执行规则
            int fired = kieSession.fireAllRules();
            log.debug("规则执行完成，触发规则数量: {}", fired);
        } catch (Exception e) {
            log.error("规则执行异常: {}", e.getMessage(), e);
        }
        
        return data;
    }

    @Override
    public void refreshRules() {
        log.info("刷新规则");
        try {
            // 重新构建KieContainer
            buildKieContainer();
            
            // 关闭旧的KieSession
            if (kieSession != null) {
                kieSession.dispose();
            }
            
            // 创建新的KieSession
            kieSession = kieContainer.newKieSession();
            log.info("规则刷新成功");
        } catch (Exception e) {
            log.error("规则刷新失败: {}", e.getMessage(), e);
        }
    }

    @Override
    public boolean isRunning() {
        return isRunning;
    }
}
package com.baccano.iot.rule;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * 规则引擎服务启动类
 *
 * @author baccano-iot
 */
@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.baccano.iot.rule.mapper")
@ComponentScan(basePackages = "com.baccano.iot")
public class RuleEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(RuleEngineApplication.class, args);
    }
}
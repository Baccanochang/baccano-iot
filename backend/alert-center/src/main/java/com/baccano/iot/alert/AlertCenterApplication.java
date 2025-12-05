package com.baccano.iot.alert;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * 告警中心服务启动类
 *
 * @author baccano-iot
 */
@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.baccano.iot.alert.mapper")
@ComponentScan(basePackages = "com.baccano.iot")
public class AlertCenterApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlertCenterApplication.class, args);
    }
}
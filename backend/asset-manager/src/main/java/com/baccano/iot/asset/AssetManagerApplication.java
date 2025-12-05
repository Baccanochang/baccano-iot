package com.baccano.iot.asset;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * 资产管理服务启动类
 *
 * @author baccano-iot
 */
@SpringBootApplication
@EnableDiscoveryClient
@MapperScan("com.baccano.iot.asset.mapper")
@ComponentScan(basePackages = "com.baccano.iot")
public class AssetManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AssetManagerApplication.class, args);
    }
}
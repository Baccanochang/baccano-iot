package com.baccano.iot.device;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 设备管理服务启动类
 *
 * @author baccano-iot
 */
@SpringBootApplication
@EnableDiscoveryClient
public class DeviceManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeviceManagerApplication.class, args);
    }
}
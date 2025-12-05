package com.baccano.iot.connect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 设备连接服务启动类
 *
 * @author baccano-iot
 */
@SpringBootApplication
@EnableDiscoveryClient
public class DeviceConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeviceConnectApplication.class, args);
    }
}
package com.baccano.iot.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * API网关Security配置类
 * 确保CORS配置能够生效
 *
 * @author baccano-iot
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    /**
     * 配置安全过滤器链
     * 允许OPTIONS请求，关闭CSRF保护，确保CORS配置生效
     *
     * @param http ServerHttpSecurity
     * @return SecurityWebFilterChain
     */
    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                // 关闭CSRF保护
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                // 配置请求授权规则
                .authorizeExchange(exchanges -> exchanges
                        // 允许所有OPTIONS请求
                        .pathMatchers("/actuator/**").permitAll()
                        // 允许所有请求
                        .anyExchange().permitAll())
                // 确保CORS配置生效
                .cors(ServerHttpSecurity.CorsSpec::disable); // 禁用Security的CORS处理，使用Gateway的全局CORS配置

        return http.build();
    }
}

package com.baccano.iot.auth.controller;

import com.baccano.iot.auth.dto.LoginRequest;
import com.baccano.iot.auth.dto.LoginResponse;
import com.baccano.iot.auth.service.AuthService;
import com.baccano.iot.common.core.response.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * 认证授权Controller
 *
 * @author baccano-iot
 */
@Tag(name = "认证授权", description = "认证授权相关接口")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    /**
     * 认证服务
     */
    @Resource
    private AuthService authService;

    /**
     * 用户登录
     *
     * @param loginRequest 登录请求
     * @return 登录响应
     */
    @Operation(summary = "用户登录", description = "用户登录接口")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        return Result.success(loginResponse);
    }

    /**
     * 刷新令牌
     *
     * @param refreshToken 刷新令牌
     * @return 新的令牌
     */
    @Operation(summary = "刷新令牌", description = "刷新令牌接口")
    @PostMapping("/refresh")
    public Result<LoginResponse> refreshToken(@Parameter(description = "刷新令牌") @RequestParam String refreshToken) {
        LoginResponse loginResponse = authService.refreshToken(refreshToken);
        return Result.success(loginResponse);
    }

    /**
     * 退出登录
     *
     * @param token JWT令牌
     * @return 退出结果
     */
    @Operation(summary = "退出登录", description = "退出登录接口")
    @PostMapping("/logout")
    public Result<Void> logout(@Parameter(description = "JWT令牌") @RequestHeader("Authorization") String token) {
        // 去除Bearer前缀
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        authService.logout(token);
        return Result.success();
    }
}
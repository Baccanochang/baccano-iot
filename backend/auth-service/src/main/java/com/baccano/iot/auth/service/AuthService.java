package com.baccano.iot.auth.service;

import com.baccano.iot.auth.dto.LoginRequest;
import com.baccano.iot.auth.dto.LoginResponse;
import com.baccano.iot.auth.entity.User;

/**
 * 认证服务接口
 *
 * @author baccano-iot
 */
public interface AuthService {
    /**
     * 用户登录
     *
     * @param loginRequest 登录请求
     * @return 登录响应
     */
    LoginResponse login(LoginRequest loginRequest);

    /**
     * 刷新令牌
     *
     * @param refreshToken 刷新令牌
     * @return 新的令牌
     */
    LoginResponse refreshToken(String refreshToken);

    /**
     * 退出登录
     *
     * @param token JWT令牌
     */
    void logout(String token);

    /**
     * 根据用户名获取用户
     *
     * @param username 用户名
     * @return 用户信息
     */
    User getUserByUsername(String username);

    /**
     * 根据用户ID获取用户
     *
     * @param userId 用户ID
     * @return 用户信息
     */
    User getUserById(String userId);

    /**
     * 验证用户密码
     *
     * @param user     用户信息
     * @param password 密码
     * @return 是否验证通过
     */
    boolean verifyPassword(User user, String password);
}
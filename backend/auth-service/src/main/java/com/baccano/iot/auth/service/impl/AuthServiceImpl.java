package com.baccano.iot.auth.service.impl;

import com.baccano.iot.auth.dto.LoginRequest;
import com.baccano.iot.auth.dto.LoginResponse;
import com.baccano.iot.auth.entity.User;
import com.baccano.iot.auth.repository.UserRepository;
import com.baccano.iot.auth.service.AuthService;
import com.baccano.iot.auth.utils.JwtUtils;
import com.baccano.iot.common.core.exception.BusinessException;
import com.baccano.iot.common.core.response.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;

/**
 * 认证服务实现类
 *
 * @author baccano-iot
 */
@Slf4j
@Service
public class AuthServiceImpl implements AuthService {
    /**
     * 用户Repository
     */
    @Resource
    private UserRepository userRepository;

    /**
     * JWT工具类
     */
    @Resource
    private JwtUtils jwtUtils;

    /**
     * 密码编码器
     */
    @Resource
    private PasswordEncoder passwordEncoder;

    /**
     * JWT过期时间，单位：秒
     */
    @Value("${jwt.expire}")
    private Long expire;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        // 根据用户名获取用户
        User user = getUserByUsername(loginRequest.getUsername());
        if (user == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户名或密码错误");
        }

        // 验证密码
        if (!verifyPassword(user, loginRequest.getPassword())) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户账号已禁用");
        }

        // 生成JWT令牌
        String accessToken = jwtUtils.generateToken(user.getId(), user.getUsername(), user.getTenantId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getId(), user.getUsername(), user.getTenantId());

        // 构建登录响应
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(expire);
        response.setRefreshToken(refreshToken);

        // 构建用户信息
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setNickname(user.getNickname());
        userInfo.setEmail(user.getEmail());
        userInfo.setMobile(user.getMobile());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setTenantId(user.getTenantId());
        userInfo.setType(user.getType());
        response.setUser(userInfo);

        log.info("用户登录成功: username={}, userId={}", user.getUsername(), user.getId());
        return response;
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // 验证刷新令牌
        if (!jwtUtils.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "刷新令牌无效");
        }

        // 从刷新令牌中获取用户信息
        String userId = jwtUtils.getUserIdFromToken(refreshToken);
        String username = jwtUtils.getUsernameFromToken(refreshToken);
        String tenantId = jwtUtils.getTenantIdFromToken(refreshToken);

        // 验证用户是否存在
        User user = getUserById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED.getCode(), "用户不存在");
        }

        // 生成新的访问令牌
        String accessToken = jwtUtils.generateToken(userId, username, tenantId);

        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(expire);
        response.setRefreshToken(refreshToken);

        // 构建用户信息
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setUsername(user.getUsername());
        userInfo.setNickname(user.getNickname());
        userInfo.setEmail(user.getEmail());
        userInfo.setMobile(user.getMobile());
        userInfo.setAvatar(user.getAvatar());
        userInfo.setTenantId(user.getTenantId());
        userInfo.setType(user.getType());
        response.setUser(userInfo);

        log.info("令牌刷新成功: username={}, userId={}", username, userId);
        return response;
    }

    @Override
    public void logout(String token) {
        // 从令牌中获取用户信息
        String userId = jwtUtils.getUserIdFromToken(token);
        String username = jwtUtils.getUsernameFromToken(token);

        // 这里可以添加令牌黑名单逻辑，例如将令牌存入Redis中，设置过期时间为令牌剩余有效期
        // 目前暂时不实现令牌黑名单，后续可以扩展

        log.info("用户退出登录: username={}, userId={}", username, userId);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public boolean verifyPassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }
}
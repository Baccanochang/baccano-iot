package com.baccano.iot.auth.dto;

import lombok.Data;

/**
 * 登录响应DTO
 *
 * @author baccano-iot
 */
@Data
public class LoginResponse {
    /**
     * 访问令牌
     */
    private String accessToken;

    /**
     * 令牌类型
     */
    private String tokenType;

    /**
     * 过期时间，单位：秒
     */
    private Long expiresIn;

    /**
     * 刷新令牌
     */
    private String refreshToken;

    /**
     * 用户信息
     */
    private UserInfo user;

    /**
     * 用户信息内部类
     */
    @Data
    public static class UserInfo {
        /**
         * 用户ID
         */
        private String id;

        /**
         * 用户名
         */
        private String username;

        /**
         * 昵称
         */
        private String nickname;

        /**
         * 邮箱
         */
        private String email;

        /**
         * 手机号
         */
        private String mobile;

        /**
         * 头像
         */
        private String avatar;

        /**
         * 租户ID
         */
        private String tenantId;

        /**
         * 账号类型 0:普通用户 1:管理员 2:系统用户
         */
        private Integer type;
    }
}
package com.baccano.iot.auth.entity;

import com.baccano.iot.auth.entity.JpaBaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;
import java.util.Set;

/**
 * 用户实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "iot_user")
public class User extends JpaBaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 用户名
     */
    @Column(name = "username", unique = true, nullable = false, length = 50)
    private String username;

    /**
     * 密码
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * 昵称
     */
    @Column(name = "nickname", length = 50)
    private String nickname;

    /**
     * 邮箱
     */
    @Column(name = "email", unique = true, length = 100)
    private String email;

    /**
     * 手机号
     */
    @Column(name = "mobile", unique = true, length = 20)
    private String mobile;

    /**
     * 头像
     */
    @Column(name = "avatar", length = 255)
    private String avatar;

    /**
     * 状态 0:禁用 1:启用
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 账号类型 0:普通用户 1:管理员 2:系统用户
     */
    @Column(name = "type", nullable = false)
    private Integer type;

    /**
     * 用户角色关联
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "iot_user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;
}
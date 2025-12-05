package com.baccano.iot.auth.entity;

import com.baccano.iot.auth.entity.JpaBaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;
import java.util.Set;

/**
 * 角色实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "iot_role")
public class Role extends JpaBaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 角色名称
     */
    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    /**
     * 角色编码
     */
    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    /**
     * 角色描述
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * 状态 0:禁用 1:启用
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 角色权限关联
     */
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "iot_role_permission",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private Set<Permission> permissions;

    /**
     * 角色用户关联
     */
    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}
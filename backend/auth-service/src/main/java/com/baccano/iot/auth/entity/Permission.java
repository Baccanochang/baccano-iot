package com.baccano.iot.auth.entity;

import com.baccano.iot.auth.entity.JpaBaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;
import java.util.Set;

/**
 * 权限实体类
 *
 * @author baccano-iot
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "iot_permission")
public class Permission extends JpaBaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 权限名称
     */
    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;

    /**
     * 权限编码
     */
    @Column(name = "code", unique = true, nullable = false, length = 50)
    private String code;

    /**
     * 权限描述
     */
    @Column(name = "description", length = 255)
    private String description;

    /**
     * 权限类型 0:菜单 1:按钮 2:接口
     */
    @Column(name = "type", nullable = false)
    private Integer type;

    /**
     * 父权限ID
     */
    @Column(name = "parent_id")
    private String parentId;

    /**
     * 排序
     */
    @Column(name = "sort")
    private Integer sort;

    /**
     * 状态 0:禁用 1:启用
     */
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 权限路径
     */
    @Column(name = "path", length = 255)
    private String path;

    /**
     * 权限组件
     */
    @Column(name = "component", length = 255)
    private String component;

    /**
     * 权限图标
     */
    @Column(name = "icon", length = 50)
    private String icon;

    /**
     * 是否显示 0:隐藏 1:显示
     */
    @Column(name = "visible")
    private Integer visible;

    /**
     * 是否缓存 0:不缓存 1:缓存
     */
    @Column(name = "keep_alive")
    private Integer keepAlive;

    /**
     * 权限角色关联
     */
    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;
}
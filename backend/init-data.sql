-- Baccano-IoT 后端初始化数据脚本
-- 生成时间：2025-12-18

-- ==============================================
-- 1. 创建基础权限（菜单和按钮）
-- ==============================================
INSERT INTO iot_permission (id, name, code, description, type, parent_id, sort, status, path, component, icon, visible,
                            keep_alive, create_time, update_time, create_by, update_by, tenant_id, deleted, version)
VALUES
-- 系统管理菜单
('1', '系统管理', 'sys:manage', '系统管理模块', 0, NULL, 1, 1, '/system', 'Layout', 'Setting', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),

-- 用户管理菜单
('2', '用户管理', 'sys:user:manage', '用户管理', 0, '1', 1, 1, '/system/user', 'system/User', 'User', 1, 0,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
-- 用户管理按钮
('3', '用户查询', 'sys:user:list', '查询用户列表', 1, '2', 1, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('4', '用户新增', 'sys:user:add', '新增用户', 1, '2', 2, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('5', '用户编辑', 'sys:user:edit', '编辑用户', 1, '2', 3, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('6', '用户删除', 'sys:user:delete', '删除用户', 1, '2', 4, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),

-- 角色管理菜单
('7', '角色管理', 'sys:role:manage', '角色管理', 0, '1', 2, 1, '/system/role', 'system/Role', 'Role', 1, 0,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
-- 角色管理按钮
('8', '角色查询', 'sys:role:list', '查询角色列表', 1, '7', 1, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('9', '角色新增', 'sys:role:add', '新增角色', 1, '7', 2, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('10', '角色编辑', 'sys:role:edit', '编辑角色', 1, '7', 3, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('11', '角色删除', 'sys:role:delete', '删除角色', 1, '7', 4, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),

-- 权限管理菜单
('12', '权限管理', 'sys:permission:manage', '权限管理', 0, '1', 3, 1, '/system/permission', 'system/Permission',
 'Permission', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
-- 权限管理按钮
('13', '权限查询', 'sys:permission:list', '查询权限列表', 1, '12', 1, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
('14', '权限新增', 'sys:permission:add', '新增权限', 1, '12', 2, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
('15', '权限编辑', 'sys:permission:edit', '编辑权限', 1, '12', 3, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
('16', '权限删除', 'sys:permission:delete', '删除权限', 1, '12', 4, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),

-- 设备管理菜单
('17', '设备管理', 'device:manage', '设备管理模块', 0, NULL, 2, 1, '/device', 'Layout', 'Device', 1, 0,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),

-- 设备列表菜单
('18', '设备列表', 'device:list:manage', '设备列表', 0, '17', 1, 1, '/device/list', 'device/DeviceList', 'DeviceList',
 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
-- 设备列表按钮
('19', '设备查询', 'device:list', '查询设备列表', 1, '18', 1, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('20', '设备新增', 'device:add', '新增设备', 1, '18', 2, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('21', '设备编辑', 'device:edit', '编辑设备', 1, '18', 3, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('22', '设备删除', 'device:delete', '删除设备', 1, '18', 4, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('23', '设备详情', 'device:detail', '查看设备详情', 1, '18', 5, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP,
 CURRENT_TIMESTAMP, 'system', 'system', 'default', 0, 1),
('24', '设备激活', 'device:activate', '激活设备', 1, '18', 6, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1),
('25', '设备禁用', 'device:disable', '禁用设备', 1, '18', 7, 1, '', '', '', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
 'system', 'system', 'default', 0, 1);

-- ==============================================
-- 2. 创建角色
-- ==============================================
-- 系统管理员角色（最高等级）
INSERT INTO iot_role (id, name, code, description, status, create_time, update_time, create_by, update_by, tenant_id,
                      deleted, version)
VALUES ('1', '系统管理员', 'SYSTEM_ADMIN', '系统最高权限管理员', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system',
        'system', 'default', 0, 1),

-- 普通管理员角色
       ('2', '普通管理员', 'ADMIN', '普通管理员', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system',
        'default', 0, 1),

-- 普通用户角色
       ('3', '普通用户', 'USER', '普通用户', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system', 'default', 0,
        1);

-- ==============================================
-- 3. 角色权限关联（系统管理员拥有所有权限）
-- ==============================================
INSERT INTO iot_role_permission (role_id, permission_id)
SELECT '1', id
FROM iot_permission;

-- 普通管理员只有设备管理权限
INSERT INTO iot_role_permission (role_id, permission_id)
VALUES ('2', '17'),
       ('2', '18'),
       ('2', '19'),
       ('2', '20'),
       ('2', '21'),
       ('2', '22'),
       ('2', '23'),
       ('2', '24'),
       ('2', '25');

-- 普通用户只有设备查看权限
INSERT INTO iot_role_permission (role_id, permission_id)
VALUES ('3', '17'),
       ('3', '18'),
       ('3', '19'),
       ('3', '23');

-- ==============================================
-- 4. 创建超级管理员用户
-- ==============================================
-- 密码：super123!（BCrypt加密）
INSERT INTO iot_user (id, username, password, nickname, email, mobile, avatar, status, type, create_time, update_time,
                      create_by, update_by, tenant_id, deleted, version)
VALUES ('1', 'admin', '$2a$10$7g8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s', '超级管理员',
        'admin@baccano-iot.com', '13800138000', '', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'system', 'system',
        'default', 0, 1);

-- ==============================================
-- 5. 用户角色关联（将超级管理员用户关联到系统管理员角色）
-- ==============================================
INSERT INTO iot_user_role (user_id, role_id)
VALUES ('1', '1');

-- ==============================================
-- 6. 创建测试设备（可选）
-- ==============================================
INSERT INTO iot_device (id, name, device_key, product_id, device_type, status, device_version, description, tags,
                        location, last_online_time, activate_time, certificate_id, create_time, update_time, create_by,
                        update_by, tenant_id, deleted, version)
VALUES ('1', '测试设备001', 'device_001', 'product_001', 'temperature_sensor', 0, '1.0.0', '测试温度传感器设备',
        '{"manufacturer": "Baccano", "model": "TS-001"}', '{"latitude": "39.9042", "longitude": "116.4074"}', NULL,
        NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', 'admin', 'default', 0, 1);

INSERT INTO iot_device_credential (id, device_id, type, content, status, expire_time, create_time, update_time,
                                   create_by, update_by, tenant_id, deleted, version)
VALUES ('1', '1', 0, 'device_secret_001', 1, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', 'admin', 'default', 0,
        1);

-- ==============================================
-- 初始化脚本结束
-- ==============================================

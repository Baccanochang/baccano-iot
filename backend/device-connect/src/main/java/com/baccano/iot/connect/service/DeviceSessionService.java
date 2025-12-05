package com.baccano.iot.connect.service;

import com.baccano.iot.connect.entity.DeviceSession;

/**
 * 设备会话管理服务
 *
 * @author baccano-iot
 */
public interface DeviceSessionService {
    /**
     * 创建设备会话
     *
     * @param session 设备会话信息
     * @return 设备会话
     */
    DeviceSession createSession(DeviceSession session);

    /**
     * 更新设备会话
     *
     * @param session 设备会话信息
     * @return 设备会话
     */
    DeviceSession updateSession(DeviceSession session);

    /**
     * 删除设备会话
     *
     * @param deviceKey 设备Key
     * @return 删除结果
     */
    boolean deleteSession(String deviceKey);

    /**
     * 获取设备会话
     *
     * @param deviceKey 设备Key
     * @return 设备会话
     */
    DeviceSession getSession(String deviceKey);

    /**
     * 根据客户端ID获取设备会话
     *
     * @param clientId 客户端ID
     * @return 设备会话
     */
    DeviceSession getSessionByClientId(String clientId);

    /**
     * 设备上线
     *
     * @param deviceKey 设备Key
     * @param clientId  客户端ID
     * @param protocol  协议类型
     * @param ip        设备IP
     * @param port      设备端口
     * @return 设备会话
     */
    DeviceSession online(String deviceKey, String clientId, String protocol, String ip, Integer port);

    /**
     * 设备下线
     *
     * @param deviceKey 设备Key
     */
    void offline(String deviceKey);

    /**
     * 设备心跳
     *
     * @param deviceKey 设备Key
     */
    void heartbeat(String deviceKey);

    /**
     * 检查设备会话是否超时
     *
     * @param session 设备会话
     * @return 是否超时
     */
    boolean isSessionTimeout(DeviceSession session);

    /**
     * 清理超时会话
     */
    void cleanTimeoutSessions();
}
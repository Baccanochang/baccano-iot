package com.baccano.iot.connect.service.impl;

import com.baccano.iot.connect.entity.DeviceSession;
import com.baccano.iot.connect.service.DeviceSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * 设备会话管理服务实现类
 *
 * @author baccano-iot
 */
@Slf4j
@Service
public class DeviceSessionServiceImpl implements DeviceSessionService {
    /**
     * Redis模板
     */
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 会话超时时间，单位：秒
     */
    @Value("${device.session.timeout}")
    private Integer sessionTimeout;

    /**
     * 心跳间隔，单位：秒
     */
    @Value("${device.session.heartbeatInterval}")
    private Integer heartbeatInterval;

    /**
     * Redis key前缀
     */
    private static final String SESSION_KEY_PREFIX = "device:session:";
    private static final String CLIENT_ID_KEY_PREFIX = "device:client:id:";
    private static final String SESSION_SET_KEY = "device:sessions";

    /**
     * 获取会话Redis Key
     *
     * @param deviceKey 设备Key
     * @return Redis Key
     */
    private String getSessionKey(String deviceKey) {
        return SESSION_KEY_PREFIX + deviceKey;
    }

    /**
     * 获取客户端ID Redis Key
     *
     * @param clientId 客户端ID
     * @return Redis Key
     */
    private String getClientIdKey(String clientId) {
        return CLIENT_ID_KEY_PREFIX + clientId;
    }

    @Override
    public DeviceSession createSession(DeviceSession session) {
        // 设置默认值
        session.setStatus(1); // 在线状态
        session.setConnectTime(LocalDateTime.now());
        session.setLastOnlineTime(LocalDateTime.now());
        session.setHeartbeatTime(LocalDateTime.now());
        session.setTimeout(sessionTimeout);

        // 保存到Redis
        String sessionKey = getSessionKey(session.getDeviceKey());
        redisTemplate.opsForValue().set(sessionKey, session, sessionTimeout, TimeUnit.SECONDS);

        // 保存客户端ID映射
        String clientIdKey = getClientIdKey(session.getClientId());
        redisTemplate.opsForValue().set(clientIdKey, session.getDeviceKey(), sessionTimeout, TimeUnit.SECONDS);

        // 添加到会话集合
        redisTemplate.opsForSet().add(SESSION_SET_KEY, session.getDeviceKey());

        log.info("创建设备会话成功: deviceKey={}, clientId={}, protocol={}", 
                session.getDeviceKey(), session.getClientId(), session.getProtocol());
        return session;
    }

    @Override
    public DeviceSession updateSession(DeviceSession session) {
        String sessionKey = getSessionKey(session.getDeviceKey());
        redisTemplate.opsForValue().set(sessionKey, session, sessionTimeout, TimeUnit.SECONDS);
        return session;
    }

    @Override
    public boolean deleteSession(String deviceKey) {
        String sessionKey = getSessionKey(deviceKey);
        DeviceSession session = (DeviceSession) redisTemplate.opsForValue().get(sessionKey);
        if (session != null) {
            // 删除客户端ID映射
            String clientIdKey = getClientIdKey(session.getClientId());
            redisTemplate.delete(clientIdKey);
        }

        // 从会话集合中删除
        redisTemplate.opsForSet().remove(SESSION_SET_KEY, deviceKey);

        // 删除会话
        Boolean deleteResult = redisTemplate.delete(sessionKey);
        boolean result = deleteResult != null && deleteResult;
        log.info("删除设备会话: deviceKey={}, result={}", deviceKey, result);
        return result;
    }

    @Override
    public DeviceSession getSession(String deviceKey) {
        String sessionKey = getSessionKey(deviceKey);
        return (DeviceSession) redisTemplate.opsForValue().get(sessionKey);
    }

    @Override
    public DeviceSession getSessionByClientId(String clientId) {
        String clientIdKey = getClientIdKey(clientId);
        String deviceKey = (String) redisTemplate.opsForValue().get(clientIdKey);
        if (deviceKey != null) {
            return getSession(deviceKey);
        }
        return null;
    }

    @Override
    public DeviceSession online(String deviceKey, String clientId, String protocol, String ip, Integer port) {
        // 检查是否已存在会话
        DeviceSession session = getSession(deviceKey);
        if (session != null) {
            // 先删除旧会话
            deleteSession(deviceKey);
        }

        // 创建新会话
        session = new DeviceSession();
        session.setDeviceKey(deviceKey);
        session.setClientId(clientId);
        session.setProtocol(protocol);
        session.setIp(ip);
        session.setPort(port);
        return createSession(session);
    }

    @Override
    public void offline(String deviceKey) {
        DeviceSession session = getSession(deviceKey);
        if (session != null) {
            session.setStatus(2); // 离线状态
            session.setDisconnectTime(LocalDateTime.now());
            updateSession(session);
            log.info("设备下线: deviceKey={}, clientId={}, protocol={}", 
                    session.getDeviceKey(), session.getClientId(), session.getProtocol());
        }
    }

    @Override
    public void heartbeat(String deviceKey) {
        DeviceSession session = getSession(deviceKey);
        if (session != null) {
            session.setHeartbeatTime(LocalDateTime.now());
            session.setLastOnlineTime(LocalDateTime.now());
            updateSession(session);
            log.debug("设备心跳: deviceKey={}", deviceKey);
        }
    }

    @Override
    public boolean isSessionTimeout(DeviceSession session) {
        if (session == null) {
            return true;
        }
        LocalDateTime now = LocalDateTime.now();
        return session.getHeartbeatTime().plusSeconds(session.getTimeout()).isBefore(now);
    }

    @Override
    public void cleanTimeoutSessions() {
        Set<Object> deviceKeys = redisTemplate.opsForSet().members(SESSION_SET_KEY);
        if (deviceKeys != null && !deviceKeys.isEmpty()) {
            for (Object deviceKeyObj : deviceKeys) {
                String deviceKey = (String) deviceKeyObj;
                DeviceSession session = getSession(deviceKey);
                if (session != null && isSessionTimeout(session)) {
                    offline(deviceKey);
                    deleteSession(deviceKey);
                    log.info("清理超时会话: deviceKey={}", deviceKey);
                }
            }
        }
    }
}
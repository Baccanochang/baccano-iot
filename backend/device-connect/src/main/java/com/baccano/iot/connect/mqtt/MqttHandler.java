package com.baccano.iot.connect.mqtt;

import com.baccano.iot.connect.service.DeviceSessionService;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.mqtt.*;
import io.netty.handler.timeout.IdleStateEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

/**
 * MQTT消息处理器
 *
 * @author baccano-iot
 */
@Slf4j
@Component
public class MqttHandler extends ChannelInboundHandlerAdapter {
    @Autowired
    private DeviceSessionService deviceSessionService;

    /**
     * 存储设备主题订阅关系
     */
    private final Map<String, String> deviceTopicMap = new HashMap<>();

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (msg instanceof MqttMessage) {
            MqttMessage mqttMessage = (MqttMessage) msg;
            MqttFixedHeader fixedHeader = mqttMessage.fixedHeader();
            MqttMessageType messageType = fixedHeader.messageType();

            switch (messageType) {
                case CONNECT -> handleConnect(ctx, (MqttConnectMessage) mqttMessage);
                case CONNACK -> handleConnAck(ctx, (MqttConnAckMessage) mqttMessage);
                case PUBLISH -> handlePublish(ctx, (MqttPublishMessage) mqttMessage);
                case PUBACK -> handlePubAck(ctx, (MqttPubAckMessage) mqttMessage);
                // case PUBREC -> handlePubRec(ctx, (MqttPubRecMessage) mqttMessage);
                // case PUBREL -> handlePubRel(ctx, (MqttPubRelMessage) mqttMessage);
                // case PUBCOMP -> handlePubComp(ctx, (MqttPubCompMessage) mqttMessage);
                case SUBSCRIBE -> handleSubscribe(ctx, (MqttSubscribeMessage) mqttMessage);
                case SUBACK -> handleSubAck(ctx, (MqttSubAckMessage) mqttMessage);
                case UNSUBSCRIBE -> handleUnsubscribe(ctx, (MqttUnsubscribeMessage) mqttMessage);
                case UNSUBACK -> handleUnsubAck(ctx, (MqttUnsubAckMessage) mqttMessage);
                case PINGREQ -> handlePingReq(ctx, mqttMessage);
                case PINGRESP -> handlePingResp(ctx, mqttMessage);
                case DISCONNECT -> handleDisconnect(ctx, mqttMessage);
                default -> log.warn("未知MQTT消息类型: {}", messageType);
            }
        }
    }

    /**
     * 处理连接请求
     */
    private void handleConnect(ChannelHandlerContext ctx, MqttConnectMessage msg) {
        MqttConnectPayload payload = msg.payload();
        String clientId = payload.clientIdentifier();
        String username = payload.userName();
        String password = new String(payload.passwordInBytes());
        String protocol = "mqtt";

        // 获取客户端IP地址
        InetSocketAddress address = (InetSocketAddress) ctx.channel().remoteAddress();
        String ip = address.getAddress().getHostAddress();
        int port = address.getPort();

        log.info("设备连接请求: clientId={}, username={}, ip={}:{}", clientId, username, ip, port);

        // 验证设备凭证（这里简化处理，实际应该调用auth-service进行验证）
        boolean isValid = true;
        if (isValid) {
            // 创建设备会话
            deviceSessionService.online(username, clientId, protocol, ip, port);

            // 存储设备主题订阅关系
            deviceTopicMap.put(clientId, username);

            // 发送连接确认
            MqttFixedHeader fixedHeader = new MqttFixedHeader(MqttMessageType.CONNACK, false, MqttQoS.AT_MOST_ONCE, false, 0);
            MqttConnAckVariableHeader variableHeader = new MqttConnAckVariableHeader(MqttConnectReturnCode.CONNECTION_ACCEPTED, false);
            MqttConnAckMessage connAckMessage = new MqttConnAckMessage(fixedHeader, variableHeader);
            ctx.writeAndFlush(connAckMessage);
            log.info("设备连接成功: clientId={}, username={}", clientId, username);
        } else {
            // 发送连接拒绝
            MqttFixedHeader fixedHeader = new MqttFixedHeader(MqttMessageType.CONNACK, false, MqttQoS.AT_MOST_ONCE, false, 0);
            MqttConnAckVariableHeader variableHeader = new MqttConnAckVariableHeader(MqttConnectReturnCode.CONNECTION_REFUSED_BAD_USER_NAME_OR_PASSWORD, false);
            MqttConnAckMessage connAckMessage = new MqttConnAckMessage(fixedHeader, variableHeader);
            ctx.writeAndFlush(connAckMessage);
            ctx.close();
            log.warn("设备连接失败: 用户名或密码错误, clientId={}, username={}", clientId, username);
        }
    }

    /**
     * 处理连接确认
     */
    private void handleConnAck(ChannelHandlerContext ctx, MqttConnAckMessage msg) {
        // 客户端收到连接确认，服务端不需要处理
    }

    /**
     * 处理发布消息
     */
    private void handlePublish(ChannelHandlerContext ctx, MqttPublishMessage msg) {
        MqttFixedHeader fixedHeader = msg.fixedHeader();
        MqttPublishVariableHeader variableHeader = msg.variableHeader();
        String topic = variableHeader.topicName();
        int packetId = variableHeader.packetId();
        byte[] payload = new byte[msg.payload().readableBytes()];
        msg.payload().readBytes(payload);

        log.info("收到发布消息: topic={}, packetId={}, payload={}", topic, packetId, new String(payload));

        // 处理QoS等级
        if (fixedHeader.qosLevel() == MqttQoS.AT_LEAST_ONCE) {
            // 发送PUBACK
            MqttFixedHeader pubAckFixedHeader = new MqttFixedHeader(MqttMessageType.PUBACK, false, MqttQoS.AT_MOST_ONCE, false, 0);
            MqttMessageIdVariableHeader pubAckVariableHeader = MqttMessageIdVariableHeader.from(packetId);
            MqttPubAckMessage pubAckMessage = new MqttPubAckMessage(pubAckFixedHeader, pubAckVariableHeader);
            ctx.writeAndFlush(pubAckMessage);
        }
        // 暂时注释掉EXACTLY_ONCE QoS处理，因为Netty版本可能不支持MqttPubRecMessage类
        /*else if (fixedHeader.qosLevel() == MqttQoS.EXACTLY_ONCE) {
            // 发送PUBREC
            MqttFixedHeader pubRecFixedHeader = new MqttFixedHeader(MqttMessageType.PUBREC, false, MqttQoS.AT_MOST_ONCE, false, 0);
            MqttMessageIdVariableHeader pubRecVariableHeader = MqttMessageIdVariableHeader.from(packetId);
            MqttPubRecMessage pubRecMessage = new MqttPubRecMessage(pubRecFixedHeader, pubRecVariableHeader);
            ctx.writeAndFlush(pubRecMessage);
        }*/

        // 这里应该将消息转发到RocketMQ或其他消息队列，用于后续处理
    }

    /**
     * 处理发布确认
     */
    private void handlePubAck(ChannelHandlerContext ctx, MqttPubAckMessage msg) {
        // 客户端收到发布确认，服务端不需要处理
    }

    /**
     * 处理发布接收
     */
    // private void handlePubRec(ChannelHandlerContext ctx, MqttPubRecMessage msg) {
    //     // 发送PUBREL
    //     MqttFixedHeader pubRelFixedHeader = new MqttFixedHeader(MqttMessageType.PUBREL, false, MqttQoS.AT_LEAST_ONCE, false, 0);
    //     MqttMessageIdVariableHeader pubRelVariableHeader = msg.variableHeader();
    //     MqttPubRelMessage pubRelMessage = new MqttPubRelMessage(pubRelFixedHeader, pubRelVariableHeader);
    //     ctx.writeAndFlush(pubRelMessage);
    // }

    /**
     * 处理发布释放
     */
    // private void handlePubRel(ChannelHandlerContext ctx, MqttPubRelMessage msg) {
    //     // 发送PUBCOMP
    //     MqttFixedHeader pubCompFixedHeader = new MqttFixedHeader(MqttMessageType.PUBCOMP, false, MqttQoS.AT_MOST_ONCE, false, 0);
    //     MqttMessageIdVariableHeader pubCompVariableHeader = msg.variableHeader();
    //     MqttPubCompMessage pubCompMessage = new MqttPubCompMessage(pubCompFixedHeader, pubCompVariableHeader);
    //     ctx.writeAndFlush(pubCompMessage);
    // }

    /**
     * 处理发布完成
     */
    // private void handlePubComp(ChannelHandlerContext ctx, MqttPubCompMessage msg) {
    //     // 客户端收到发布完成，服务端不需要处理
    // }

    /**
     * 处理订阅请求
     */
    private void handleSubscribe(ChannelHandlerContext ctx, MqttSubscribeMessage msg) {
        MqttMessageIdVariableHeader variableHeader = msg.variableHeader();
        int packetId = variableHeader.messageId();
        // 传递空数组给MqttSubAckPayload构造函数
        MqttSubAckPayload payload = new MqttSubAckPayload(new int[0]);

        log.info("设备订阅请求: packetId={}", packetId);

        // 发送订阅确认
        MqttFixedHeader fixedHeader = new MqttFixedHeader(MqttMessageType.SUBACK, false, MqttQoS.AT_MOST_ONCE, false, 0);
        // 使用MqttMessageIdVariableHeader直接作为subAckVariableHeader
        MqttMessageIdVariableHeader subAckVariableHeader = MqttMessageIdVariableHeader.from(packetId);
        MqttSubAckMessage subAckMessage = new MqttSubAckMessage(fixedHeader, subAckVariableHeader, payload);
        ctx.writeAndFlush(subAckMessage);
    }

    /**
     * 处理订阅确认
     */
    private void handleSubAck(ChannelHandlerContext ctx, MqttSubAckMessage msg) {
        // 客户端收到订阅确认，服务端不需要处理
    }

    /**
     * 处理取消订阅请求
     */
    private void handleUnsubscribe(ChannelHandlerContext ctx, MqttUnsubscribeMessage msg) {
        MqttMessageIdVariableHeader variableHeader = msg.variableHeader();
        int packetId = variableHeader.messageId();

        log.info("设备取消订阅请求: packetId={}", packetId);

        // 发送取消订阅确认
        MqttFixedHeader fixedHeader = new MqttFixedHeader(MqttMessageType.UNSUBACK, false, MqttQoS.AT_MOST_ONCE, false, 0);
        MqttMessageIdVariableHeader unsubAckVariableHeader = MqttMessageIdVariableHeader.from(packetId);
        MqttUnsubAckMessage unsubAckMessage = new MqttUnsubAckMessage(fixedHeader, unsubAckVariableHeader);
        ctx.writeAndFlush(unsubAckMessage);
    }

    /**
     * 处理取消订阅确认
     */
    private void handleUnsubAck(ChannelHandlerContext ctx, MqttUnsubAckMessage msg) {
        // 客户端收到取消订阅确认，服务端不需要处理
    }

    /**
     * 处理心跳请求
     */
    private void handlePingReq(ChannelHandlerContext ctx, MqttMessage msg) {
        // 发送心跳响应
        MqttFixedHeader fixedHeader = new MqttFixedHeader(MqttMessageType.PINGRESP, false, MqttQoS.AT_MOST_ONCE, false, 0);
        MqttMessage pingRespMessage = new MqttMessage(fixedHeader);
        ctx.writeAndFlush(pingRespMessage);

        // 更新设备会话心跳时间
        String clientId = ctx.channel().id().asShortText();
        String deviceKey = deviceTopicMap.get(clientId);
        if (deviceKey != null) {
            deviceSessionService.heartbeat(deviceKey);
            log.debug("设备心跳: deviceKey={}", deviceKey);
        }
    }

    /**
     * 处理心跳响应
     */
    private void handlePingResp(ChannelHandlerContext ctx, MqttMessage msg) {
        // 客户端收到心跳响应，服务端不需要处理
    }

    /**
     * 处理断开连接请求
     */
    private void handleDisconnect(ChannelHandlerContext ctx, MqttMessage msg) {
        String clientId = ctx.channel().id().asShortText();
        String deviceKey = deviceTopicMap.get(clientId);
        if (deviceKey != null) {
            deviceSessionService.offline(deviceKey);
            deviceTopicMap.remove(clientId);
            log.info("设备主动断开连接: deviceKey={}", deviceKey);
        }
        ctx.close();
    }

    /**
     * 处理空闲状态事件
     */
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) {
        if (evt instanceof IdleStateEvent) {
            IdleStateEvent event = (IdleStateEvent) evt;
            log.warn("设备心跳超时: clientId={}", ctx.channel().id().asShortText());
            
            // 设备超时，断开连接
            String clientId = ctx.channel().id().asShortText();
            String deviceKey = deviceTopicMap.get(clientId);
            if (deviceKey != null) {
                deviceSessionService.offline(deviceKey);
                deviceTopicMap.remove(clientId);
                log.info("设备心跳超时，断开连接: deviceKey={}", deviceKey);
            }
            ctx.close();
        }
    }

    /**
     * 处理连接关闭
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        String clientId = ctx.channel().id().asShortText();
        String deviceKey = deviceTopicMap.get(clientId);
        if (deviceKey != null) {
            deviceSessionService.offline(deviceKey);
            deviceTopicMap.remove(clientId);
            log.info("设备连接关闭: deviceKey={}", deviceKey);
        }
    }

    /**
     * 处理异常
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("MQTT处理异常: {}", cause.getMessage(), cause);
        ctx.close();
    }
}
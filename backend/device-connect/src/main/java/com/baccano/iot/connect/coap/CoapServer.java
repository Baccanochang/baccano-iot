package com.baccano.iot.connect.coap;

// import io.netty.bootstrap.ServerBootstrap;
// import io.netty.channel.ChannelFuture;
// import io.netty.channel.ChannelInitializer;
// import io.netty.channel.ChannelOption;
// import io.netty.channel.EventLoopGroup;
// import io.netty.channel.nio.NioEventLoopGroup;
// import io.netty.channel.socket.SocketChannel;
// import io.netty.channel.socket.nio.NioServerSocketChannel;
// import io.netty.handler.codec.DatagramPacketDecoder;
// import io.netty.handler.codec.DatagramPacketEncoder;
// import io.netty.handler.codec.coap.CoapDecoder;
// import io.netty.handler.codec.coap.CoapEncoder;
// import io.netty.handler.logging.LogLevel;
// import io.netty.handler.logging.LoggingHandler;
// import io.netty.handler.timeout.IdleStateHandler;
import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Component;

// import jakarta.annotation.PostConstruct;
// import jakarta.annotation.PreDestroy;
// import java.util.concurrent.TimeUnit;

/**
 * CoAP服务器实现
 *
 * @author baccano-iot
 */
// @Slf4j
// @Component
public class CoapServer {
    // @Value("${coap.server.host}")
    // private String host;

    // @Value("${coap.server.port}")
    // private Integer port;

    // @Value("${coap.sslPort}")
    // private Integer sslPort;

    // @Autowired
    // private CoapHandler coapHandler;

    // private EventLoopGroup bossGroup;
    // private EventLoopGroup workerGroup;

    /**
     * 启动CoAP服务器
     */
    // @PostConstruct
    // public void start() {
    //     bossGroup = new NioEventLoopGroup(1);
    //     workerGroup = new NioEventLoopGroup();

    //     try {
    //         ServerBootstrap b = new ServerBootstrap();
    //         b.group(bossGroup, workerGroup)
    //                 .channel(NioServerSocketChannel.class)
    //                 .option(ChannelOption.SO_BACKLOG, 1024)
    //                 .childOption(ChannelOption.SO_KEEPALIVE, true)
    //                 .handler(new LoggingHandler(LogLevel.INFO))
    //                 .childHandler(new ChannelInitializer<SocketChannel>() {
    //                     @Override
    //                     protected void initChannel(SocketChannel ch) {
    //                         ch.pipeline()
    //                                 .addLast("idleStateHandler", new IdleStateHandler(0, 0, 300, TimeUnit.SECONDS))
    //                                 .addLast("coapDecoder", new CoapDecoder())
    //                                 .addLast("coapEncoder", new CoapEncoder())
    //                                 .addLast("coapHandler", coapHandler);
    //                     }
    //                 });

    //         ChannelFuture f = b.bind(host, port).sync();
    //         log.info("CoAP服务器启动成功，监听地址: {}:{}", host, port);
    //         f.channel().closeFuture().sync();
    //     } catch (InterruptedException e) {
    //         log.error("CoAP服务器启动失败: {}", e.getMessage(), e);
    //     } finally {
    //         shutdown();
    //     }
    // }

    /**
     * 关闭CoAP服务器
     */
    // @PreDestroy
    // public void shutdown() {
    //     if (bossGroup != null) {
    //         bossGroup.shutdownGracefully();
    //     }
    //     if (workerGroup != null) {
    //         workerGroup.shutdownGracefully();
    //     }
    //     log.info("CoAP服务器已关闭");
    // }
}
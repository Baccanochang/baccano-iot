package com.baccano.iot.common.core.response;

/**
 * 响应码枚举
 *
 * @author baccano-iot
 */
public enum ResultCode {
    /**
     * 成功
     */
    SUCCESS("200", "操作成功"),

    /**
     * 失败
     */
    FAIL("500", "操作失败"),

    /**
     * 未授权
     */
    UNAUTHORIZED("401", "未授权"),

    /**
     * 拒绝访问
     */
    FORBIDDEN("403", "拒绝访问"),

    /**
     * 资源不存在
     */
    NOT_FOUND("404", "资源不存在"),

    /**
     * 请求方法不支持
     */
    METHOD_NOT_ALLOWED("405", "请求方法不支持"),

    /**
     * 请求参数错误
     */
    PARAM_ERROR("400", "请求参数错误"),

    /**
     * 系统内部错误
     */
    INTERNAL_SERVER_ERROR("500", "系统内部错误"),

    /**
     * 服务不可用
     */
    SERVICE_UNAVAILABLE("503", "服务不可用"),

    /**
     * 数据库错误
     */
    DATABASE_ERROR("501", "数据库错误"),

    /**
     * 缓存错误
     */
    CACHE_ERROR("502", "缓存错误"),

    /**
     * 消息队列错误
     */
    MQ_ERROR("503", "消息队列错误"),

    /**
     * 设备未连接
     */
    DEVICE_OFFLINE("600", "设备未连接"),

    /**
     * 设备认证失败
     */
    DEVICE_AUTH_FAIL("601", "设备认证失败"),

    /**
     * 设备已存在
     */
    DEVICE_EXIST("602", "设备已存在"),

    /**
     * 设备不存在
     */
    DEVICE_NOT_EXIST("603", "设备不存在"),

    /**
     * 产品不存在
     */
    PRODUCT_NOT_EXIST("604", "产品不存在"),

    /**
     * 规则不存在
     */
    RULE_NOT_EXIST("700", "规则不存在"),

    /**
     * 规则执行失败
     */
    RULE_EXECUTE_FAIL("701", "规则执行失败"),

    /**
     * 告警不存在
     */
    ALERT_NOT_EXIST("800", "告警不存在"),

    /**
     * 资产不存在
     */
    ASSET_NOT_EXIST("900", "资产不存在");

    private final String code;
    private final String message;

    ResultCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    /**
     * 获取响应码
     *
     * @return 响应码
     */
    public String getCode() {
        return code;
    }

    /**
     * 获取响应消息
     *
     * @return 响应消息
     */
    public String getMessage() {
        return message;
    }
}
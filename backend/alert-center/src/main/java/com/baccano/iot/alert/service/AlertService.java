package com.baccano.iot.alert.service;

import com.baccano.iot.alert.entity.Alert;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 告警服务
 *
 * @author baccano-iot
 */
public interface AlertService extends IService<Alert> {
    /**
     * 创建告警
     *
     * @param alert 告警对象
     * @return 告警对象
     */
    Alert createAlert(Alert alert);

    /**
     * 处理告警
     *
     * @param alertId 告警ID
     * @param handler 处理人
     * @param handleRemark 处理备注
     * @return 告警对象
     */
    Alert handleAlert(Long alertId, String handler, String handleRemark);

    /**
     * 忽略告警
     *
     * @param alertId 告警ID
     * @param handler 处理人
     * @param handleRemark 处理备注
     * @return 告警对象
     */
    Alert ignoreAlert(Long alertId, String handler, String handleRemark);

    /**
     * 发送告警通知
     *
     * @param alert 告警对象
     */
    void sendAlertNotification(Alert alert);

    /**
     * 发送邮件告警
     *
     * @param alert 告警对象
     * @param email 邮箱地址
     */
    void sendEmailAlert(Alert alert, String email);

    /**
     * 发送短信告警
     *
     * @param alert 告警对象
     * @param phone 手机号码
     */
    void sendSmsAlert(Alert alert, String phone);
}
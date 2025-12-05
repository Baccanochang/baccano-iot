package com.baccano.iot.alert.service.impl;

import com.baccano.iot.alert.entity.Alert;
import com.baccano.iot.alert.service.AlertService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 告警服务实现类
 *
 * @author baccano-iot
 */
@Slf4j
@Service
public class AlertServiceImpl extends ServiceImpl<AlertServiceImpl.AlertMapper, Alert> implements AlertService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${alert.center.template.email.subject}")
    private String emailSubjectTemplate;

    @Value("${alert.center.template.email.content}")
    private String emailContentTemplate;

    /**
     * 创建告警
     *
     * @param alert 告警对象
     * @return 告警对象
     */
    @Override
    public Alert createAlert(Alert alert) {
        // 设置默认值
        alert.setStatus(0); // 未处理
        alert.setAlertTime(LocalDateTime.now());
        
        // 保存告警
        save(alert);
        log.info("创建告警成功: id={}, deviceId={}, content={}", alert.getId(), alert.getDeviceId(), alert.getContent());
        
        // 发送告警通知
        sendAlertNotification(alert);
        
        return alert;
    }

    /**
     * 处理告警
     *
     * @param alertId 告警ID
     * @param handler 处理人
     * @param handleRemark 处理备注
     * @return 告警对象
     */
    @Override
    public Alert handleAlert(Long alertId, String handler, String handleRemark) {
        Alert alert = getById(alertId);
        if (alert == null) {
            throw new RuntimeException("告警不存在");
        }
        
        alert.setStatus(1); // 已处理
        alert.setHandler(handler);
        alert.setHandleTime(LocalDateTime.now());
        alert.setHandleRemark(handleRemark);
        
        updateById(alert);
        log.info("处理告警成功: id={}, handler={}", alertId, handler);
        
        return alert;
    }

    /**
     * 忽略告警
     *
     * @param alertId 告警ID
     * @param handler 处理人
     * @param handleRemark 处理备注
     * @return 告警对象
     */
    @Override
    public Alert ignoreAlert(Long alertId, String handler, String handleRemark) {
        Alert alert = getById(alertId);
        if (alert == null) {
            throw new RuntimeException("告警不存在");
        }
        
        alert.setStatus(2); // 已忽略
        alert.setHandler(handler);
        alert.setHandleTime(LocalDateTime.now());
        alert.setHandleRemark(handleRemark);
        
        updateById(alert);
        log.info("忽略告警成功: id={}, handler={}", alertId, handler);
        
        return alert;
    }

    /**
     * 发送告警通知
     *
     * @param alert 告警对象
     */
    @Override
    public void sendAlertNotification(Alert alert) {
        // 这里简化处理，实际应该根据告警级别和配置发送不同类型的通知
        log.info("发送告警通知: id={}, deviceId={}, content={}", alert.getId(), alert.getDeviceId(), alert.getContent());
        
        // 示例：发送邮件告警
        sendEmailAlert(alert, "admin@baccano-iot.com");
        
        // 示例：发送短信告警（这里简化处理，实际应该调用阿里云短信API）
        sendSmsAlert(alert, "13800138000");
    }

    /**
     * 发送邮件告警
     *
     * @param alert 告警对象
     * @param email 邮箱地址
     */
    @Override
    public void sendEmailAlert(Alert alert, String email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject(emailSubjectTemplate);
            
            // 格式化告警时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String alertTimeStr = alert.getAlertTime().format(formatter);
            
            // 填充邮件内容模板
            String content = String.format(emailContentTemplate, 
                    alert.getAlertType(), alertTimeStr, alert.getDeviceId(), alert.getContent());
            message.setText(content);
            
            mailSender.send(message);
            log.info("发送邮件告警成功: email={}, alertId={}", email, alert.getId());
        } catch (Exception e) {
            log.error("发送邮件告警失败: email={}, alertId={}, error={}", email, alert.getId(), e.getMessage(), e);
        }
    }

    /**
     * 发送短信告警
     *
     * @param alert 告警对象
     * @param phone 手机号码
     */
    @Override
    public void sendSmsAlert(Alert alert, String phone) {
        try {
            // 这里简化处理，实际应该调用阿里云短信API
            log.info("发送短信告警成功: phone={}, alertId={}, content={}", phone, alert.getId(), alert.getContent());
        } catch (Exception e) {
            log.error("发送短信告警失败: phone={}, alertId={}, error={}", phone, alert.getId(), e.getMessage(), e);
        }
    }

    /**
     * 告警Mapper
     */
    public interface AlertMapper extends com.baomidou.mybatisplus.core.mapper.BaseMapper<Alert> {
    }
}
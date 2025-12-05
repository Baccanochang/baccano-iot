package com.baccano.iot.device.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baccano.iot.device.entity.Device;

import java.util.List;

/**
 * 设备服务接口
 *
 * @author baccano-iot
 */
public interface DeviceService extends IService<Device> {
    /**
     * 创建设备
     *
     * @param device 设备信息
     * @return 创建设备结果
     */
    Device createDevice(Device device);

    /**
     * 更新设备
     *
     * @param device 设备信息
     * @return 更新设备结果
     */
    Device updateDevice(Device device);

    /**
     * 删除设备
     *
     * @param deviceId 设备ID
     * @return 删除设备结果
     */
    boolean deleteDevice(String deviceId);

    /**
     * 批量删除设备
     *
     * @param deviceIds 设备ID列表
     * @return 批量删除设备结果
     */
    boolean batchDeleteDevices(List<String> deviceIds);

    /**
     * 获取设备详情
     *
     * @param deviceId 设备ID
     * @return 设备详情
     */
    Device getDeviceById(String deviceId);

    /**
     * 根据设备Key获取设备
     *
     * @param deviceKey 设备Key
     * @return 设备详情
     */
    Device getDeviceByDeviceKey(String deviceKey);

    /**
     * 设备激活
     *
     * @param deviceKey 设备Key
     * @return 设备激活结果
     */
    boolean activateDevice(String deviceKey);

    /**
     * 设备上线
     *
     * @param deviceKey 设备Key
     * @return 设备上线结果
     */
    boolean onlineDevice(String deviceKey);

    /**
     * 设备下线
     *
     * @param deviceKey 设备Key
     * @return 设备下线结果
     */
    boolean offlineDevice(String deviceKey);

    /**
     * 禁用设备
     *
     * @param deviceId 设备ID
     * @return 禁用设备结果
     */
    boolean disableDevice(String deviceId);

    /**
     * 启用设备
     *
     * @param deviceId 设备ID
     * @return 启用设备结果
     */
    boolean enableDevice(String deviceId);
}
package com.baccano.iot.device.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baccano.iot.common.core.exception.BusinessException;
import com.baccano.iot.common.core.response.ResultCode;
import com.baccano.iot.device.entity.Device;
import com.baccano.iot.device.mapper.DeviceMapper;
import com.baccano.iot.device.service.DeviceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备服务实现类
 *
 * @author baccano-iot
 */
@Slf4j
@Service
public class DeviceServiceImpl extends ServiceImpl<DeviceMapper, Device> implements DeviceService {
    /**
     * 设备Mapper
     */
    @Resource
    private DeviceMapper deviceMapper;

    @Override
    public Device createDevice(Device device) {
        // 检查设备是否已存在
        Device existingDevice = deviceMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Device>()
                        .eq("device_key", device.getDeviceKey()));
        if (existingDevice != null) {
            throw new BusinessException(ResultCode.DEVICE_EXIST.getCode(), "设备已存在");
        }

        // 设置默认值
        device.setStatus(0); // 未激活状态
        device.setCreateTime(LocalDateTime.now());
        device.setUpdateTime(LocalDateTime.now());
        device.setDeleted(0);
        device.setVersion(1);

        // 保存设备
        if (deviceMapper.insert(device) > 0) {
            log.info("创建设备成功: deviceId={}, deviceKey={}, deviceName={}", device.getId(), device.getDeviceKey(), device.getName());
            return device;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "创建设备失败");
        }
    }

    @Override
    public Device updateDevice(Device device) {
        // 检查设备是否存在
        Device existingDevice = deviceMapper.selectById(device.getId());
        if (existingDevice == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 更新设备
        device.setUpdateTime(LocalDateTime.now());
        if (deviceMapper.updateById(device) > 0) {
            log.info("更新设备成功: deviceId={}, deviceKey={}, deviceName={}", device.getId(), device.getDeviceKey(), device.getName());
            return device;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "更新设备失败");
        }
    }

    @Override
    public boolean deleteDevice(String deviceId) {
        // 检查设备是否存在
        Device existingDevice = deviceMapper.selectById(deviceId);
        if (existingDevice == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 删除设备
        if (deviceMapper.deleteById(deviceId) > 0) {
            log.info("删除设备成功: deviceId={}, deviceKey={}, deviceName={}", deviceId, existingDevice.getDeviceKey(), existingDevice.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "删除设备失败");
        }
    }

    @Override
    public boolean batchDeleteDevices(List<String> deviceIds) {
        if (deviceIds == null || deviceIds.isEmpty()) {
            return true;
        }

        // 批量删除设备
        if (deviceMapper.deleteBatchIds(deviceIds) > 0) {
            log.info("批量删除设备成功: deviceIds={}", deviceIds);
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "批量删除设备失败");
        }
    }

    @Override
    public Device getDeviceById(String deviceId) {
        return deviceMapper.selectById(deviceId);
    }

    @Override
    public Device getDeviceByDeviceKey(String deviceKey) {
        return deviceMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Device>()
                        .eq("device_key", deviceKey));
    }

    @Override
    public boolean activateDevice(String deviceKey) {
        // 根据设备Key获取设备
        Device device = getDeviceByDeviceKey(deviceKey);
        if (device == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 检查设备是否已激活
        if (device.getStatus() != 0) {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备已激活");
        }

        // 激活设备
        device.setStatus(2); // 激活后默认离线状态
        device.setActivateTime(LocalDateTime.now());
        device.setUpdateTime(LocalDateTime.now());

        if (deviceMapper.updateById(device) > 0) {
            log.info("设备激活成功: deviceId={}, deviceKey={}, deviceName={}", device.getId(), device.getDeviceKey(), device.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备激活失败");
        }
    }

    @Override
    public boolean onlineDevice(String deviceKey) {
        // 根据设备Key获取设备
        Device device = getDeviceByDeviceKey(deviceKey);
        if (device == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 检查设备是否已激活
        if (device.getStatus() == 0) {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备未激活");
        }

        // 设备上线
        device.setStatus(1); // 在线状态
        device.setLastOnlineTime(LocalDateTime.now());
        device.setUpdateTime(LocalDateTime.now());

        if (deviceMapper.updateById(device) > 0) {
            log.info("设备上线成功: deviceId={}, deviceKey={}, deviceName={}", device.getId(), device.getDeviceKey(), device.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备上线失败");
        }
    }

    @Override
    public boolean offlineDevice(String deviceKey) {
        // 根据设备Key获取设备
        Device device = getDeviceByDeviceKey(deviceKey);
        if (device == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 检查设备是否已激活
        if (device.getStatus() == 0) {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备未激活");
        }

        // 设备下线
        device.setStatus(2); // 离线状态
        device.setLastOnlineTime(LocalDateTime.now());
        device.setUpdateTime(LocalDateTime.now());

        if (deviceMapper.updateById(device) > 0) {
            log.info("设备下线成功: deviceId={}, deviceKey={}, deviceName={}", device.getId(), device.getDeviceKey(), device.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "设备下线失败");
        }
    }

    @Override
    public boolean disableDevice(String deviceId) {
        // 检查设备是否存在
        Device device = deviceMapper.selectById(deviceId);
        if (device == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 禁用设备
        device.setStatus(3); // 禁用状态
        device.setUpdateTime(LocalDateTime.now());

        if (deviceMapper.updateById(device) > 0) {
            log.info("禁用设备成功: deviceId={}, deviceKey={}, deviceName={}", deviceId, device.getDeviceKey(), device.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "禁用设备失败");
        }
    }

    @Override
    public boolean enableDevice(String deviceId) {
        // 检查设备是否存在
        Device device = deviceMapper.selectById(deviceId);
        if (device == null) {
            throw new BusinessException(ResultCode.DEVICE_NOT_EXIST.getCode(), "设备不存在");
        }

        // 启用设备
        device.setStatus(2); // 启用后默认离线状态
        device.setUpdateTime(LocalDateTime.now());

        if (deviceMapper.updateById(device) > 0) {
            log.info("启用设备成功: deviceId={}, deviceKey={}, deviceName={}", deviceId, device.getDeviceKey(), device.getName());
            return true;
        } else {
            throw new BusinessException(ResultCode.FAIL.getCode(), "启用设备失败");
        }
    }
}
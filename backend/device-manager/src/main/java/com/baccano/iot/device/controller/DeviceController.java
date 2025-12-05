package com.baccano.iot.device.controller;

import com.baccano.iot.common.core.response.Result;
import com.baccano.iot.device.entity.Device;
import com.baccano.iot.device.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 设备管理Controller
 *
 * @author baccano-iot
 */
@Tag(name = "设备管理", description = "设备管理相关接口")
@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {
    /**
     * 设备服务
     */
    @Autowired
    private DeviceService deviceService;

    /**
     * 创建设备
     *
     * @param device 设备信息
     * @return 创建设备结果
     */
    @Operation(summary = "创建设备", description = "创建设备接口")
    @PostMapping
    public Result<Device> createDevice(@Valid @RequestBody Device device) {
        Device createdDevice = deviceService.createDevice(device);
        return Result.success(createdDevice);
    }

    /**
     * 更新设备
     *
     * @param deviceId 设备ID
     * @param device   设备信息
     * @return 更新设备结果
     */
    @Operation(summary = "更新设备", description = "更新设备接口")
    @PutMapping("/{deviceId}")
    public Result<Device> updateDevice(@Parameter(description = "设备ID") @PathVariable String deviceId, @Valid @RequestBody Device device) {
        device.setId(deviceId);
        Device updatedDevice = deviceService.updateDevice(device);
        return Result.success(updatedDevice);
    }

    /**
     * 删除设备
     *
     * @param deviceId 设备ID
     * @return 删除设备结果
     */
    @Operation(summary = "删除设备", description = "删除设备接口")
    @DeleteMapping("/{deviceId}")
    public Result<Boolean> deleteDevice(@Parameter(description = "设备ID") @PathVariable String deviceId) {
        boolean result = deviceService.deleteDevice(deviceId);
        return Result.success(result);
    }

    /**
     * 批量删除设备
     *
     * @param deviceIds 设备ID列表
     * @return 批量删除设备结果
     */
    @Operation(summary = "批量删除设备", description = "批量删除设备接口")
    @DeleteMapping("/batch")
    public Result<Boolean> batchDeleteDevices(@Parameter(description = "设备ID列表") @RequestBody List<String> deviceIds) {
        boolean result = deviceService.batchDeleteDevices(deviceIds);
        return Result.success(result);
    }

    /**
     * 获取设备详情
     *
     * @param deviceId 设备ID
     * @return 设备详情
     */
    @Operation(summary = "获取设备详情", description = "获取设备详情接口")
    @GetMapping("/{deviceId}")
    public Result<Device> getDeviceById(@Parameter(description = "设备ID") @PathVariable String deviceId) {
        Device device = deviceService.getDeviceById(deviceId);
        return Result.success(device);
    }

    /**
     * 根据设备Key获取设备
     *
     * @param deviceKey 设备Key
     * @return 设备详情
     */
    @Operation(summary = "根据设备Key获取设备", description = "根据设备Key获取设备接口")
    @GetMapping("/key/{deviceKey}")
    public Result<Device> getDeviceByDeviceKey(@Parameter(description = "设备Key") @PathVariable String deviceKey) {
        Device device = deviceService.getDeviceByDeviceKey(deviceKey);
        return Result.success(device);
    }

    /**
     * 设备激活
     *
     * @param deviceKey 设备Key
     * @return 设备激活结果
     */
    @Operation(summary = "设备激活", description = "设备激活接口")
    @PostMapping("/activate/{deviceKey}")
    public Result<Boolean> activateDevice(@Parameter(description = "设备Key") @PathVariable String deviceKey) {
        boolean result = deviceService.activateDevice(deviceKey);
        return Result.success(result);
    }

    /**
     * 设备上线
     *
     * @param deviceKey 设备Key
     * @return 设备上线结果
     */
    @Operation(summary = "设备上线", description = "设备上线接口")
    @PostMapping("/online/{deviceKey}")
    public Result<Boolean> onlineDevice(@Parameter(description = "设备Key") @PathVariable String deviceKey) {
        boolean result = deviceService.onlineDevice(deviceKey);
        return Result.success(result);
    }

    /**
     * 设备下线
     *
     * @param deviceKey 设备Key
     * @return 设备下线结果
     */
    @Operation(summary = "设备下线", description = "设备下线接口")
    @PostMapping("/offline/{deviceKey}")
    public Result<Boolean> offlineDevice(@Parameter(description = "设备Key") @PathVariable String deviceKey) {
        boolean result = deviceService.offlineDevice(deviceKey);
        return Result.success(result);
    }

    /**
     * 禁用设备
     *
     * @param deviceId 设备ID
     * @return 禁用设备结果
     */
    @Operation(summary = "禁用设备", description = "禁用设备接口")
    @PostMapping("/disable/{deviceId}")
    public Result<Boolean> disableDevice(@Parameter(description = "设备ID") @PathVariable String deviceId) {
        boolean result = deviceService.disableDevice(deviceId);
        return Result.success(result);
    }

    /**
     * 启用设备
     *
     * @param deviceId 设备ID
     * @return 启用设备结果
     */
    @Operation(summary = "启用设备", description = "启用设备接口")
    @PostMapping("/enable/{deviceId}")
    public Result<Boolean> enableDevice(@Parameter(description = "设备ID") @PathVariable String deviceId) {
        boolean result = deviceService.enableDevice(deviceId);
        return Result.success(result);
    }
}
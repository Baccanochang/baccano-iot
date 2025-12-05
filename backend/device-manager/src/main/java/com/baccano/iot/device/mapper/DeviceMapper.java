package com.baccano.iot.device.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baccano.iot.device.entity.Device;
import org.apache.ibatis.annotations.Mapper;

/**
 * 设备Mapper接口
 *
 * @author baccano-iot
 */
@Mapper
public interface DeviceMapper extends BaseMapper<Device> {
}
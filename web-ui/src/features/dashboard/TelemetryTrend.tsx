import { Card, Select, DatePicker, Space, Spin, Empty, Button, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Line, Area } from '@ant-design/charts'
import { useState, useEffect } from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Text } = Typography

// Mock API function - in a real app this would call the backend
const fetchTelemetryData = async (deviceId: string, keys: string[], startTs?: number, endTs?: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock data based on the requested keys
  const now = dayjs()
  const data = []
  
  // Generate data points for the last 24 hours by default
  const hours = startTs && endTs ? Math.floor((endTs - startTs) / (1000 * 60 * 60)) : 24
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = startTs ? startTs + (i * 1000 * 60 * 60) : now.subtract(i, 'hour').valueOf()
    const point: any = { ts: timestamp }
    
    // Generate mock data for each key
    keys.forEach(key => {
      if (key === 'temperature') {
        point[key] = 20 + Math.random() * 15 + (i % 5) // Temperature between 20-35
      } else if (key === 'humidity') {
        point[key] = 40 + Math.random() * 30 // Humidity between 40-70
      } else if (key === 'pressure') {
        point[key] = 1000 + Math.random() * 50 // Pressure between 1000-1050
      } else {
        point[key] = Math.random() * 100 // Default random value
      }
    })
    
    data.push(point)
  }
  
  return data
}

// Mock device list
const deviceList = [
  { id: 'demo', name: '演示设备' },
  { id: 'sensor-001', name: '温度传感器 001' },
  { id: 'sensor-002', name: '温度传感器 002' },
  { id: 'controller-001', name: '控制器 001' },
]

// Mock telemetry keys
const telemetryKeys = [
  { key: 'temperature', name: '温度' },
  { key: 'humidity', name: '湿度' },
  { key: 'pressure', name: '压力' },
  { key: 'voltage', name: '电压' },
  { key: 'current', name: '电流' },
]

export default function TelemetryTrend() {
  const [deviceId, setDeviceId] = useState('demo')
  const [selectedKeys, setSelectedKeys] = useState(['temperature', 'humidity'])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Convert date range to timestamps
  const startTs = dateRange ? dateRange[0].valueOf() : undefined
  const endTs = dateRange ? dateRange[1].valueOf() : undefined
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['telemetry', deviceId, selectedKeys, startTs, endTs, refreshKey],
    queryFn: () => fetchTelemetryData(deviceId, selectedKeys, startTs, endTs),
    refetchInterval: 30000, // Refresh every 30 seconds
  })
  
  // Format data for the chart
  const chartData = data ? data.map(item => {
    const formattedItem: any = {
      ts: dayjs(item.ts).format('YYYY-MM-DD HH:mm:ss'),
    }
    
    selectedKeys.forEach(key => {
      formattedItem[key] = item[key]
    })
    
    return formattedItem
  }) : []
  
  // Chart configuration
  const config = {
    data: chartData,
    xField: 'ts',
    yField: selectedKeys,
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      formatter: (datum: any) => {
        let result = `时间: ${datum.ts}`
        selectedKeys.forEach(key => {
          if (datum[key] !== undefined) {
            const keyName = telemetryKeys.find(k => k.key === key)?.name || key
            result += `<br/>${keyName}: ${datum[key].toFixed(2)}`
          }
        })
        return result
      },
    },
    point: {
      size: 3,
      shape: 'circle',
    },
  }
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    refetch()
  }
  
  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space wrap>
        <Text>设备:</Text>
        <Select
          value={deviceId}
          onChange={setDeviceId}
          style={{ width: 180 }}
          options={deviceList.map(device => ({
            label: device.name,
            value: device.id,
          }))}
        />
        
        <Text>指标:</Text>
        <Select
          mode="multiple"
          value={selectedKeys}
          onChange={setSelectedKeys}
          style={{ width: 200 }}
          options={telemetryKeys.map(key => ({
            label: key.name,
            value: key.key,
          }))}
        />
        
        <Text>时间范围:</Text>
        <RangePicker
          showTime
          value={dateRange}
          onChange={setDateRange}
          format="YYYY-MM-DD HH:mm:ss"
        />
        
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          刷新
        </Button>
      </Space>
      
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Empty description="加载遥测数据失败" />
      ) : chartData.length > 0 ? (
        <Line {...config} height={350} />
      ) : (
        <Empty description="暂无遥测数据" />
      )}
    </Space>
  )
}


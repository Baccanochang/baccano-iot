import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Descriptions, 
  Tabs, 
  Table, 
  Alert, 
  Progress, 
  Badge,
  Spin,
  Empty,
  Timeline,
  message,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  Tooltip
} from 'antd'
import { 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SettingOutlined,
  WifiOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  BugOutlined,
  ApiOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

// Mock API functions - in a real app these would call the backend
const fetchDeviceDetails = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock device details
  const deviceTypes = ['温度传感器', '湿度传感器', '压力传感器', '控制器', '网关']
  const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
  const isOnline = Math.random() > 0.3
  
  return {
    id: deviceId,
    name: `设备 ${deviceId.split('-')[1] || 'Demo'}`,
    type: type,
    status: isOnline ? 'online' : 'offline',
    location: ['车间A', '车间B', '仓库1', '仓库2', '办公楼'][Math.floor(Math.random() * 5)],
    productId: `product-${Math.floor(Math.random() * 10) + 1}`,
    productName: `产品 ${Math.floor(Math.random() * 10) + 1}`,
    firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    protocol: ['MQTT', 'HTTP', 'CoAP', 'LoRaWAN', 'Modbus'][Math.floor(Math.random() * 5)],
    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    macAddress: `${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`.toUpperCase(),
    createdAt: dayjs().subtract(Math.floor(Math.random() * 365), 'day'),
    lastActivity: isOnline ? dayjs().subtract(Math.floor(Math.random() * 60), 'minute') : dayjs().subtract(Math.floor(Math.random() * 24), 'hour'),
    batteryLevel: Math.floor(Math.random() * 100),
    signalStrength: Math.floor(Math.random() * 5) + 1,
    cpuUsage: Math.floor(Math.random() * 100),
    memoryUsage: Math.floor(Math.random() * 100),
    description: `这是设备 ${deviceId} 的详细描述信息，包含设备的功能特性和应用场景。`,
    tags: ['关键设备', '24小时运行', '自动监控']
  }
}

const fetchDeviceTelemetry = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock telemetry data
  const data = []
  const now = new Date()
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toISOString(),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      pressure: 1000 + Math.random() * 50,
      battery: 80 + Math.random() * 20,
      signal: Math.floor(Math.random() * 5) + 1
    })
  }
  
  return data
}

const fetchDeviceAttributes = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock attributes
  return [
    { key: 'serialNumber', value: `SN${Math.floor(Math.random() * 100000)}`, dataType: 'string', updatedAt: dayjs().subtract(1, 'hour') },
    { key: 'manufacturer', value: '示例制造商', dataType: 'string', updatedAt: dayjs().subtract(1, 'day') },
    { key: 'model', value: 'MODEL-X1000', dataType: 'string', updatedAt: dayjs().subtract(1, 'day') },
    { key: 'installDate', value: '2022-01-15', dataType: 'date', updatedAt: dayjs().subtract(1, 'month') },
    { key: 'warrantyExpiry', value: '2025-01-15', dataType: 'date', updatedAt: dayjs().subtract(1, 'month') },
    { key: 'calibrationDate', value: '2023-06-10', dataType: 'date', updatedAt: dayjs().subtract(1, 'week') },
    { key: 'maintenanceInterval', value: 90, dataType: 'number', updatedAt: dayjs().subtract(2, 'weeks') },
    { key: 'isCritical', value: true, dataType: 'boolean', updatedAt: dayjs().subtract(1, 'day') }
  ]
}

const fetchDeviceServices = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock services
  return [
    { 
      id: 'restart', 
      name: '重启设备', 
      description: '重启设备以应用新配置或解决临时问题',
      inputParams: [{ name: 'delay', type: 'number', description: '重启延迟时间（秒）', required: false }],
      outputParams: [{ name: 'result', type: 'boolean', description: '重启是否成功' }]
    },
    { 
      id: 'calibrate', 
      name: '校准传感器', 
      description: '校准设备传感器以确保读数准确',
      inputParams: [{ name: 'sensorType', type: 'string', description: '传感器类型', required: true }],
      outputParams: [{ name: 'calibrationData', type: 'object', description: '校准数据' }]
    },
    { 
      id: 'updateFirmware', 
      name: '更新固件', 
      description: '更新设备固件到最新版本',
      inputParams: [{ name: 'firmwareUrl', type: 'string', description: '固件下载地址', required: true }],
      outputParams: [{ name: 'updateResult', type: 'object', description: '更新结果' }]
    }
  ]
}

const fetchDeviceAlerts = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock alerts
  const alerts = []
  const alertTypes = ['离线告警', '电量低', '信号弱', '数据异常', '维护提醒']
  const severities = ['critical', 'warning', 'info']
  
  for (let i = 1; i <= 5; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)]
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    
    alerts.push({
      id: `alert-${i}`,
      type: type,
      severity: severity,
      message: `设备 ${deviceId} 出现${type}`,
      details: `这是关于${type}的详细信息，包含可能的原因和建议的解决方案。`,
      timestamp: dayjs().subtract(Math.floor(Math.random() * 7), 'day'),
      acknowledged: Math.random() > 0.5,
      resolved: Math.random() > 0.7
    })
  }
  
  return alerts
}

const fetchDeviceEvents = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock events
  const events = []
  const eventTypes = ['设备上线', '设备下线', '固件更新', '配置变更', '告警触发', '告警解除']
  
  for (let i = 1; i <= 10; i++) {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    events.push({
      id: `event-${i}`,
      type: type,
      message: `设备 ${deviceId} ${type}`,
      details: `这是关于${type}的详细信息，包含相关的上下文数据。`,
      timestamp: dayjs().subtract(Math.floor(Math.random() * 30), 'day'),
      data: {
        userId: `user-${Math.floor(Math.random() * 10) + 1}`,
        source: 'system',
        metadata: { key: 'value' }
      }
    })
  }
  
  return events
}

const invokeDeviceService = async (deviceId: string, serviceId: string, params: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock service invocation result
  return {
    success: true,
    message: `服务 ${serviceId} 调用成功`,
    result: { status: 'completed', timestamp: new Date().toISOString() }
  }
}

const updateDeviceAttribute = async (deviceId: string, attributeKey: string, value: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock attribute update result
  return {
    success: true,
    message: `属性 ${attributeKey} 更新成功`
  }
}

export default function DeviceDetails() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State for active tab and modals
  const [activeTab, setActiveTab] = useState('overview')
  const [serviceModalVisible, setServiceModalVisible] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [attributeModalVisible, setAttributeModalVisible] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState<any>(null)
  const [serviceForm] = Form.useForm()
  const [attributeForm] = Form.useForm()
  
  // Fetch device details
  const { data: device, isLoading: deviceLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => fetchDeviceDetails(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Fetch device telemetry
  const { data: telemetry = [], isLoading: telemetryLoading } = useQuery({
    queryKey: ['deviceTelemetry', deviceId],
    queryFn: () => fetchDeviceTelemetry(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Fetch device attributes
  const { data: attributes = [], isLoading: attributesLoading } = useQuery({
    queryKey: ['deviceAttributes', deviceId],
    queryFn: () => fetchDeviceAttributes(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Fetch device services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['deviceServices', deviceId],
    queryFn: () => fetchDeviceServices(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Fetch device alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['deviceAlerts', deviceId],
    queryFn: () => fetchDeviceAlerts(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Fetch device events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['deviceEvents', deviceId],
    queryFn: () => fetchDeviceEvents(deviceId || 'demo-device'),
    enabled: !!deviceId
  })
  
  // Service invocation mutation
  const invokeServiceMutation = useMutation({
    mutationFn: (params: { serviceId: string, params: any }) => 
      invokeDeviceService(deviceId || 'demo-device', params.serviceId, params.params),
    onSuccess: () => {
      message.success('服务调用成功')
      setServiceModalVisible(false)
      serviceForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['deviceEvents', deviceId] })
    },
    onError: () => {
      message.error('服务调用失败')
    }
  })
  
  // Attribute update mutation
  const updateAttributeMutation = useMutation({
    mutationFn: (params: { attributeKey: string, value: any }) => 
      updateDeviceAttribute(deviceId || 'demo-device', params.attributeKey, params.value),
    onSuccess: () => {
      message.success('属性更新成功')
      setAttributeModalVisible(false)
      attributeForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ['deviceAttributes', deviceId] })
    },
    onError: () => {
      message.error('属性更新失败')
    }
  })
  
  // Prepare telemetry chart data
  const telemetryChartData = telemetry.map(item => ({
    time: dayjs(item.time).format('HH:mm'),
    temperature: item.temperature,
    humidity: item.humidity,
    pressure: item.pressure,
    battery: item.battery,
    signal: item.signal
  }))
  
  // Prepare battery level chart data
  const batteryChartData = telemetry.map(item => ({
    time: dayjs(item.time).format('HH:mm'),
    value: item.battery
  }))
  
  // Prepare signal strength chart data
  const signalChartData = telemetry.map(item => ({
    time: dayjs(item.time).format('HH:mm'),
    value: item.signal
  }))
  
  // Table columns for attributes
  const attributeColumns = [
    {
      title: '属性名称',
      dataIndex: 'key',
      key: 'key',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (value: any, record: any) => {
        if (record.dataType === 'boolean') {
          return <Tag color={value ? 'green' : 'red'}>{value ? '是' : '否'}</Tag>
        }
        return <Text>{String(value)}</Text>
      }
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => <Tag>{type}</Tag>
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: dayjs.Dayjs) => date.format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: any) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setSelectedAttribute(record)
            attributeForm.setFieldsValue({ value: record.value })
            setAttributeModalVisible(true)
          }}
        >
          编辑
        </Button>
      )
    }
  ]
  
  // Table columns for services
  const serviceColumns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '输入参数',
      key: 'inputParams',
      render: (_, record: any) => (
        <Space direction="vertical" size="small">
          {record.inputParams.map((param: any, index: number) => (
            <Text key={index} code>{param.name}: {param.type} {param.required && '(必填)'}</Text>
          ))}
        </Space>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: any) => (
        <Button 
          type="primary" 
          size="small"
          icon={<PlayCircleOutlined />}
          onClick={() => {
            setSelectedService(record)
            setServiceModalVisible(true)
          }}
        >
          调用
        </Button>
      )
    }
  ]
  
  // Table columns for alerts
  const alertColumns = [
    {
      title: '告警类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => {
        const color = severity === 'critical' ? 'red' : severity === 'warning' ? 'orange' : 'blue'
        return <Tag color={color}>{severity === 'critical' ? '严重' : severity === 'warning' ? '警告' : '信息'}</Tag>
      }
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date: dayjs.Dayjs) => date.format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record: any) => (
        <Space>
          {record.acknowledged && <Tag color="blue">已确认</Tag>}
          {record.resolved && <Tag color="green">已解决</Tag>}
        </Space>
      )
    }
  ]
  
  // Telemetry line chart config
  const telemetryConfig = {
    data: telemetryChartData,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      formatter: (data: any) => {
        return {
          name: data.type,
          value: data.value
        }
      }
    }
  }
  
  // Battery level chart config
  const batteryConfig = {
    data: batteryChartData,
    xField: 'time',
    yField: 'value',
    smooth: true,
    color: '#52c41a',
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (data: any) => {
        return {
          name: '电量',
          value: `${data.value}%`
        }
      }
    }
  }
  
  // Signal strength chart config
  const signalConfig = {
    data: signalChartData,
    xField: 'time',
    yField: 'value',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 3,
      shape: 'circle'
    },
    tooltip: {
      formatter: (data: any) => {
        return {
          name: '信号强度',
          value: data.value
        }
      }
    }
  }
  
  if (deviceLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }
  
  if (!device) {
    return (
      <Empty description="设备不存在" />
    )
  }
  
  const handleInvokeService = (values: any) => {
    if (!selectedService) return
    
    invokeServiceMutation.mutate({
      serviceId: selectedService.id,
      params: values
    })
  }
  
  const handleUpdateAttribute = (values: any) => {
    if (!selectedAttribute) return
    
    updateAttributeMutation.mutate({
      attributeKey: selectedAttribute.key,
      value: values.value
    })
  }
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/devices')}
          >
            返回设备列表
          </Button>
        </Col>
        <Col flex="auto">
          <Title level={2} style={{ margin: 0 }}>
            {device.name}
            <Badge 
              status={device.status === 'online' ? 'success' : 'default'} 
              text={device.status === 'online' ? '在线' : '离线'}
              style={{ marginLeft: 8 }}
            />
          </Title>
          <Text type="secondary">ID: {device.id}</Text>
        </Col>
        <Col>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['device', deviceId] })}
            >
              刷新
            </Button>
            <Button type="primary" icon={<EditOutlined />}>
              编辑设备
            </Button>
          </Space>
        </Col>
      </Row>
      
      {/* Content Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="设备概览" key="overview">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="设备信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="设备ID">{device.id}</Descriptions.Item>
                  <Descriptions.Item label="设备名称">{device.name}</Descriptions.Item>
                  <Descriptions.Item label="设备类型">{device.type}</Descriptions.Item>
                  <Descriptions.Item label="设备状态">
                    <Badge 
                      status={device.status === 'online' ? 'success' : 'default'} 
                      text={device.status === 'online' ? '在线' : '离线'}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="所属产品">{device.productName}</Descriptions.Item>
                  <Descriptions.Item label="设备位置">{device.location}</Descriptions.Item>
                  <Descriptions.Item label="固件版本">{device.firmwareVersion}</Descriptions.Item>
                  <Descriptions.Item label="通信协议">{device.protocol}</Descriptions.Item>
                  <Descriptions.Item label="IP地址">{device.ipAddress}</Descriptions.Item>
                  <Descriptions.Item label="MAC地址">{device.macAddress}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{device.createdAt.format('YYYY-MM-DD')}</Descriptions.Item>
                  <Descriptions.Item label="最后活动">{device.lastActivity.format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                  <Descriptions.Item label="设备描述" span={2}>{device.description}</Descriptions.Item>
                </Descriptions>
              </Card>
              
              <Card title="设备标签">
                <Space wrap>
                  {device.tags.map((tag: string) => (
                    <Tag key={tag} color="blue">{tag}</Tag>
                  ))}
                </Space>
              </Card>
            </Col>
            
            <Col span={8}>
              <Card title="设备状态" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic 
                    title="设备状态" 
                    value={device.status === 'online' ? '在线' : '离线'} 
                    valueStyle={{ color: device.status === 'online' ? '#3f8600' : '#cf1322' }}
                    prefix={device.status === 'online' ? <WifiOutlined /> : <DisconnectOutlined />}
                  />
                  
                  <Divider />
                  
                  <Statistic 
                    title="电量水平" 
                    value={device.batteryLevel} 
                    suffix="%" 
                    valueStyle={{ color: device.batteryLevel > 20 ? '#3f8600' : '#cf1322' }}
                  />
                  <Progress 
                    percent={device.batteryLevel} 
                    status={device.batteryLevel > 20 ? 'normal' : 'exception'}
                    showInfo={false}
                  />
                  
                  <Divider />
                  
                  <Statistic 
                    title="信号强度" 
                    value={device.signalStrength} 
                    suffix="/5" 
                    valueStyle={{ color: device.signalStrength > 2 ? '#3f8600' : '#cf1322' }}
                  />
                  <Progress 
                    percent={(device.signalStrength / 5) * 100} 
                    status={device.signalStrength > 2 ? 'normal' : 'exception'}
                    showInfo={false}
                  />
                  
                  <Divider />
                  
                  <Statistic 
                    title="CPU使用率" 
                    value={device.cpuUsage} 
                    suffix="%" 
                    valueStyle={{ color: device.cpuUsage < 80 ? '#3f8600' : '#cf1322' }}
                  />
                  <Progress 
                    percent={device.cpuUsage} 
                    status={device.cpuUsage < 80 ? 'normal' : 'exception'}
                    showInfo={false}
                  />
                  
                  <Divider />
                  
                  <Statistic 
                    title="内存使用率" 
                    value={device.memoryUsage} 
                    suffix="%" 
                    valueStyle={{ color: device.memoryUsage < 80 ? '#3f8600' : '#cf1322' }}
                  />
                  <Progress 
                    percent={device.memoryUsage} 
                    status={device.memoryUsage < 80 ? 'normal' : 'exception'}
                    showInfo={false}
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="遥测数据" key="telemetry">
          <Row gutter={16}>
            <Col span={24}>
              <Card title="24小时遥测数据" style={{ marginBottom: 16 }}>
                <Line {...telemetryConfig} height={300} />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Card title="电量水平">
                <Line {...batteryConfig} height={200} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="信号强度">
                <Line {...signalConfig} height={200} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="设备属性" key="attributes">
          <Card title="设备属性">
            <Table
              columns={attributeColumns}
              dataSource={attributes}
              rowKey="key"
              loading={attributesLoading}
              pagination={false}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="设备服务" key="services">
          <Card title="设备服务">
            <Table
              columns={serviceColumns}
              dataSource={services}
              rowKey="id"
              loading={servicesLoading}
              pagination={false}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="告警信息" key="alerts">
          <Card title="设备告警">
            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              loading={alertsLoading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="事件历史" key="events">
          <Card title="设备事件">
            <Timeline>
              {events.map((event: any) => (
                <Timeline.Item 
                  key={event.id}
                  color={event.type.includes('告警') ? 'red' : 'blue'}
                >
                  <Text strong>{event.type}</Text>
                  <br />
                  <Text type="secondary">{event.timestamp.format('YYYY-MM-DD HH:mm:ss')}</Text>
                  <br />
                  <Paragraph>{event.message}</Paragraph>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Service Invocation Modal */}
      <Modal
        title={`调用服务: ${selectedService?.name}`}
        open={serviceModalVisible}
        onCancel={() => {
          setServiceModalVisible(false)
          setSelectedService(null)
          serviceForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={serviceForm}
          layout="vertical"
          onFinish={handleInvokeService}
        >
          {selectedService?.inputParams.map((param: any) => (
            <Form.Item
              key={param.name}
              name={param.name}
              label={param.name}
              rules={[{ required: param.required, message: `请输入${param.name}` }]}
              help={param.description}
            >
              {param.type === 'number' ? (
                <Input type="number" placeholder={`请输入${param.name}`} />
              ) : param.type === 'boolean' ? (
                <Select placeholder={`请选择${param.name}`}>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              ) : (
                <TextArea rows={3} placeholder={`请输入${param.name}`} />
              )}
            </Form.Item>
          ))}
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={invokeServiceMutation.isLoading}
              >
                调用
              </Button>
              <Button 
                onClick={() => {
                  setServiceModalVisible(false)
                  setSelectedService(null)
                  serviceForm.resetFields()
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Attribute Update Modal */}
      <Modal
        title={`更新属性: ${selectedAttribute?.key}`}
        open={attributeModalVisible}
        onCancel={() => {
          setAttributeModalVisible(false)
          setSelectedAttribute(null)
          attributeForm.resetFields()
        }}
        footer={null}
      >
        <Form
          form={attributeForm}
          layout="vertical"
          onFinish={handleUpdateAttribute}
        >
          <Form.Item
            name="value"
            label="属性值"
            rules={[{ required: true, message: '请输入属性值' }]}
          >
            {selectedAttribute?.dataType === 'number' ? (
              <Input type="number" placeholder="请输入数值" />
            ) : selectedAttribute?.dataType === 'boolean' ? (
              <Select placeholder="请选择值">
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>
            ) : selectedAttribute?.dataType === 'date' ? (
              <Input placeholder="请输入日期 (YYYY-MM-DD)" />
            ) : (
              <TextArea rows={3} placeholder="请输入文本" />
            )}
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={updateAttributeMutation.isLoading}
              >
                更新
              </Button>
              <Button 
                onClick={() => {
                  setAttributeModalVisible(false)
                  setSelectedAttribute(null)
                  attributeForm.resetFields()
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
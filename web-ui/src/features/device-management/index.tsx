import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Form, 
  message, 
  Popconfirm,
  Tooltip,
  Badge,
  Typography,
  Row,
  Col,
  Statistic,
  Progress
} from 'antd'
import { 
  PlusOutlined, 
  SearchOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  WifiOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

const { Search } = Input
const { RangePicker } = DatePicker
const { Text } = Typography

// Mock API functions - in a real app these would call the backend
const fetchDevices = async (params: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock devices
  const devices = []
  for (let i = 1; i <= 50; i++) {
    const isOnline = Math.random() > 0.3
    devices.push({
      id: `device-${i.toString().padStart(3, '0')}`,
      name: `设备 ${i}`,
      type: ['温度传感器', '湿度传感器', '压力传感器', '控制器', '网关'][Math.floor(Math.random() * 5)],
      status: isOnline ? 'online' : 'offline',
      lastActivity: isOnline ? dayjs().subtract(Math.floor(Math.random() * 60), 'minute') : dayjs().subtract(Math.floor(Math.random() * 24), 'hour'),
      location: ['车间A', '车间B', '仓库1', '仓库2', '办公楼'][Math.floor(Math.random() * 5)],
      firmware: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      createdAt: dayjs().subtract(Math.floor(Math.random() * 365), 'day'),
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 5) + 1,
      alerts: Math.floor(Math.random() * 5)
    })
  }
  
  // Apply filters
  let filteredDevices = devices
  
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredDevices = filteredDevices.filter(device => 
      device.name.toLowerCase().includes(searchLower) || 
      device.id.toLowerCase().includes(searchLower) ||
      device.type.toLowerCase().includes(searchLower)
    )
  }
  
  if (params.status) {
    filteredDevices = filteredDevices.filter(device => device.status === params.status)
  }
  
  if (params.type) {
    filteredDevices = filteredDevices.filter(device => device.type === params.type)
  }
  
  if (params.location) {
    filteredDevices = filteredDevices.filter(device => device.location === params.location)
  }
  
  // Sort by last activity (most recent first)
  filteredDevices.sort((a, b) => b.lastActivity.valueOf() - a.lastActivity.valueOf())
  
  // Apply pagination
  const { page = 1, pageSize = 10 } = params
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  return {
    data: filteredDevices.slice(startIndex, endIndex),
    total: filteredDevices.length,
  }
}

const deleteDevice = async (deviceId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // In a real app, this would make an API call to delete the device
  return { success: true }
}

// Mock device types and locations
const deviceTypes = ['温度传感器', '湿度传感器', '压力传感器', '控制器', '网关']
const locations = ['车间A', '车间B', '仓库1', '仓库2', '办公楼']

export default function DeviceManagement() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State for filters and pagination
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [locationFilter, setLocationFilter] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // State for device creation modal
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  
  // Fetch devices with filters
  const { data: devicesData, isLoading, error } = useQuery({
    queryKey: ['devices', {
      search: searchText,
      status: statusFilter,
      type: typeFilter,
      location: locationFilter,
      dateRange: dateRange,
      page: currentPage,
      pageSize: pageSize,
      refreshKey
    }],
    queryFn: () => fetchDevices({
      search: searchText,
      status: statusFilter,
      type: typeFilter,
      location: locationFilter,
      dateRange: dateRange,
      page: currentPage,
      pageSize: pageSize
    }),
  })
  
  // Delete device mutation
  const deleteDeviceMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      message.success('设备删除成功')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
    onError: () => {
      message.error('设备删除失败')
    }
  })
  
  // Calculate statistics
  const deviceStats = devicesData ? {
    total: devicesData.total,
    online: devicesData.data.filter(d => d.status === 'online').length,
    offline: devicesData.data.filter(d => d.status === 'offline').length,
    alerts: devicesData.data.reduce((sum, d) => sum + d.alerts, 0)
  } : { total: 0, online: 0, offline: 0, alerts: 0 }
  
  // Table columns
  const columns = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text: string) => <Text code>{text}</Text>
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/devices/${record.id}`)}
        >
          {text}
        </Button>
      )
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => <Tag>{text}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'online' ? 'success' : 'default'} 
          text={status === 'online' ? '在线' : '离线'}
        />
      )
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: '最后活动',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (date: dayjs.Dayjs) => (
        <Tooltip title={date.format('YYYY-MM-DD HH:mm:ss')}>
          {date.fromNow()}
        </Tooltip>
      )
    },
    {
      title: '告警数',
      dataIndex: 'alerts',
      key: 'alerts',
      render: (alerts: number) => (
        alerts > 0 ? (
          <Badge count={alerts} style={{ backgroundColor: '#f5222d' }} />
        ) : (
          <Badge count={0} showZero />
        )
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/devices/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个设备吗？"
              onConfirm={() => deleteDeviceMutation.mutate(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                loading={deleteDeviceMutation.isLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }
  
  const handleCreateDevice = (values: any) => {
    // In a real app, this would call an API to create the device
    message.success('设备创建成功')
    setIsCreateModalVisible(false)
    form.resetFields()
    queryClient.invalidateQueries({ queryKey: ['devices'] })
  }
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={deviceStats.total}
              prefix={<WifiOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线设备"
              value={deviceStats.online}
              valueStyle={{ color: '#3f8600' }}
              prefix={<WifiOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线设备"
              value={deviceStats.offline}
              valueStyle={{ color: '#cf1322' }}
              prefix={<DisconnectOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃告警"
              value={deviceStats.alerts}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Search
                placeholder="搜索设备名称、ID或类型"
                allowClear
                style={{ width: 250 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={() => setCurrentPage(1)}
              />
              
              <Select
                placeholder="设备状态"
                allowClear
                style={{ width: 120 }}
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
                options={[
                  { value: 'online', label: '在线' },
                  { value: 'offline', label: '离线' }
                ]}
              />
              
              <Select
                placeholder="设备类型"
                allowClear
                style={{ width: 150 }}
                value={typeFilter}
                onChange={(value) => {
                  setTypeFilter(value)
                  setCurrentPage(1)
                }}
                options={deviceTypes.map(type => ({ value: type, label: type }))}
              />
              
              <Select
                placeholder="位置"
                allowClear
                style={{ width: 120 }}
                value={locationFilter}
                onChange={(value) => {
                  setLocationFilter(value)
                  setCurrentPage(1)
                }}
                options={locations.map(location => ({ value: location, label: location }))}
              />
              
              <RangePicker
                placeholder={['开始时间', '结束时间']}
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates)
                  setCurrentPage(1)
                }}
              />
            </Space>
          </Col>
          
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleRefresh}
                loading={isLoading}
              >
                刷新
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
              >
                添加设备
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* Device Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={devicesData?.data}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: devicesData?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page)
              setPageSize(size)
            }
          }}
        />
      </Card>
      
      {/* Create Device Modal */}
      <Modal
        title="添加设备"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDevice}
        >
          <Form.Item
            name="name"
            label="设备名称"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="设备类型"
            rules={[{ required: true, message: '请选择设备类型' }]}
          >
            <Select placeholder="请选择设备类型">
              {deviceTypes.map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="location"
            label="设备位置"
            rules={[{ required: true, message: '请选择设备位置' }]}
          >
            <Select placeholder="请选择设备位置">
              {locations.map(location => (
                <Select.Option key={location} value={location}>{location}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
              <Button 
                onClick={() => {
                  setIsCreateModalVisible(false)
                  form.resetFields()
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


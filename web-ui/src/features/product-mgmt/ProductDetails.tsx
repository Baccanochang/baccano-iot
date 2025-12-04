import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  Space, 
  Table, 
  Typography, 
  Tabs, 
  Tag, 
  Row, 
  Col, 
  Statistic,
  Descriptions,
  Alert,
  Spin,
  Empty,
  message,
  Divider,
  Badge,
  Timeline
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  CheckOutlined, 
  DiffOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getThingModel, listThingModels, putThingModel, validateThingModel, diffThingModels } from '../../api/products'
import ThingModelEditor from './ThingModelEditor'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Mock API functions - in a real app these would call the backend
const fetchProductDetails = async (productId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock product details
  const protocols = ['MQTT', 'HTTP', 'CoAP', 'LoRaWAN', 'Modbus']
  const protocol = protocols[Math.floor(Math.random() * protocols.length)]
  
  return {
    id: productId,
    name: `产品 ${productId.split('-')[1] || 'Demo'}`,
    description: `这是产品 ${productId} 的详细描述信息，包含产品的功能特性和应用场景。`,
    protocol: protocol,
    deviceCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    category: ['传感器', '控制器', '网关', '执行器'][Math.floor(Math.random() * 4)],
    manufacturer: '示例制造商',
    modelNumber: `MODEL-${Math.floor(Math.random() * 10000)}`,
    firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
    dataFormat: ['JSON', 'XML', 'Binary'][Math.floor(Math.random() * 3)]
  }
}

const fetchDeviceList = async (productId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock device list
  const devices = []
  const deviceCount = Math.floor(Math.random() * 20) + 5
  
  for (let i = 1; i <= deviceCount; i++) {
    const isOnline = Math.random() > 0.3
    devices.push({
      id: `${productId}-device-${i.toString().padStart(3, '0')}`,
      name: `设备 ${i}`,
      status: isOnline ? 'online' : 'offline',
      lastActivity: isOnline ? new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)) : new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
      firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      location: ['车间A', '车间B', '仓库1', '仓库2', '办公楼'][Math.floor(Math.random() * 5)]
    })
  }
  
  return devices
}

export default function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State for active tab and forms
  const [activeTab, setActiveTab] = useState('overview')
  const [diffForm] = Form.useForm()
  
  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId || 'demo-prod'),
    enabled: !!productId
  })
  
  // Fetch device list
  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ['devices', productId],
    queryFn: () => fetchDeviceList(productId || 'demo-prod'),
    enabled: !!productId
  })
  
  // Thing model operations
  const list = useQuery({ 
    queryKey: ['models', productId], 
    queryFn: () => listThingModels(productId || 'demo-prod'), 
    enabled: !!productId 
  })
  
  const put = useMutation({ 
    mutationFn: (v: any) => putThingModel(productId || 'demo-prod', v.version, v.model), 
    onSuccess: () => {
      message.success('物模型更新成功')
      queryClient.invalidateQueries({ queryKey: ['models', productId] })
    },
    onError: () => {
      message.error('物模型更新失败')
    }
  })
  
  const validate = useMutation({ 
    mutationFn: (model: any) => validateThingModel(productId || 'demo-prod', model),
    onSuccess: () => {
      message.success('物模型验证成功')
    },
    onError: () => {
      message.error('物模型验证失败')
    }
  })
  
  const diff = useMutation({ 
    mutationFn: async (v: any) => {
      const modelA = await getThingModel(productId || 'demo-prod', v.a)
      const modelB = await getThingModel(productId || 'demo-prod', v.b)
      return diffThingModels(productId || 'demo-prod', modelA, modelB)
    },
    onSuccess: () => {
      message.success('模型对比完成')
    },
    onError: () => {
      message.error('模型对比失败')
    }
  })
  
  // Calculate device statistics
  const deviceStats = devices ? {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length
  } : { total: 0, online: 0, offline: 0 }
  
  // Table columns for device list
  const deviceColumns = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (text: string) => <Text code>{text}</Text>
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name'
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
      title: '固件版本',
      dataIndex: 'firmwareVersion',
      key: 'firmwareVersion',
      render: (version: string) => <Tag color="blue">{version}</Tag>
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
      render: (date: Date) => new Date(date).toLocaleString()
    }
  ]
  
  // Table columns for thing model versions
  const modelColumns = [
    {
      title: '版本',
      dataIndex: 0,
      key: 'version',
      render: (version: string) => <Tag color="green">{version}</Tag>
    },
    {
      title: '创建时间',
      dataIndex: 1,
      key: 'createdAt',
      render: (model: any) => model.createdAt ? new Date(model.createdAt).toLocaleString() : '-'
    },
    {
      title: '描述',
      dataIndex: 1,
      key: 'description',
      render: (model: any) => model.description || '-'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              // In a real app, this would navigate to the model details
              message.info(`查看物模型版本 ${record[0]}`)
            }}
          >
            查看
          </Button>
        </Space>
      )
    }
  ]
  
  if (productLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }
  
  if (!product) {
    return (
      <Empty description="产品不存在" />
    )
  }
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/products')}
          >
            返回产品列表
          </Button>
        </Col>
        <Col flex="auto">
          <Title level={2} style={{ margin: 0 }}>
            {product.name}
            <Tag color={product.status === 'active' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
              {product.status === 'active' ? '启用' : '禁用'}
            </Tag>
          </Title>
          <Text type="secondary">ID: {product.id}</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<SettingOutlined />}>
            编辑产品
          </Button>
        </Col>
      </Row>
      
      {/* Content Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="产品概览" key="overview">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="产品信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="产品ID">{product.id}</Descriptions.Item>
                  <Descriptions.Item label="产品名称">{product.name}</Descriptions.Item>
                  <Descriptions.Item label="产品类别">{product.category}</Descriptions.Item>
                  <Descriptions.Item label="设备协议">{product.protocol}</Descriptions.Item>
                  <Descriptions.Item label="制造商">{product.manufacturer}</Descriptions.Item>
                  <Descriptions.Item label="型号">{product.modelNumber}</Descriptions.Item>
                  <Descriptions.Item label="固件版本">{product.firmwareVersion}</Descriptions.Item>
                  <Descriptions.Item label="数据格式">{product.dataFormat}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{product.createdAt.toLocaleDateString()}</Descriptions.Item>
                  <Descriptions.Item label="更新时间">{product.updatedAt.toLocaleDateString()}</Descriptions.Item>
                  <Descriptions.Item label="产品描述" span={2}>{product.description}</Descriptions.Item>
                </Descriptions>
              </Card>
              
              <Card title="设备列表">
                <Table
                  columns={deviceColumns}
                  dataSource={devices}
                  rowKey="id"
                  loading={devicesLoading}
                  pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                  }}
                />
              </Card>
            </Col>
            
            <Col span={8}>
              <Card title="设备统计" style={{ marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic title="设备总数" value={deviceStats.total} />
                  <Statistic 
                    title="在线设备" 
                    value={deviceStats.online} 
                    valueStyle={{ color: '#3f8600' }} 
                  />
                  <Statistic 
                    title="离线设备" 
                    value={deviceStats.offline} 
                    valueStyle={{ color: '#cf1322' }} 
                  />
                </Space>
              </Card>
              
              <Card title="快速操作">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    block 
                    icon={<PlusOutlined />}
                    onClick={() => message.info('添加设备功能')}
                  >
                    添加设备
                  </Button>
                  <Button 
                    block 
                    icon={<SettingOutlined />}
                    onClick={() => setActiveTab('thingModel')}
                  >
                    管理物模型
                  </Button>
                  <Button 
                    block 
                    icon={<HistoryOutlined />}
                    onClick={() => setActiveTab('versionHistory')}
                  >
                    版本历史
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="物模型管理" key="thingModel">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="物模型版本" style={{ marginBottom: 16 }}>
                <Table
                  columns={modelColumns}
                  dataSource={list.data ? Object.entries(list.data) : []}
                  rowKey={(r) => r[0]}
                  pagination={false}
                  size="small"
                />
              </Card>
              
              <Card title="新增或更新模型">
                <ThingModelEditor onSubmit={(v) => put.mutate(v)} />
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="验证模型" style={{ marginBottom: 16 }}>
                <ThingModelEditor onSubmit={(v) => validate.mutate(v.model)} />
                {validate.data && (
                  <Alert
                    message="验证结果"
                    description={
                      <pre style={{ maxHeight: 200, overflow: 'auto' }}>
                        {JSON.stringify(validate.data, null, 2)}
                      </pre>
                    }
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </Card>
              
              <Card title="模型对比">
                <Form form={diffForm} onFinish={(v) => diff.mutate(v)} layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="a" label="版本A" rules={[{ required: true, message: '请选择版本A' }]}>
                        <Input placeholder="v1" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="b" label="版本B" rules={[{ required: true, message: '请选择版本B' }]}>
                        <Input placeholder="v2" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<DiffOutlined />}
                      loading={diff.isLoading}
                    >
                      对比
                    </Button>
                  </Form.Item>
                </Form>
                {diff.data && (
                  <Alert
                    message="对比结果"
                    description={
                      <pre style={{ maxHeight: 200, overflow: 'auto' }}>
                        {JSON.stringify(diff.data, null, 2)}
                      </pre>
                    }
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="版本历史" key="versionHistory">
          <Card title="版本更新历史">
            <Timeline>
              <Timeline.Item color="green">
                <Text strong>v2.1.0</Text> - 当前版本
                <br />
                <Text type="secondary">2023-05-15 10:30:00</Text>
                <br />
                <Paragraph>新增温度传感器支持，优化数据传输效率</Paragraph>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Text strong>v2.0.0</Text>
                <br />
                <Text type="secondary">2023-03-20 14:15:00</Text>
                <br />
                <Paragraph>重构物模型结构，增加事件定义</Paragraph>
              </Timeline.Item>
              <Timeline.Item>
                <Text strong>v1.5.0</Text>
                <br />
                <Text type="secondary">2023-01-10 09:45:00</Text>
                <br />
                <Paragraph>修复设备连接问题，增加错误处理机制</Paragraph>
              </Timeline.Item>
              <Timeline.Item>
                <Text strong>v1.0.0</Text>
                <br />
                <Text type="secondary">2022-10-05 16:20:00</Text>
                <br />
                <Paragraph>初始版本发布，包含基本功能</Paragraph>
              </Timeline.Item>
            </Timeline>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}


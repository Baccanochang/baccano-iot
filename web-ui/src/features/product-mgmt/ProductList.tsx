import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  Space, 
  Table, 
  message, 
  Modal, 
  Select, 
  Tag, 
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Badge
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SettingOutlined,
  AppstoreOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, listThingModels } from '../../api/products'

const { Title, Text } = Typography
const { Search } = Input

// Mock API functions - in a real app these would call the backend
const fetchProducts = async (params?: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Generate mock products
  const products = []
  for (let i = 1; i <= 20; i++) {
    const protocols = ['MQTT', 'HTTP', 'CoAP', 'LoRaWAN', 'Modbus']
    const protocol = protocols[Math.floor(Math.random() * protocols.length)]
    const deviceCount = Math.floor(Math.random() * 100)
    
    products.push({
      id: `product-${i.toString().padStart(3, '0')}`,
      name: `产品 ${i}`,
      description: `这是产品 ${i} 的描述信息`,
      protocol: protocol,
      deviceCount: deviceCount,
      thingModelVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      status: Math.random() > 0.2 ? 'active' : 'inactive'
    })
  }
  
  // Apply search filter if provided
  if (params?.search) {
    const searchLower = params.search.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.id.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }
  
  return products
}

const deleteProduct = async (productId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  // In a real app, this would make an API call to delete the product
  return { success: true }
}

const protocolOptions = [
  { value: 'MQTT', label: 'MQTT' },
  { value: 'HTTP', label: 'HTTP' },
  { value: 'CoAP', label: 'CoAP' },
  { value: 'LoRaWAN', label: 'LoRaWAN' },
  { value: 'Modbus', label: 'Modbus' }
]

export default function ProductList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // State for search and modals
  const [searchText, setSearchText] = useState('')
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  
  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', { search: searchText }],
    queryFn: () => fetchProducts({ search: searchText })
  })
  
  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      message.success('产品创建成功')
      setIsCreateModalVisible(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      message.error('产品创建失败')
    }
  })
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      message.success('产品删除成功')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      message.error('产品删除失败')
    }
  })
  
  // Calculate statistics
  const productStats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    totalDevices: products.reduce((sum, p) => sum + p.deviceCount, 0)
  }
  
  // Table columns
  const columns = [
    {
      title: '产品ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text: string) => <Text code>{text}</Text>
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/products/${record.id}`)}
        >
          {text}
        </Button>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      )
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="blue">{protocol}</Tag>
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      render: (count: number) => <Badge count={count} showZero />
    },
    {
      title: '物模型版本',
      dataIndex: 'thingModelVersion',
      key: 'thingModelVersion',
      render: (version: string) => <Tag color="green">{version}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status === 'active' ? '启用' : '禁用'}
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/products/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="物模型编辑">
            <Button 
              type="text" 
              icon={<SettingOutlined />} 
              onClick={() => navigate(`/products/model-editor?productId=${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个产品吗？"
              onConfirm={() => deleteProductMutation.mutate(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                loading={deleteProductMutation.isLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]
  
  const handleCreateProduct = (values: any) => {
    createProductMutation.mutate(values)
  }
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="产品总数"
              value={productStats.total}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="启用产品"
              value={productStats.active}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="禁用产品"
              value={productStats.inactive}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={productStats.totalDevices}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Search and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索产品名称、ID或描述"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              创建产品
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* Product Table */}
      <Card title="产品列表">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>
      
      {/* Create Product Modal */}
      <Modal
        title="创建产品"
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
          onFinish={handleCreateProduct}
        >
          <Form.Item
            name="id"
            label="产品ID"
            rules={[{ required: true, message: '请输入产品ID' }]}
          >
            <Input placeholder="请输入产品ID" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="产品描述"
          >
            <Input.TextArea rows={3} placeholder="请输入产品描述" />
          </Form.Item>
          
          <Form.Item
            name="protocol"
            label="设备协议"
            rules={[{ required: true, message: '请选择设备协议' }]}
          >
            <Select placeholder="请选择设备协议">
              {protocolOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createProductMutation.isLoading}>
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


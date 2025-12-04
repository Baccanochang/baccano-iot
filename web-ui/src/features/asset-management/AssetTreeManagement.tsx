import React, { useState, useEffect, useRef } from 'react'
import { 
  Card, 
  Tree, 
  Button, 
  Input, 
  Space, 
  Modal, 
  Form, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Tooltip,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Divider,
  Badge,
  Avatar,
  Tabs,
  Table,
  Empty,
  Upload,
  Switch
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  FolderOutlined,
  FileOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  EyeOutlined,
  SettingOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  CloudOutlined,
  MobileOutlined,
  ApiOutlined,
  NodeIndexOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import type { DataNode, EventDataNode } from 'antd/es/tree'
import type { MenuProps } from 'antd'

const { Search } = Input
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select

interface AssetNode {
  key: string
  title: string
  type: 'organization' | 'site' | 'area' | 'device' | 'gateway' | 'sensor' | 'actuator'
  icon: React.ReactNode
  isLeaf?: boolean
  children?: AssetNode[]
  status?: 'online' | 'offline' | 'error' | 'maintenance'
  description?: string
  properties?: Record<string, any>
  parentId?: string
  level: number
}

interface AssetDetail {
  key: string
  title: string
  type: string
  status: string
  description: string
  properties: Record<string, any>
  children: AssetNode[]
  createdAt: string
  updatedAt: string
}

const AssetTreeManagement: React.FC = () => {
  const [assetTree, setAssetTree] = useState<AssetNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentNode, setCurrentNode] = useState<Partial<AssetNode> | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<AssetDetail | null>(null)
  const [form] = Form.useForm()
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [activeTab, setActiveTab] = useState('tree')
  const [viewMode, setViewMode] = useState<'tree' | 'card'>('tree')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 模拟资产数据
  useEffect(() => {
    const mockAssetTree: AssetNode[] = [
      {
        key: 'org-1',
        title: '总部',
        type: 'organization',
        icon: <ApartmentOutlined />,
        level: 0,
        status: 'online',
        description: '公司总部',
        children: [
          {
            key: 'site-1',
            title: '北京工厂',
            type: 'site',
            icon: <ClusterOutlined />,
            level: 1,
            status: 'online',
            description: '北京生产基地',
            parentId: 'org-1',
            children: [
              {
                key: 'area-1',
                title: '生产车间A',
                type: 'area',
                icon: <DatabaseOutlined />,
                level: 2,
                status: 'online',
                description: '主要生产区域',
                parentId: 'site-1',
                children: [
                  {
                    key: 'device-1',
                    title: '温度传感器-01',
                    type: 'sensor',
                    icon: <MobileOutlined />,
                    level: 3,
                    isLeaf: true,
                    status: 'online',
                    description: '监测车间温度',
                    parentId: 'area-1',
                    properties: {
                      model: 'TS-100',
                      version: '1.2.3',
                      lastUpdate: '2023-11-10T08:30:00Z',
                      value: 23.5,
                      unit: '°C'
                    }
                  },
                  {
                    key: 'device-2',
                    title: '湿度传感器-01',
                    type: 'sensor',
                    icon: <MobileOutlined />,
                    level: 3,
                    isLeaf: true,
                    status: 'online',
                    description: '监测车间湿度',
                    parentId: 'area-1',
                    properties: {
                      model: 'HS-200',
                      version: '2.1.0',
                      lastUpdate: '2023-11-10T08:31:00Z',
                      value: 65,
                      unit: '%'
                    }
                  },
                  {
                    key: 'device-3',
                    title: '控制器-01',
                    type: 'actuator',
                    icon: <ApiOutlined />,
                    level: 3,
                    isLeaf: true,
                    status: 'online',
                    description: '控制生产设备',
                    parentId: 'area-1',
                    properties: {
                      model: 'CTRL-500',
                      version: '3.0.1',
                      lastUpdate: '2023-11-10T08:32:00Z',
                      state: 'running'
                    }
                  }
                ]
              },
              {
                key: 'area-2',
                title: '仓库',
                type: 'area',
                icon: <DatabaseOutlined />,
                level: 2,
                status: 'online',
                description: '原料和成品仓库',
                parentId: 'site-1',
                children: [
                  {
                    key: 'gateway-1',
                    title: '网关-01',
                    type: 'gateway',
                    icon: <CloudOutlined />,
                    level: 3,
                    status: 'online',
                    description: '连接仓库设备',
                    parentId: 'area-2',
                    properties: {
                      model: 'GW-1000',
                      version: '1.5.2',
                      lastUpdate: '2023-11-10T08:33:00Z',
                      connectedDevices: 12
                    }
                  }
                ]
              }
            ]
          },
          {
            key: 'site-2',
            title: '上海工厂',
            type: 'site',
            icon: <ClusterOutlined />,
            level: 1,
            status: 'online',
            description: '上海生产基地',
            parentId: 'org-1',
            children: [
              {
                key: 'area-3',
                title: '研发中心',
                type: 'area',
                icon: <DatabaseOutlined />,
                level: 2,
                status: 'online',
                description: '产品研发和测试',
                parentId: 'site-2',
                children: [
                  {
                    key: 'device-4',
                    title: '测试设备-01',
                    type: 'device',
                    icon: <NodeIndexOutlined />,
                    level: 3,
                    isLeaf: true,
                    status: 'maintenance',
                    description: '产品测试设备',
                    parentId: 'area-3',
                    properties: {
                      model: 'TEST-300',
                      version: '2.0.5',
                      lastUpdate: '2023-11-09T14:20:00Z',
                      state: 'maintenance'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]

    setAssetTree(mockAssetTree)
    setExpandedKeys(['org-1', 'site-1', 'site-2'])
  }, [])

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onSelect = (selectedKeysValue: React.Key[], info: EventDataNode<AssetNode>) => {
    setSelectedKeys(selectedKeysValue)
    if (selectedKeysValue.length > 0 && info.node) {
      const node = info.node as AssetNode
      const assetDetail: AssetDetail = {
        key: node.key,
        title: node.title,
        type: node.type,
        status: node.status || 'unknown',
        description: node.description || '',
        properties: node.properties || {},
        children: node.children || [],
        createdAt: '2023-01-15T10:30:00Z',
        updatedAt: '2023-11-10T08:30:00Z'
      }
      setSelectedAsset(assetDetail)
    } else {
      setSelectedAsset(null)
    }
  }

  const handleAddNode = (parentKey?: string) => {
    setCurrentNode({ parentId: parentKey })
    setModalVisible(true)
  }

  const handleEditNode = (node: AssetNode) => {
    setCurrentNode(node)
    form.setFieldsValue({
      title: node.title,
      type: node.type,
      description: node.description,
      status: node.status
    })
    setModalVisible(true)
  }

  const handleDeleteNode = (key: string) => {
    const deleteNode = (nodes: AssetNode[]): AssetNode[] => {
      return nodes.filter(node => {
        if (node.key === key) {
          return false
        }
        if (node.children) {
          node.children = deleteNode(node.children)
        }
        return true
      })
    }

    setAssetTree(deleteNode(assetTree))
    message.success('资产节点已删除')
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentNode?.key) {
        // 编辑模式：更新现有节点
        const updateNode = (nodes: AssetNode[]): AssetNode[] => {
          return nodes.map(node => {
            if (node.key === currentNode.key) {
              return {
                ...node,
                title: values.title,
                type: values.type,
                description: values.description,
                status: values.status,
                icon: getNodeIcon(values.type),
                isLeaf: isLeafType(values.type)
              }
            }
            if (node.children) {
              node.children = updateNode(node.children)
            }
            return node
          })
        }
        setAssetTree(updateNode(assetTree))
        setModalVisible(false)
        form.resetFields()
        setCurrentNode(null)
        message.success('资产节点已更新')
      } else {
        // 添加模式：创建新节点
        const newNode: AssetNode = {
          key: `node-${Date.now()}`,
          title: values.title,
          type: values.type,
          description: values.description,
          status: values.status,
          icon: getNodeIcon(values.type),
          level: getNodeLevel(currentNode?.parentId),
          isLeaf: isLeafType(values.type),
          children: []
        }

        if (currentNode?.parentId) {
          const addNodeToParent = (nodes: AssetNode[]): AssetNode[] => {
            return nodes.map(node => {
              if (node.key === currentNode.parentId) {
                return {
                  ...node,
                  children: [...(node.children || []), newNode]
                }
              }
              if (node.children) {
                node.children = addNodeToParent(node.children)
              }
              return node
            })
          }
          setAssetTree(addNodeToParent(assetTree))
        } else {
          setAssetTree([...assetTree, newNode])
        }

        setModalVisible(false)
        form.resetFields()
        setCurrentNode(null)
        message.success('资产节点已添加')
      }
    })
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
    setCurrentNode(null)
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'organization':
        return <ApartmentOutlined />
      case 'site':
        return <ClusterOutlined />
      case 'area':
        return <DatabaseOutlined />
      case 'gateway':
        return <CloudOutlined />
      case 'sensor':
        return <MobileOutlined />
      case 'actuator':
        return <ApiOutlined />
      case 'device':
        return <NodeIndexOutlined />
      default:
        return <FileOutlined />
    }
  }

  const getNodeLevel = (parentId?: string): number => {
    if (!parentId) return 0
    
    const findNodeLevel = (nodes: AssetNode[], targetId: string, level: number = 0): number => {
      for (const node of nodes) {
        if (node.key === targetId) {
          return level + 1
        }
        if (node.children) {
          const found = findNodeLevel(node.children, targetId, level + 1)
          if (found !== -1) return found
        }
      }
      return -1
    }
    
    return findNodeLevel(assetTree, parentId)
  }

  const isLeafType = (type: string): boolean => {
    return ['device', 'sensor', 'actuator'].includes(type)
  }

  const getTypeText = (type: string): string => {
    switch (type) {
      case 'organization':
        return '组织'
      case 'site':
        return '站点'
      case 'area':
        return '区域'
      case 'gateway':
        return '网关'
      case 'device':
        return '设备'
      case 'sensor':
        return '传感器'
      case 'actuator':
        return '执行器'
      default:
        return type
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'success'
      case 'offline':
        return 'default'
      case 'error':
        return 'error'
      case 'maintenance':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'online':
        return '在线'
      case 'offline':
        return '离线'
      case 'error':
        return '错误'
      case 'maintenance':
        return '维护中'
      default:
        return '未知'
    }
  }

  // 辅助函数：统计特定类型的节点数量
  const countNodesByType = (nodes: AssetNode[], type: string): number => {
    let count = 0
    nodes.forEach(node => {
      if (node.type === type) {
        count++
      }
      if (node.children) {
        count += countNodesByType(node.children, type)
      }
    })
    return count
  }

  const getContextMenuItems = (node: AssetNode): MenuProps['items'] => [
    {
      key: 'add',
      label: '添加子节点',
      icon: <PlusOutlined />,
      disabled: isLeafType(node.type),
      onClick: () => handleAddNode(node.key)
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditNode(node)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除 "${node.title}" 及其所有子节点吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDeleteNode(node.key)
        })
      }
    }
  ]

  const exportAssetTree = () => {
    const dataStr = JSON.stringify(assetTree, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'asset-tree.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    message.success('资产树已导出')
  }

  const importAssetTree = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedTree = JSON.parse(content)
        setAssetTree(importedTree)
        message.success('资产树已导入')
      } catch (error) {
        message.error('导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
    return false
  }

  const refreshTree = () => {
    message.loading('正在刷新资产树...', 0.5)
    setTimeout(() => {
      message.success('资产树已刷新')
    }, 500)
  }

  const convertToDataNode = (nodes: AssetNode[]): DataNode[] => {
    return nodes.map(node => {
      const dataNode: DataNode = {
        title: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {node.icon}
              <span style={{ marginLeft: 8 }}>{node.title}</span>
              {node.status && (
                <Badge 
                  status={getStatusColor(node.status) as any} 
                  style={{ marginLeft: 8 }} 
                />
              )}
            </div>
            <div>
              <Dropdown
                menu={{ items: getContextMenuItems(node) }}
                trigger={['click']}
              >
                <Button type="text" size="small" icon={<MoreOutlined />} />
              </Dropdown>
            </div>
          </div>
        ),
        key: node.key,
        children: node.children ? convertToDataNode(node.children) : undefined
      }
      return dataNode
    })
  }

  const renderCardView = (nodes: AssetNode[], level: number = 0) => {
    return nodes.map(node => (
      <div key={node.key} style={{ marginLeft: level * 24, marginBottom: 16 }}>
        <Card
          size="small"
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {node.icon}
              <span style={{ marginLeft: 8 }}>{node.title}</span>
              {node.status && (
                <Badge 
                  status={getStatusColor(node.status) as any} 
                  style={{ marginLeft: 8 }} 
                />
              )}
              <Tag color="blue" style={{ marginLeft: 8 }}>
                {getTypeText(node.type)}
              </Tag>
            </div>
          }
          extra={
            <Dropdown
              menu={{ items: getContextMenuItems(node) }}
              trigger={['click']}
            >
              <Button type="text" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          }
          style={{ width: '100%' }}
        >
          {node.description && (
            <Paragraph style={{ marginBottom: 8 }}>{node.description}</Paragraph>
          )}
          
          {node.properties && Object.keys(node.properties).length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <Text strong>属性：</Text>
              <div style={{ marginTop: 4 }}>
                {Object.entries(node.properties).map(([key, value]) => (
                  <Tag key={key} style={{ margin: '2px 4px 2px 0' }}>
                    {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Tag>
                ))}
              </div>
            </div>
          )}
          
          {!isLeafType(node.type) && node.children && node.children.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <Text strong>子节点：</Text>
              <div style={{ marginTop: 8 }}>
                {renderCardView(node.children, level + 1)}
              </div>
            </div>
          )}
        </Card>
      </div>
    ))
  }

  const detailColumns = [
    {
      title: '属性',
      dataIndex: 'key',
      key: 'key',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value'
    }
  ]

  const detailData = selectedAsset ? Object.entries(selectedAsset.properties).map(([key, value]) => ({
    key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
  })) : []

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="资产树管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refreshTree}>
              刷新
            </Button>
            <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
              导入
            </Button>
            <Button icon={<DownloadOutlined />} onClick={exportAssetTree}>
              导出
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleAddNode()}
            >
              添加根节点
            </Button>
          </Space>
        }
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) importAssetTree(file)
          }}
        />
        
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="搜索资产"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Text>视图模式：</Text>
              <Switch
                checkedChildren="卡片"
                unCheckedChildren="树形"
                checked={viewMode === 'card'}
                onChange={(checked) => setViewMode(checked ? 'card' : 'tree')}
              />
            </Space>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="资产树" key="tree">
            <Row gutter={[16, 16]}>
              <Col span={viewMode === 'tree' ? 12 : 24}>
                <Card title="资产结构" size="small">
                  {viewMode === 'tree' ? (
                    <Tree
                      showLine
                      treeData={convertToDataNode(assetTree)}
                      onExpand={onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                      onSelect={onSelect}
                      selectedKeys={selectedKeys}
                    />
                  ) : (
                    <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                      {assetTree.length === 0 ? (
                        <Empty description="暂无资产数据" />
                      ) : (
                        renderCardView(assetTree)
                      )}
                    </div>
                  )}
                </Card>
              </Col>
              
              {viewMode === 'tree' && (
                <Col span={12}>
                  <Card 
                    title="资产详情" 
                    size="small"
                    extra={
                      selectedAsset && (
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => setDetailModalVisible(true)}
                        >
                          查看详情
                        </Button>
                      )
                    }
                  >
                    {selectedAsset ? (
                      <div>
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Text strong>名称：</Text>
                            <Text>{selectedAsset.title}</Text>
                          </Col>
                          <Col span={12}>
                            <Text strong>类型：</Text>
                            <Tag color="blue">{getTypeText(selectedAsset.type)}</Tag>
                          </Col>
                          <Col span={12}>
                            <Text strong>状态：</Text>
                            <Badge 
                              status={getStatusColor(selectedAsset.status) as any} 
                              text={getStatusText(selectedAsset.status)} 
                            />
                          </Col>
                          <Col span={12}>
                            <Text strong>子节点数：</Text>
                            <Text>{selectedAsset.children.length}</Text>
                          </Col>
                          <Col span={24}>
                            <Text strong>描述：</Text>
                            <Paragraph>{selectedAsset.description || '暂无描述'}</Paragraph>
                          </Col>
                        </Row>
                        
                        {Object.keys(selectedAsset.properties).length > 0 && (
                          <div style={{ marginTop: 16 }}>
                            <Text strong>属性：</Text>
                            <Table
                              dataSource={detailData}
                              columns={detailColumns}
                              pagination={false}
                              size="small"
                              style={{ marginTop: 8 }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <Empty description="请选择一个资产查看详情" />
                    )}
                  </Card>
                </Col>
              )}
            </Row>
          </TabPane>
          
          <TabPane tab="统计信息" key="stats">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={64} icon={<ApartmentOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <Title level={4}>组织数</Title>
                    <Title level={2}>{assetTree.length}</Title>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={64} icon={<ClusterOutlined />} style={{ backgroundColor: '#52c41a' }} />
                    <Title level={4}>站点数</Title>
                    <Title level={2}>
                      {assetTree.reduce((count, org) => 
                        count + (org.children?.filter(child => child.type === 'site').length || 0), 0
                      )}
                    </Title>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={64} icon={<MobileOutlined />} style={{ backgroundColor: '#faad14' }} />
                    <Title level={4}>设备数</Title>
                    <Title level={2}>
                      {countNodesByType(assetTree, 'device') + countNodesByType(assetTree, 'sensor') + countNodesByType(assetTree, 'actuator')}
                    </Title>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={64} icon={<DatabaseOutlined />} style={{ backgroundColor: '#722ed1' }} />
                    <Title level={4}>区域数</Title>
                    <Title level={2}>{countNodesByType(assetTree, 'area')}</Title>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={currentNode?.key ? '编辑资产节点' : '添加资产节点'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="节点类型"
            rules={[{ required: true, message: '请选择节点类型' }]}
          >
            <Select placeholder="请选择节点类型">
              <Option value="organization">组织</Option>
              <Option value="site">站点</Option>
              <Option value="area">区域</Option>
              <Option value="gateway">网关</Option>
              <Option value="device">设备</Option>
              <Option value="sensor">传感器</Option>
              <Option value="actuator">执行器</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
          >
            <Select placeholder="请选择状态">
              <Option value="online">在线</Option>
              <Option value="offline">离线</Option>
              <Option value="error">错误</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="资产详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {selectedAsset && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>名称：</Text>
                <Text>{selectedAsset.title}</Text>
              </Col>
              <Col span={12}>
                <Text strong>类型：</Text>
                <Tag color="blue">{getTypeText(selectedAsset.type)}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>状态：</Text>
                <Badge 
                  status={getStatusColor(selectedAsset.status) as any} 
                  text={getStatusText(selectedAsset.status)} 
                />
              </Col>
              <Col span={12}>
                <Text strong>创建时间：</Text>
                <Text>{selectedAsset.createdAt}</Text>
              </Col>
              <Col span={12}>
                <Text strong>更新时间：</Text>
                <Text>{selectedAsset.updatedAt}</Text>
              </Col>
              <Col span={12}>
                <Text strong>子节点数：</Text>
                <Text>{selectedAsset.children.length}</Text>
              </Col>
              <Col span={24}>
                <Text strong>描述：</Text>
                <Paragraph>{selectedAsset.description || '暂无描述'}</Paragraph>
              </Col>
            </Row>
            
            {Object.keys(selectedAsset.properties).length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>属性详情</Title>
                <Table
                  dataSource={detailData}
                  columns={detailColumns}
                  pagination={false}
                  size="small"
                />
              </div>
            )}
            
            {selectedAsset.children.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>子节点列表</Title>
                <Table
                  dataSource={selectedAsset.children.map(child => ({
                    key: child.key,
                    name: child.title,
                    type: getTypeText(child.type),
                    status: (
                      <Badge 
                        status={getStatusColor(child.status) as any} 
                        text={getStatusText(child.status)} 
                      />
                    )
                  }))}
                  columns={[
                    {
                      title: '名称',
                      dataIndex: 'name',
                      key: 'name'
                    },
                    {
                      title: '类型',
                      dataIndex: 'type',
                      key: 'type'
                    },
                    {
                      title: '状态',
                      dataIndex: 'status',
                      key: 'status'
                    }
                  ]}
                  pagination={false}
                  size="small"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AssetTreeManagement
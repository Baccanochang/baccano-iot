import React, { useState, useCallback, useRef, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Space, 
  Form, 
  Input, 
  Select, 
  Row, 
  Col, 
  Typography, 
  Table, 
  Tag, 
  Modal, 
  message,
  Tabs,
  Switch,
  Divider,
  Tooltip,
  Popconfirm,
  Badge,
  Drawer,
  Alert,
  List,
  Avatar,
  Dropdown,
  Menu
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined,
  CopyOutlined,
  SaveOutlined,
  SettingOutlined,
  ApiOutlined,
  NodeIndexOutlined,
  ShareAltOutlined,
  FilterOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select
const { TextArea } = Input

// 规则节点类型
interface RuleNode {
  id: string
  name: string
  type: 'filter' | 'transform' | 'action' | 'enrichment' | 'external'
  configuration: Record<string, any>
  position: { x: number; y: number }
  description?: string
}

// 规则链
interface RuleChain {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  nodes: RuleNode[]
  connections: Connection[]
  createdAt: string
  updatedAt: string
  debugMode: boolean
}

// 连接线
interface Connection {
  id: string
  sourceId: string
  targetId: string
  sourceHandle?: string
  targetHandle?: string
}

// 规则链模板
interface RuleChainTemplate {
  id: string
  name: string
  description: string
  category: string
  nodes: RuleNode[]
  connections: Connection[]
}

const RuleEngine: React.FC = () => {
  const [ruleChains, setRuleChains] = useState<RuleChain[]>([])
  const [selectedRuleChain, setSelectedRuleChain] = useState<RuleChain | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editorVisible, setEditorVisible] = useState(false)
  const [templateModalVisible, setTemplateModalVisible] = useState(false)
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [currentRuleChain, setCurrentRuleChain] = useState<Partial<RuleChain>>({})
  const [form] = Form.useForm()
  const [testForm] = Form.useForm()
  const [activeTab, setActiveTab] = useState('list')
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<RuleNode | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<RuleNode | null>(null)
  const [nodeConfigVisible, setNodeConfigVisible] = useState(false)
  const [nodeForm] = Form.useForm()
  const [testResult, setTestResult] = useState<any>(null)
  const [templates, setTemplates] = useState<RuleChainTemplate[]>([])

  // 模拟规则链数据
  useEffect(() => {
    const mockRuleChains: RuleChain[] = [
      {
        id: 'rc-1',
        name: '温度监控规则链',
        description: '监控设备温度，超过阈值时发送告警',
        status: 'active',
        debugMode: false,
        nodes: [
          {
            id: 'node-1',
            name: '消息过滤器',
            type: 'filter',
            position: { x: 100, y: 100 },
            description: '过滤温度数据',
            configuration: {
              condition: 'temperature > 30'
            }
          },
          {
            id: 'node-2',
            name: '数据转换',
            type: 'transform',
            position: { x: 300, y: 100 },
            description: '转换数据格式',
            configuration: {
              script: 'return { ...msg, alertLevel: msg.temperature > 40 ? "high" : "medium" }'
            }
          },
          {
            id: 'node-3',
            name: '告警发送',
            type: 'action',
            position: { x: 500, y: 100 },
            description: '发送告警通知',
            configuration: {
              type: 'email',
              recipients: ['admin@example.com'],
              template: 'temperature_alert'
            }
          }
        ],
        connections: [
          { id: 'conn-1', sourceId: 'node-1', targetId: 'node-2' },
          { id: 'conn-2', sourceId: 'node-2', targetId: 'node-3' }
        ],
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-11-10T08:30:00Z'
      },
      {
        id: 'rc-2',
        name: '设备状态监控',
        description: '监控设备在线状态，离线时记录日志',
        status: 'inactive',
        debugMode: true,
        nodes: [
          {
            id: 'node-4',
            name: '状态过滤器',
            type: 'filter',
            position: { x: 100, y: 200 },
            description: '过滤设备状态',
            configuration: {
              condition: 'status === "offline"'
            }
          },
          {
            id: 'node-5',
            name: '日志记录',
            type: 'action',
            position: { x: 300, y: 200 },
            description: '记录设备离线日志',
            configuration: {
              type: 'log',
              level: 'warning'
            }
          }
        ],
        connections: [
          { id: 'conn-3', sourceId: 'node-4', targetId: 'node-5' }
        ],
        createdAt: '2023-10-20T14:20:00Z',
        updatedAt: '2023-11-08T16:45:00Z'
      }
    ]

    const mockTemplates: RuleChainTemplate[] = [
      {
        id: 'tpl-1',
        name: '温度告警模板',
        description: '监控温度并发送告警',
        category: '环境监控',
        nodes: [
          {
            id: 'tpl-node-1',
            name: '温度过滤器',
            type: 'filter',
            position: { x: 100, y: 100 },
            description: '过滤温度数据',
            configuration: {
              condition: 'temperature > 30'
            }
          },
          {
            id: 'tpl-node-2',
            name: '告警发送',
            type: 'action',
            position: { x: 300, y: 100 },
            description: '发送告警通知',
            configuration: {
              type: 'email',
              recipients: ['admin@example.com']
            }
          }
        ],
        connections: [
          { id: 'tpl-conn-1', sourceId: 'tpl-node-1', targetId: 'tpl-node-2' }
        ]
      },
      {
        id: 'tpl-2',
        name: '设备状态模板',
        description: '监控设备状态变化',
        category: '设备管理',
        nodes: [
          {
            id: 'tpl-node-3',
            name: '状态过滤器',
            type: 'filter',
            position: { x: 100, y: 100 },
            description: '过滤设备状态',
            configuration: {
              condition: 'status !== "online"'
            }
          },
          {
            id: 'tpl-node-4',
            name: '状态记录',
            type: 'action',
            position: { x: 300, y: 100 },
            description: '记录状态变化',
            configuration: {
              type: 'database',
              table: 'device_status_log'
            }
          }
        ],
        connections: [
          { id: 'tpl-conn-2', sourceId: 'tpl-node-3', targetId: 'tpl-node-4' }
        ]
      }
    ]

    setRuleChains(mockRuleChains)
    setTemplates(mockTemplates)
  }, [])

  const handleCreateRuleChain = () => {
    setCurrentRuleChain({
      name: '',
      description: '',
      status: 'draft',
      nodes: [],
      connections: [],
      debugMode: false
    })
    setModalVisible(true)
  }

  const handleEditRuleChain = (ruleChain: RuleChain) => {
    setCurrentRuleChain(ruleChain)
    form.setFieldsValue({
      name: ruleChain.name,
      description: ruleChain.description,
      status: ruleChain.status,
      debugMode: ruleChain.debugMode
    })
    setModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentRuleChain.id) {
        // 编辑现有规则链
        const updatedRuleChains = ruleChains.map(rc => 
          rc.id === currentRuleChain.id 
            ? { 
                ...rc, 
                ...values, 
                updatedAt: new Date().toISOString() 
              }
            : rc
        )
        setRuleChains(updatedRuleChains)
        message.success('规则链已更新')
      } else {
        // 创建新规则链
        const newRuleChain: RuleChain = {
          id: `rc-${Date.now()}`,
          ...values,
          nodes: [],
          connections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setRuleChains([...ruleChains, newRuleChain])
        message.success('规则链已创建')
      }
      setModalVisible(false)
      form.resetFields()
      setCurrentRuleChain({})
    })
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
    setCurrentRuleChain({})
  }

  const handleDeleteRuleChain = (id: string) => {
    const updatedRuleChains = ruleChains.filter(rc => rc.id !== id)
    setRuleChains(updatedRuleChains)
    message.success('规则链已删除')
  }

  const handleToggleStatus = (id: string) => {
    const updatedRuleChains = ruleChains.map(rc => {
      if (rc.id === id) {
        const newStatus = rc.status === 'active' ? 'inactive' : 'active'
        return { ...rc, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return rc
    })
    setRuleChains(updatedRuleChains)
    message.success(`规则链已${updatedRuleChains.find(rc => rc.id === id)?.status === 'active' ? '启用' : '停用'}`)
  }

  const handleOpenEditor = (ruleChain: RuleChain) => {
    setSelectedRuleChain(ruleChain)
    setEditorVisible(true)
  }

  const handleSaveRuleChain = () => {
    if (!selectedRuleChain) return
    
    const updatedRuleChains = ruleChains.map(rc => 
      rc.id === selectedRuleChain.id 
        ? { ...selectedRuleChain, updatedAt: new Date().toISOString() }
        : rc
    )
    setRuleChains(updatedRuleChains)
    message.success('规则链已保存')
  }

  const handleAddNode = (type: RuleNode['type']) => {
    if (!selectedRuleChain) return
    
    const newNode: RuleNode = {
      id: `node-${Date.now()}`,
      name: `新${getNodeTypeName(type)}`,
      type,
      position: { x: 200, y: 200 },
      configuration: getDefaultNodeConfig(type)
    }
    
    const updatedRuleChain = {
      ...selectedRuleChain,
      nodes: [...selectedRuleChain.nodes, newNode]
    }
    
    setSelectedRuleChain(updatedRuleChain)
  }

  const handleNodeDragStart = (e: React.MouseEvent, node: RuleNode) => {
    setIsDragging(true)
    setDraggedNode(node)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (!isDragging || !draggedNode || !selectedRuleChain) return
    
    const deltaX = e.clientX - mousePosition.x
    const deltaY = e.clientY - mousePosition.y
    
    const updatedNodes = selectedRuleChain.nodes.map(node => {
      if (node.id === draggedNode.id) {
        return {
          ...node,
          position: {
            x: node.position.x + deltaX,
            y: node.position.y + deltaY
          }
        }
      }
      return node
    })
    
    setSelectedRuleChain({
      ...selectedRuleChain,
      nodes: updatedNodes
    })
    
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleNodeDragEnd = () => {
    setIsDragging(false)
    setDraggedNode(null)
  }

  const handleNodeClick = (node: RuleNode) => {
    setSelectedNode(node)
    nodeForm.setFieldsValue({
      name: node.name,
      description: node.description,
      configuration: JSON.stringify(node.configuration, null, 2)
    })
    setNodeConfigVisible(true)
  }

  const handleNodeConfigOk = () => {
    if (!selectedNode || !selectedRuleChain) return
    
    nodeForm.validateFields().then(values => {
      let configuration
      try {
        configuration = JSON.parse(values.configuration)
      } catch (error) {
        message.error('配置格式不正确，请检查JSON格式')
        return
      }
      
      const updatedNodes = selectedRuleChain.nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            name: values.name,
            description: values.description,
            configuration
          }
        }
        return node
      })
      
      setSelectedRuleChain({
        ...selectedRuleChain,
        nodes: updatedNodes
      })
      
      setNodeConfigVisible(false)
      nodeForm.resetFields()
      setSelectedNode(null)
      message.success('节点配置已更新')
    })
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedRuleChain) return
    
    const updatedNodes = selectedRuleChain.nodes.filter(node => node.id !== nodeId)
    const updatedConnections = selectedRuleChain.connections.filter(
      conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
    )
    
    setSelectedRuleChain({
      ...selectedRuleChain,
      nodes: updatedNodes,
      connections: updatedConnections
    })
    
    message.success('节点已删除')
  }

  const handleTestRuleChain = () => {
    if (!selectedRuleChain) return
    
    setTestModalVisible(true)
  }

  const handleRunTest = () => {
    testForm.validateFields().then(values => {
      // 模拟测试结果
      const mockTestResult = {
        success: true,
        executionTime: 125,
        processedNodes: 3,
        output: {
          alertLevel: 'high',
          message: '温度超过阈值，已发送告警'
        },
        logs: [
          { node: '消息过滤器', status: 'success', message: '条件满足，继续执行' },
          { node: '数据转换', status: 'success', message: '数据转换完成' },
          { node: '告警发送', status: 'success', message: '告警已发送' }
        ]
      }
      
      setTestResult(mockTestResult)
      message.success('测试完成')
    })
  }

  const handleUseTemplate = (template: RuleChainTemplate) => {
    const newRuleChain: RuleChain = {
      id: `rc-${Date.now()}`,
      name: `${template.name} - 副本`,
      description: template.description,
      status: 'draft',
      nodes: [...template.nodes],
      connections: [...template.connections],
      debugMode: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setRuleChains([...ruleChains, newRuleChain])
    setTemplateModalVisible(false)
    message.success('模板已应用')
  }

  const getNodeTypeName = (type: RuleNode['type']) => {
    switch (type) {
      case 'filter':
        return '过滤器'
      case 'transform':
        return '转换器'
      case 'action':
        return '执行器'
      case 'enrichment':
        return '增强器'
      case 'external':
        return '外部调用'
      default:
        return '未知'
    }
  }

  const getNodeIcon = (type: RuleNode['type']) => {
    switch (type) {
      case 'filter':
        return <FilterOutlined />
      case 'transform':
        return <NodeIndexOutlined />
      case 'action':
        return <ApiOutlined />
      case 'enrichment':
        return <DatabaseOutlined />
      case 'external':
        return <CloudOutlined />
      default:
        return <NodeIndexOutlined />
    }
  }

  const getNodeColor = (type: RuleNode['type']) => {
    switch (type) {
      case 'filter':
        return '#1890ff'
      case 'transform':
        return '#52c41a'
      case 'action':
        return '#faad14'
      case 'enrichment':
        return '#722ed1'
      case 'external':
        return '#13c2c2'
      default:
        return '#d9d9d9'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'draft':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃'
      case 'inactive':
        return '非活跃'
      case 'draft':
        return '草稿'
      default:
        return '未知'
    }
  }

  const getDefaultNodeConfig = (type: RuleNode['type']) => {
    switch (type) {
      case 'filter':
        return { condition: '' }
      case 'transform':
        return { script: 'return msg;' }
      case 'action':
        return { type: 'log' }
      case 'enrichment':
        return { type: 'device' }
      case 'external':
        return { url: '', method: 'GET' }
      default:
        return {}
    }
  }

  const getMenuItems = (record: RuleChain): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditRuleChain(record)
    },
    {
      key: 'editor',
      label: '规则编辑器',
      icon: <SettingOutlined />,
      onClick: () => handleOpenEditor(record)
    },
    {
      key: 'copy',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => {
        const newRuleChain = {
          ...record,
          id: `rc-${Date.now()}`,
          name: `${record.name} - 副本`,
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setRuleChains([...ruleChains, newRuleChain])
        message.success('规则链已复制')
      }
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除规则链 "${record.name}" 吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDeleteRuleChain(record.id)
        })
      }
    }
  ]

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RuleChain) => (
        <Button type="link" onClick={() => handleOpenEditor(record)}>
          {text}
        </Button>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={getStatusColor(status) as any} text={getStatusText(status)} />
      )
    },
    {
      title: '节点数',
      key: 'nodeCount',
      render: (record: RuleChain) => record.nodes.length
    },
    {
      title: '调试模式',
      dataIndex: 'debugMode',
      key: 'debugMode',
      render: (debugMode: boolean) => (
        <Tag color={debugMode ? 'green' : 'default'}>
          {debugMode ? '开启' : '关闭'}
        </Tag>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RuleChain) => (
        <Space>
          <Button
            type="text"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record.id)}
          />
          <Dropdown
            menu={{ items: getMenuItems(record) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="规则引擎管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => message.loading('正在刷新...', 0.5)}>
              刷新
            </Button>
            <Button icon={<ImportOutlined />} onClick={() => setTemplateModalVisible(true)}>
              使用模板
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRuleChain}>
              创建规则链
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="规则链列表" key="list">
            <Table
              columns={columns}
              dataSource={ruleChains}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="模板库" key="templates">
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={templates}
              renderItem={template => (
                <List.Item>
                  <Card
                    title={template.name}
                    extra={
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => handleUseTemplate(template)}
                      >
                        使用模板
                      </Button>
                    }
                  >
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {template.description}
                    </Paragraph>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{template.category}</Tag>
                      <Tag>{template.nodes.length} 个节点</Tag>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      {template.nodes.slice(0, 3).map((node, index) => (
                        <Tooltip key={index} title={node.name}>
                          <Avatar 
                            size="small" 
                            icon={getNodeIcon(node.type)} 
                            style={{ backgroundColor: getNodeColor(node.type) }}
                          />
                        </Tooltip>
                      ))}
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={currentRuleChain.id ? '编辑规则链' : '创建规则链'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="规则链名称"
            rules={[{ required: true, message: '请输入规则链名称' }]}
          >
            <Input placeholder="请输入规则链名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="active">活跃</Option>
              <Option value="inactive">非活跃</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="debugMode"
            label="调试模式"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`规则编辑器 - ${selectedRuleChain?.name}`}
        placement="right"
        onClose={() => setEditorVisible(false)}
        open={editorVisible}
        width="90%"
        extra={
          <Space>
            <Button icon={<PlusOutlined />} onClick={() => {}}>
              添加节点
            </Button>
            <Button icon={<PlayCircleOutlined />} onClick={handleTestRuleChain}>
              测试
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveRuleChain}>
              保存
            </Button>
          </Space>
        }
      >
        {selectedRuleChain && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>规则链状态：</Text>
                <Badge status={getStatusColor(selectedRuleChain.status) as any} text={getStatusText(selectedRuleChain.status)} />
                <Text strong>调试模式：</Text>
                <Tag color={selectedRuleChain.debugMode ? 'green' : 'default'}>
                  {selectedRuleChain.debugMode ? '开启' : '关闭'}
                </Tag>
              </Space>
            </div>
            
            <div style={{ display: 'flex', height: 'calc(100% - 50px)' }}>
              <div style={{ width: 200, marginRight: 16, borderRight: '1px solid #f0f0f0', paddingRight: 16 }}>
                <Title level={5}>节点类型</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    block 
                    icon={<FilterOutlined />}
                    onClick={() => handleAddNode('filter')}
                  >
                    过滤器
                  </Button>
                  <Button 
                    block 
                    icon={<NodeIndexOutlined />}
                    onClick={() => handleAddNode('transform')}
                  >
                    转换器
                  </Button>
                  <Button 
                    block 
                    icon={<ApiOutlined />}
                    onClick={() => handleAddNode('action')}
                  >
                    执行器
                  </Button>
                  <Button 
                    block 
                    icon={<DatabaseOutlined />}
                    onClick={() => handleAddNode('enrichment')}
                  >
                    增强器
                  </Button>
                  <Button 
                    block 
                    icon={<CloudOutlined />}
                    onClick={() => handleAddNode('external')}
                  >
                    外部调用
                  </Button>
                </Space>
              </div>
              
              <div 
                ref={canvasRef}
                style={{ 
                  flex: 1, 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 4, 
                  position: 'relative',
                  overflow: 'auto',
                  backgroundColor: '#fafafa'
                }}
                onMouseMove={handleNodeDrag}
                onMouseUp={handleNodeDragEnd}
                onMouseLeave={handleNodeDragEnd}
              >
                <div style={{ width: 1000, height: 800, position: 'relative' }}>
                  {selectedRuleChain.nodes.map(node => (
                    <div
                      key={node.id}
                      style={{
                        position: 'absolute',
                        left: node.position.x,
                        top: node.position.y,
                        width: 180,
                        cursor: 'move'
                      }}
                      onMouseDown={(e) => handleNodeDragStart(e, node)}
                      onClick={() => handleNodeClick(node)}
                    >
                      <Card
                        size="small"
                        title={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              size="small" 
                              icon={getNodeIcon(node.type)} 
                              style={{ backgroundColor: getNodeColor(node.type), marginRight: 8 }}
                            />
                            <Text ellipsis style={{ flex: 1 }}>{node.name}</Text>
                          </div>
                        }
                        extra={
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNode(node.id)
                            }}
                          />
                        }
                        style={{ 
                          border: `2px solid ${getNodeColor(node.type)}`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {node.description && (
                            <div style={{ marginBottom: 4 }}>{node.description}</div>
                          )}
                          <Tag size="small">{getNodeTypeName(node.type)}</Tag>
                        </div>
                      </Card>
                    </div>
                  ))}
                  
                  {/* 连接线 */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  >
                    {selectedRuleChain.connections.map(conn => {
                      const sourceNode = selectedRuleChain.nodes.find(n => n.id === conn.sourceId)
                      const targetNode = selectedRuleChain.nodes.find(n => n.id === conn.targetId)
                      
                      if (!sourceNode || !targetNode) return null
                      
                      const x1 = sourceNode.position.x + 90
                      const y1 = sourceNode.position.y + 40
                      const x2 = targetNode.position.x + 90
                      const y2 = targetNode.position.y + 40
                      
                      return (
                        <g key={conn.id}>
                          <path
                            d={`M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}`}
                            stroke="#1890ff"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle cx={x2} cy={y2} r="4" fill="#1890ff" />
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title="节点配置"
        open={nodeConfigVisible}
        onOk={handleNodeConfigOk}
        onCancel={() => {
          setNodeConfigVisible(false)
          nodeForm.resetFields()
          setSelectedNode(null)
        }}
        width={600}
      >
        <Form form={nodeForm} layout="vertical">
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input placeholder="请输入描述" />
          </Form.Item>
          
          <Form.Item
            name="configuration"
            label="配置 (JSON格式)"
            rules={[{ required: true, message: '请输入配置' }]}
          >
            <TextArea rows={10} placeholder="请输入JSON格式的配置" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="测试规则链"
        open={testModalVisible}
        onOk={handleRunTest}
        onCancel={() => {
          setTestModalVisible(false)
          setTestResult(null)
          testForm.resetFields()
        }}
        width={800}
      >
        <Form form={testForm} layout="vertical">
          <Form.Item
            name="inputData"
            label="输入数据 (JSON格式)"
            initialValue={JSON.stringify({
              deviceId: 'device-001',
              temperature: 35,
              humidity: 60,
              timestamp: new Date().toISOString()
            }, null, 2)}
            rules={[{ required: true, message: '请输入测试数据' }]}
          >
            <TextArea rows={8} placeholder="请输入JSON格式的测试数据" />
          </Form.Item>
        </Form>
        
        {testResult && (
          <div style={{ marginTop: 16 }}>
            <Alert
              message="测试结果"
              description={
                <div>
                  <p><strong>执行状态：</strong> {testResult.success ? '成功' : '失败'}</p>
                  <p><strong>执行时间：</strong> {testResult.executionTime}ms</p>
                  <p><strong>处理节点数：</strong> {testResult.processedNodes}</p>
                  <p><strong>输出：</strong></p>
                  <pre>{JSON.stringify(testResult.output, null, 2)}</pre>
                  <p><strong>执行日志：</strong></p>
                  <List
                    size="small"
                    dataSource={testResult.logs}
                    renderItem={log => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            log.status === 'success' ? 
                              <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                              <CloseCircleOutlined style={{ color: '#f5222d' }} />
                          }
                          title={log.node}
                          description={log.message}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              }
              type={testResult.success ? 'success' : 'error'}
              showIcon
            />
          </div>
        )}
      </Modal>

      <Modal
        title="规则链模板"
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={null}
        width={800}
      >
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={templates}
          renderItem={template => (
            <List.Item>
              <Card
                title={template.name}
                extra={
                  <Button 
                    type="primary" 
                    onClick={() => handleUseTemplate(template)}
                  >
                    使用模板
                  </Button>
                }
              >
                <Paragraph ellipsis={{ rows: 2 }}>
                  {template.description}
                </Paragraph>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="blue">{template.category}</Tag>
                  <Tag>{template.nodes.length} 个节点</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {template.nodes.slice(0, 3).map((node, index) => (
                    <Tooltip key={index} title={node.name}>
                      <Avatar 
                        size="small" 
                        icon={getNodeIcon(node.type)} 
                        style={{ backgroundColor: getNodeColor(node.type) }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  )
}

export default RuleEngine


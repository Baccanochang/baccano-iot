import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  Tag, 
  Select, 
  Space, 
  Button, 
  Input, 
  DatePicker, 
  Row, 
  Col, 
  Typography, 
  Tabs, 
  Modal, 
  Form, 
  Switch, 
  InputNumber, 
  Divider, 
  Alert, 
  List, 
  Avatar, 
  Badge, 
  Tooltip, 
  Popconfirm, 
  message,
  Dropdown,
  Menu,
  Drawer,
  Statistic,
  Progress,
  Empty,
  Pagination
} from 'antd'
import { 
  BellOutlined, 
  ExclamationCircleOutlined, 
  WarningOutlined, 
  InfoCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  SettingOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  MoreOutlined,
  SoundOutlined,
  MailOutlined,
  MessageOutlined,
  NotificationOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FireOutlined,
  AlertOutlined,
  SecurityScanOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ExportOutlined,
  ImportOutlined,
  ClearOutlined,
  StopOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select
const { RangePicker } = DatePicker
const { Search, TextArea } = Input

// 告警类型
interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'major' | 'minor' | 'warning' | 'info'
  status: 'active' | 'acknowledged' | 'resolved' | 'suppressed'
  source: string
  deviceId: string
  deviceName: string
  category: string
  timestamp: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedBy?: string
  resolvedAt?: string
  tags?: string[]
  metadata?: Record<string, any>
}

// 告警规则
interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  deviceId?: string
  deviceType?: string
  metric: string
  condition: string
  threshold: number
  severity: 'critical' | 'major' | 'minor' | 'warning' | 'info'
  duration: number // 持续时间（秒）
  consecutiveCount: number // 连续次数
  actions: AlertAction[]
  createdAt: string
  updatedAt: string
}

// 告警动作
interface AlertAction {
  id: string
  type: 'email' | 'sms' | 'webhook' | 'notification'
  enabled: boolean
  config: Record<string, any>
}

// 通知渠道
interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'sms' | 'webhook' | 'slack' | 'dingtalk'
  enabled: boolean
  config: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 通知模板
interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'webhook'
  subject?: string
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

const AlertsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([])
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [alertDetailVisible, setAlertDetailVisible] = useState(false)
  const [ruleModalVisible, setRuleModalVisible] = useState(false)
  const [channelModalVisible, setChannelModalVisible] = useState(false)
  const [templateModalVisible, setTemplateModalVisible] = useState(false)
  const [currentRule, setCurrentRule] = useState<Partial<AlertRule>>({})
  const [currentChannel, setCurrentChannel] = useState<Partial<NotificationChannel>>({})
  const [currentTemplate, setCurrentTemplate] = useState<Partial<NotificationTemplate>>({})
  const [ruleForm] = Form.useForm()
  const [channelForm] = Form.useForm()
  const [templateForm] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [alertStats, setAlertStats] = useState({
    total: 0,
    critical: 0,
    major: 0,
    minor: 0,
    warning: 0,
    info: 0,
    active: 0,
    acknowledged: 0,
    resolved: 0
  })

  // 模拟数据
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: 'alert-1',
        title: '设备温度过高',
        description: '设备设备001温度超过阈值，当前温度42°C',
        severity: 'critical',
        status: 'active',
        source: '温度传感器',
        deviceId: 'device-001',
        deviceName: '温度传感器-001',
        category: '环境监控',
        timestamp: '2023-11-15T10:30:00Z',
        tags: ['温度', '设备001', '环境监控'],
        metadata: {
          temperature: 42,
          threshold: 40,
          location: '机房A'
        }
      },
      {
        id: 'alert-2',
        title: '设备离线',
        description: '设备设备002已离线超过5分钟',
        severity: 'major',
        status: 'acknowledged',
        source: '设备状态监控',
        deviceId: 'device-002',
        deviceName: '湿度传感器-001',
        category: '设备状态',
        timestamp: '2023-11-15T09:45:00Z',
        acknowledgedBy: 'admin',
        acknowledgedAt: '2023-11-15T09:50:00Z',
        tags: ['离线', '设备002', '设备状态'],
        metadata: {
          lastOnlineTime: '2023-11-15T09:40:00Z',
          offlineDuration: 300
        }
      },
      {
        id: 'alert-3',
        title: '内存使用率过高',
        description: '服务器内存使用率达到85%',
        severity: 'warning',
        status: 'resolved',
        source: '系统监控',
        deviceId: 'server-001',
        deviceName: '服务器-001',
        category: '系统资源',
        timestamp: '2023-11-14T16:20:00Z',
        resolvedBy: 'admin',
        resolvedAt: '2023-11-14T17:30:00Z',
        tags: ['内存', '服务器', '系统资源'],
        metadata: {
          memoryUsage: 85,
          threshold: 80,
          serverName: 'web-server-01'
        }
      },
      {
        id: 'alert-4',
        title: '网络延迟异常',
        description: '网络延迟超过100ms',
        severity: 'minor',
        status: 'active',
        source: '网络监控',
        deviceId: 'network-001',
        deviceName: '路由器-001',
        category: '网络',
        timestamp: '2023-11-15T11:15:00Z',
        tags: ['网络', '延迟', '路由器'],
        metadata: {
          latency: 120,
          threshold: 100,
          target: '8.8.8.8'
        }
      },
      {
        id: 'alert-5',
        title: '磁盘空间不足',
        description: '磁盘使用率达到90%',
        severity: 'major',
        status: 'active',
        source: '系统监控',
        deviceId: 'server-002',
        deviceName: '服务器-002',
        category: '系统资源',
        timestamp: '2023-11-15T08:30:00Z',
        tags: ['磁盘', '服务器', '系统资源'],
        metadata: {
          diskUsage: 90,
          threshold: 85,
          mountPoint: '/var/log'
        }
      }
    ]

    const mockAlertRules: AlertRule[] = [
      {
        id: 'rule-1',
        name: '温度过高告警',
        description: '当设备温度超过40°C时触发告警',
        enabled: true,
        metric: 'temperature',
        condition: '>',
        threshold: 40,
        severity: 'critical',
        duration: 60,
        consecutiveCount: 1,
        actions: [
          {
            id: 'action-1',
            type: 'email',
            enabled: true,
            config: {
              recipients: ['admin@example.com'],
              templateId: 'template-1'
            }
          },
          {
            id: 'action-2',
            type: 'notification',
            enabled: true,
            config: {
              title: '温度告警',
              message: '设备温度超过阈值'
            }
          }
        ],
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-11-10T08:30:00Z'
      },
      {
        id: 'rule-2',
        name: '设备离线告警',
        description: '当设备离线超过5分钟时触发告警',
        enabled: true,
        metric: 'status',
        condition: '==',
        threshold: 0,
        severity: 'major',
        duration: 300,
        consecutiveCount: 1,
        actions: [
          {
            id: 'action-3',
            type: 'sms',
            enabled: true,
            config: {
              phoneNumbers: ['13800138000'],
              templateId: 'template-2'
            }
          }
        ],
        createdAt: '2023-10-20T14:20:00Z',
        updatedAt: '2023-11-08T16:45:00Z'
      }
    ]

    const mockNotificationChannels: NotificationChannel[] = [
      {
        id: 'channel-1',
        name: '邮件通知',
        type: 'email',
        enabled: true,
        config: {
          smtpServer: 'smtp.example.com',
          port: 587,
          username: 'alerts@example.com',
          password: '******',
          from: 'alerts@example.com'
        },
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-11-10T08:30:00Z'
      },
      {
        id: 'channel-2',
        name: '短信通知',
        type: 'sms',
        enabled: true,
        config: {
          provider: 'aliyun',
          accessKey: '******',
          secretKey: '******',
          signName: 'IoT平台',
          templateCode: 'SMS_123456789'
        },
        createdAt: '2023-10-20T14:20:00Z',
        updatedAt: '2023-11-08T16:45:00Z'
      },
      {
        id: 'channel-3',
        name: 'Webhook通知',
        type: 'webhook',
        enabled: false,
        config: {
          url: 'https://example.com/webhook/alerts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123'
          }
        },
        createdAt: '2023-10-25T09:15:00Z',
        updatedAt: '2023-11-05T12:30:00Z'
      }
    ]

    const mockNotificationTemplates: NotificationTemplate[] = [
      {
        id: 'template-1',
        name: '温度告警邮件模板',
        type: 'email',
        subject: 'IoT设备温度告警',
        content: '设备{{deviceName}}温度超过阈值，当前温度{{temperature}}°C，阈值{{threshold}}°C，请及时处理。',
        variables: ['deviceName', 'temperature', 'threshold'],
        createdAt: '2023-10-15T10:30:00Z',
        updatedAt: '2023-11-10T08:30:00Z'
      },
      {
        id: 'template-2',
        name: '设备离线短信模板',
        type: 'sms',
        content: '设备{{deviceName}}已离线，离线时间{{offlineTime}}，请及时检查。',
        variables: ['deviceName', 'offlineTime'],
        createdAt: '2023-10-20T14:20:00Z',
        updatedAt: '2023-11-08T16:45:00Z'
      }
    ]

    setAlerts(mockAlerts)
    setAlertRules(mockAlertRules)
    setNotificationChannels(mockNotificationChannels)
    setNotificationTemplates(mockNotificationTemplates)
  }, [])

  // 计算告警统计
  useEffect(() => {
    const stats = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      major: alerts.filter(a => a.severity === 'major').length,
      minor: alerts.filter(a => a.severity === 'minor').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      info: alerts.filter(a => a.severity === 'info').length,
      active: alerts.filter(a => a.status === 'active').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length
    }
    setAlertStats(stats)
  }, [alerts])

  // 过滤告警
  useEffect(() => {
    let filtered = [...alerts]

    if (searchText) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.deviceName.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (severityFilter.length > 0) {
      filtered = filtered.filter(alert => severityFilter.includes(alert.severity))
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(alert => statusFilter.includes(alert.status))
    }

    if (dateRange) {
      const [start, end] = dateRange
      filtered = filtered.filter(alert => {
        const alertTime = dayjs(alert.timestamp)
        return alertTime.isAfter(start) && alertTime.isBefore(end)
      })
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchText, severityFilter, statusFilter, dateRange])

  const handleAlertAction = (alertId: string, action: string) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        switch (action) {
          case 'acknowledge':
            return {
              ...alert,
              status: 'acknowledged',
              acknowledgedBy: 'current-user',
              acknowledgedAt: new Date().toISOString()
            }
          case 'resolve':
            return {
              ...alert,
              status: 'resolved',
              resolvedBy: 'current-user',
              resolvedAt: new Date().toISOString()
            }
          case 'suppress':
            return {
              ...alert,
              status: 'suppressed'
            }
          default:
            return alert
        }
      }
      return alert
    })

    setAlerts(updatedAlerts)
    message.success(`告警已${action === 'acknowledge' ? '确认' : action === 'resolve' ? '解决' : '抑制'}`)
  }

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert)
    setAlertDetailVisible(true)
  }

  const handleCreateRule = () => {
    setCurrentRule({
      name: '',
      description: '',
      enabled: true,
      metric: '',
      condition: '>',
      threshold: 0,
      severity: 'warning',
      duration: 60,
      consecutiveCount: 1,
      actions: []
    })
    ruleForm.resetFields()
    setRuleModalVisible(true)
  }

  const handleEditRule = (rule: AlertRule) => {
    setCurrentRule(rule)
    ruleForm.setFieldsValue(rule)
    setRuleModalVisible(true)
  }

  const handleSaveRule = () => {
    ruleForm.validateFields().then(values => {
      if (currentRule.id) {
        // 编辑现有规则
        const updatedRules = alertRules.map(rule => 
          rule.id === currentRule.id 
            ? { ...rule, ...values, updatedAt: new Date().toISOString() }
            : rule
        )
        setAlertRules(updatedRules)
        message.success('告警规则已更新')
      } else {
        // 创建新规则
        const newRule: AlertRule = {
          id: `rule-${Date.now()}`,
          ...values,
          actions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setAlertRules([...alertRules, newRule])
        message.success('告警规则已创建')
      }
      setRuleModalVisible(false)
      ruleForm.resetFields()
      setCurrentRule({})
    })
  }

  const handleDeleteRule = (id: string) => {
    const updatedRules = alertRules.filter(rule => rule.id !== id)
    setAlertRules(updatedRules)
    message.success('告警规则已删除')
  }

  const handleToggleRule = (id: string) => {
    const updatedRules = alertRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, enabled: !rule.enabled, updatedAt: new Date().toISOString() }
      }
      return rule
    })
    setAlertRules(updatedRules)
    message.success(`告警规则已${updatedRules.find(r => r.id === id)?.enabled ? '启用' : '禁用'}`)
  }

  const handleCreateChannel = () => {
    setCurrentChannel({
      name: '',
      type: 'email',
      enabled: true,
      config: {}
    })
    channelForm.resetFields()
    setChannelModalVisible(true)
  }

  const handleEditChannel = (channel: NotificationChannel) => {
    setCurrentChannel(channel)
    channelForm.setFieldsValue(channel)
    setChannelModalVisible(true)
  }

  const handleSaveChannel = () => {
    channelForm.validateFields().then(values => {
      if (currentChannel.id) {
        // 编辑现有渠道
        const updatedChannels = notificationChannels.map(channel => 
          channel.id === currentChannel.id 
            ? { ...channel, ...values, updatedAt: new Date().toISOString() }
            : channel
        )
        setNotificationChannels(updatedChannels)
        message.success('通知渠道已更新')
      } else {
        // 创建新渠道
        const newChannel: NotificationChannel = {
          id: `channel-${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setNotificationChannels([...notificationChannels, newChannel])
        message.success('通知渠道已创建')
      }
      setChannelModalVisible(false)
      channelForm.resetFields()
      setCurrentChannel({})
    })
  }

  const handleDeleteChannel = (id: string) => {
    const updatedChannels = notificationChannels.filter(channel => channel.id !== id)
    setNotificationChannels(updatedChannels)
    message.success('通知渠道已删除')
  }

  const handleToggleChannel = (id: string) => {
    const updatedChannels = notificationChannels.map(channel => {
      if (channel.id === id) {
        return { ...channel, enabled: !channel.enabled, updatedAt: new Date().toISOString() }
      }
      return channel
    })
    setNotificationChannels(updatedChannels)
    message.success(`通知渠道已${updatedChannels.find(c => c.id === id)?.enabled ? '启用' : '禁用'}`)
  }

  const handleCreateTemplate = () => {
    setCurrentTemplate({
      name: '',
      type: 'email',
      content: '',
      variables: []
    })
    templateForm.resetFields()
    setTemplateModalVisible(true)
  }

  const handleEditTemplate = (template: NotificationTemplate) => {
    setCurrentTemplate(template)
    templateForm.setFieldsValue(template)
    setTemplateModalVisible(true)
  }

  const handleSaveTemplate = () => {
    templateForm.validateFields().then(values => {
      if (currentTemplate.id) {
        // 编辑现有模板
        const updatedTemplates = notificationTemplates.map(template => 
          template.id === currentTemplate.id 
            ? { ...template, ...values, updatedAt: new Date().toISOString() }
            : template
        )
        setNotificationTemplates(updatedTemplates)
        message.success('通知模板已更新')
      } else {
        // 创建新模板
        const newTemplate: NotificationTemplate = {
          id: `template-${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setNotificationTemplates([...notificationTemplates, newTemplate])
        message.success('通知模板已创建')
      }
      setTemplateModalVisible(false)
      templateForm.resetFields()
      setCurrentTemplate({})
    })
  }

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = notificationTemplates.filter(template => template.id !== id)
    setNotificationTemplates(updatedTemplates)
    message.success('通知模板已删除')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'red'
      case 'major':
        return 'orange'
      case 'minor':
        return 'gold'
      case 'warning':
        return 'blue'
      case 'info':
        return 'green'
      default:
        return 'default'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <FireOutlined style={{ color: 'red' }} />
      case 'major':
        return <ExclamationCircleOutlined style={{ color: 'orange' }} />
      case 'minor':
        return <WarningOutlined style={{ color: 'gold' }} />
      case 'warning':
        return <AlertOutlined style={{ color: 'blue' }} />
      case 'info':
        return <InfoCircleOutlined style={{ color: 'green' }} />
      default:
        return <BellOutlined />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'red'
      case 'acknowledged':
        return 'orange'
      case 'resolved':
        return 'green'
      case 'suppressed':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃'
      case 'acknowledged':
        return '已确认'
      case 'resolved':
        return '已解决'
      case 'suppressed':
        return '已抑制'
      default:
        return '未知'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '严重'
      case 'major':
        return '重要'
      case 'minor':
        return '次要'
      case 'warning':
        return '警告'
      case 'info':
        return '信息'
      default:
        return '未知'
    }
  }

  const getChannelTypeText = (type: string) => {
    switch (type) {
      case 'email':
        return '邮件'
      case 'sms':
        return '短信'
      case 'webhook':
        return 'Webhook'
      case 'slack':
        return 'Slack'
      case 'dingtalk':
        return '钉钉'
      default:
        return '未知'
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <MailOutlined />
      case 'sms':
        return <MessageOutlined />
      case 'webhook':
        return <ApiOutlined />
      case 'slack':
        return <SlackOutlined />
      case 'dingtalk':
        return <DingdingOutlined />
      default:
        return <NotificationOutlined />
    }
  }

  const getAlertMenuItems = (record: Alert): MenuProps['items'] => [
    {
      key: 'view',
      label: '查看详情',
      icon: <EyeOutlined />,
      onClick: () => handleViewAlert(record)
    },
    {
      key: 'acknowledge',
      label: '确认告警',
      icon: <CheckCircleOutlined />,
      disabled: record.status !== 'active',
      onClick: () => handleAlertAction(record.id, 'acknowledge')
    },
    {
      key: 'resolve',
      label: '解决告警',
      icon: <CheckCircleOutlined />,
      disabled: record.status === 'resolved',
      onClick: () => handleAlertAction(record.id, 'resolve')
    },
    {
      key: 'suppress',
      label: '抑制告警',
      icon: <StopOutlined />,
      disabled: record.status === 'resolved' || record.status === 'suppressed',
      onClick: () => handleAlertAction(record.id, 'suppress')
    }
  ]

  const getRuleMenuItems = (record: AlertRule): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditRule(record)
    },
    {
      key: 'toggle',
      label: record.enabled ? '禁用' : '启用',
      icon: record.enabled ? <StopOutlined /> : <PlayCircleOutlined />,
      onClick: () => handleToggleRule(record.id)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除告警规则 "${record.name}" 吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDeleteRule(record.id)
        })
      }
    }
  ]

  const getChannelMenuItems = (record: NotificationChannel): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditChannel(record)
    },
    {
      key: 'toggle',
      label: record.enabled ? '禁用' : '启用',
      icon: record.enabled ? <StopOutlined /> : <PlayCircleOutlined />,
      onClick: () => handleToggleChannel(record.id)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除通知渠道 "${record.name}" 吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDeleteChannel(record.id)
        })
      }
    }
  ]

  const getTemplateMenuItems = (record: NotificationTemplate): MenuProps['items'] => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: () => handleEditTemplate(record)
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除通知模板 "${record.name}" 吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDeleteTemplate(record.id)
        })
      }
    }
  ]

  const alertColumns = [
    {
      title: '告警标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Alert) => (
        <Button type="link" onClick={() => handleViewAlert(record)}>
          {text}
        </Button>
      )
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Space>
          {getSeverityIcon(severity)}
          <Tag color={getSeverityColor(severity)}>
            {getSeverityText(severity)}
          </Tag>
        </Space>
      ),
      filters: [
        { text: '严重', value: 'critical' },
        { text: '重要', value: 'major' },
        { text: '次要', value: 'minor' },
        { text: '警告', value: 'warning' },
        { text: '信息', value: 'info' }
      ],
      onFilter: (value: string, record: Alert) => record.severity === value
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={getStatusColor(status) as any} text={getStatusText(status)} />
      ),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '已确认', value: 'acknowledged' },
        { text: '已解决', value: 'resolved' },
        { text: '已抑制', value: 'suppressed' }
      ],
      onFilter: (value: string, record: Alert) => record.status === value
    },
    {
      title: '设备',
      dataIndex: 'deviceName',
      key: 'deviceName'
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a: Alert, b: Alert) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Alert) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewAlert(record)}
          />
          <Dropdown
            menu={{ items: getAlertMenuItems(record) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  const ruleColumns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} size="small" disabled />
      )
    },
    {
      title: '指标',
      dataIndex: 'metric',
      key: 'metric'
    },
    {
      title: '条件',
      key: 'condition',
      render: (record: AlertRule) => (
        <span>{record.metric} {record.condition} {record.threshold}</span>
      )
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={getSeverityColor(severity)}>
          {getSeverityText(severity)}
        </Tag>
      )
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => `${duration}秒`
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (record: AlertRule) => (
        <Space>
          <Switch
            checked={record.enabled}
            size="small"
            onChange={() => handleToggleRule(record.id)}
          />
          <Dropdown
            menu={{ items: getRuleMenuItems(record) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  const channelColumns = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Space>
          {getChannelIcon(type)}
          <span>{getChannelTypeText(type)}</span>
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Switch checked={enabled} size="small" disabled />
      )
    },
    {
      title: '配置',
      dataIndex: 'config',
      key: 'config',
      render: (config: Record<string, any>) => (
        <Tooltip title={JSON.stringify(config, null, 2)}>
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Tooltip>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (record: NotificationChannel) => (
        <Space>
          <Switch
            checked={record.enabled}
            size="small"
            onChange={() => handleToggleChannel(record.id)}
          />
          <Dropdown
            menu={{ items: getChannelMenuItems(record) }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ]

  const templateColumns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getChannelTypeText(type)
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: '变量',
      dataIndex: 'variables',
      key: 'variables',
      render: (variables: string[]) => (
        <Space wrap>
          {variables.map(variable => (
            <Tag key={variable}>{variable}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      render: (record: NotificationTemplate) => (
        <Dropdown
          menu={{ items: getTemplateMenuItems(record) }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="告警中心"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => message.loading('正在刷新...', 0.5)}>
              刷新
            </Button>
            <Button icon={<ExportOutlined />}>
              导出
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="告警列表" key="alerts">
            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="总告警数"
                      value={alertStats.total}
                      prefix={<BellOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="活跃告警"
                      value={alertStats.active}
                      valueStyle={{ color: '#cf1322' }}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="已确认告警"
                      value={alertStats.acknowledged}
                      valueStyle={{ color: '#fa8c16' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="已解决告警"
                      value={alertStats.resolved}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Search
                    placeholder="搜索告警标题、描述或设备名称"
                    allowClear
                    enterButton={<SearchOutlined />}
                    onSearch={setSearchText}
                    onChange={e => !e.target.value && setSearchText('')}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    mode="multiple"
                    placeholder="严重程度"
                    style={{ width: '100%' }}
                    allowClear
                    value={severityFilter}
                    onChange={setSeverityFilter}
                  >
                    <Option value="critical">严重</Option>
                    <Option value="major">重要</Option>
                    <Option value="minor">次要</Option>
                    <Option value="warning">警告</Option>
                    <Option value="info">信息</Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <Select
                    mode="multiple"
                    placeholder="状态"
                    style={{ width: '100%' }}
                    allowClear
                    value={statusFilter}
                    onChange={setStatusFilter}
                  >
                    <Option value="active">活跃</Option>
                    <Option value="acknowledged">已确认</Option>
                    <Option value="resolved">已解决</Option>
                    <Option value="suppressed">已抑制</Option>
                  </Select>
                </Col>
                <Col span={8}>
                  <RangePicker
                    style={{ width: '100%' }}
                    showTime
                    value={dateRange}
                    onChange={setDateRange}
                  />
                </Col>
              </Row>
            </div>

            <Table
              columns={alertColumns}
              dataSource={filteredAlerts}
              rowKey="id"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: filteredAlerts.length,
                onChange: (page, pageSize) => setPagination({ current: page, pageSize: pageSize || 10 })
              }}
            />
          </TabPane>

          <TabPane tab="告警规则" key="rules">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRule}>
                创建规则
              </Button>
            </div>
            <Table
              columns={ruleColumns}
              dataSource={alertRules}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="通知渠道" key="channels">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateChannel}>
                创建渠道
              </Button>
            </div>
            <Table
              columns={channelColumns}
              dataSource={notificationChannels}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="通知模板" key="templates">
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTemplate}>
                创建模板
              </Button>
            </div>
            <Table
              columns={templateColumns}
              dataSource={notificationTemplates}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 告警详情弹窗 */}
      <Modal
        title="告警详情"
        open={alertDetailVisible}
        onCancel={() => setAlertDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAlertDetailVisible(false)}>
            关闭
          </Button>,
          selectedAlert?.status === 'active' && (
            <Button key="acknowledge" onClick={() => {
              handleAlertAction(selectedAlert.id, 'acknowledge')
              setAlertDetailVisible(false)
            }}>
              确认告警
            </Button>
          ),
          selectedAlert?.status !== 'resolved' && (
            <Button key="resolve" type="primary" onClick={() => {
              handleAlertAction(selectedAlert.id, 'resolve')
              setAlertDetailVisible(false)
            }}>
              解决告警
            </Button>
          )
        ]}
        width={800}
      >
        {selectedAlert && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>告警标题：</Text>
                  <Text>{selectedAlert.title}</Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>严重程度：</Text>
                  <Space>
                    {getSeverityIcon(selectedAlert.severity)}
                    <Tag color={getSeverityColor(selectedAlert.severity)}>
                      {getSeverityText(selectedAlert.severity)}
                    </Tag>
                  </Space>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>状态：</Text>
                  <Badge status={getStatusColor(selectedAlert.status) as any} text={getStatusText(selectedAlert.status)} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>设备：</Text>
                  <Text>{selectedAlert.deviceName}</Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>类别：</Text>
                  <Text>{selectedAlert.category}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>时间：</Text>
                  <Text>{dayjs(selectedAlert.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </div>
                {selectedAlert.acknowledgedAt && (
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>确认时间：</Text>
                    <Text>{dayjs(selectedAlert.acknowledgedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </div>
                )}
                {selectedAlert.resolvedAt && (
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>解决时间：</Text>
                    <Text>{dayjs(selectedAlert.resolvedAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </div>
                )}
                <div style={{ marginBottom: 16 }}>
                  <Text strong>标签：</Text>
                  <Space wrap>
                    {selectedAlert.tags?.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </div>
              </Col>
            </Row>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <Text strong>描述：</Text>
              <Paragraph>{selectedAlert.description}</Paragraph>
            </div>
            {selectedAlert.metadata && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>元数据：</Text>
                <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(selectedAlert.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 告警规则弹窗 */}
      <Modal
        title={currentRule.id ? '编辑告警规则' : '创建告警规则'}
        open={ruleModalVisible}
        onOk={handleSaveRule}
        onCancel={() => setRuleModalVisible(false)}
        width={800}
      >
        <Form form={ruleForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="规则名称"
                rules={[{ required: true, message: '请输入规则名称' }]}
              >
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="metric"
                label="指标"
                rules={[{ required: true, message: '请选择指标' }]}
              >
                <Select placeholder="请选择指标">
                  <Option value="temperature">温度</Option>
                  <Option value="humidity">湿度</Option>
                  <Option value="pressure">压力</Option>
                  <Option value="status">状态</Option>
                  <Option value="cpu_usage">CPU使用率</Option>
                  <Option value="memory_usage">内存使用率</Option>
                  <Option value="disk_usage">磁盘使用率</Option>
                  <Option value="network_latency">网络延迟</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="condition"
                label="条件"
                initialValue=">"
              >
                <Select>
                  <Option value=">">大于</Option>
                  <Option value=">=">大于等于</Option>
                  <Option value="<">小于</Option>
                  <Option value="<=">小于等于</Option>
                  <Option value="==">等于</Option>
                  <Option value="!=">不等于</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="threshold"
                label="阈值"
                rules={[{ required: true, message: '请输入阈值' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="severity"
                label="严重程度"
                initialValue="warning"
              >
                <Select>
                  <Option value="critical">严重</Option>
                  <Option value="major">重要</Option>
                  <Option value="minor">次要</Option>
                  <Option value="warning">警告</Option>
                  <Option value="info">信息</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="duration"
                label="持续时间(秒)"
                initialValue={60}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="consecutiveCount"
                label="连续次数"
                initialValue={1}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 通知渠道弹窗 */}
      <Modal
        title={currentChannel.id ? '编辑通知渠道' : '创建通知渠道'}
        open={channelModalVisible}
        onOk={handleSaveChannel}
        onCancel={() => setChannelModalVisible(false)}
        width={800}
      >
        <Form form={channelForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="渠道名称"
                rules={[{ required: true, message: '请输入渠道名称' }]}
              >
                <Input placeholder="请输入渠道名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="渠道类型"
                rules={[{ required: true, message: '请选择渠道类型' }]}
              >
                <Select placeholder="请选择渠道类型">
                  <Option value="email">邮件</Option>
                  <Option value="sms">短信</Option>
                  <Option value="webhook">Webhook</Option>
                  <Option value="slack">Slack</Option>
                  <Option value="dingtalk">钉钉</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="enabled"
            label="启用状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="config"
            label="配置"
            rules={[{ required: true, message: '请输入配置' }]}
          >
            <TextArea rows={8} placeholder="请输入JSON格式的配置" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 通知模板弹窗 */}
      <Modal
        title={currentTemplate.id ? '编辑通知模板' : '创建通知模板'}
        open={templateModalVisible}
        onOk={handleSaveTemplate}
        onCancel={() => setTemplateModalVisible(false)}
        width={800}
      >
        <Form form={templateForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模板类型"
                rules={[{ required: true, message: '请选择模板类型' }]}
              >
                <Select placeholder="请选择模板类型">
                  <Option value="email">邮件</Option>
                  <Option value="sms">短信</Option>
                  <Option value="webhook">Webhook</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="subject"
            label="主题"
          >
            <Input placeholder="请输入主题（邮件模板需要）" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={8} placeholder="请输入内容，可以使用{{variableName}}格式的变量" />
          </Form.Item>
          <Form.Item
            name="variables"
            label="变量"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="输入变量名，按回车添加"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AlertsPanel


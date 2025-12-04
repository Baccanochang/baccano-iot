import { Card, Col, Row, Statistic, Space, Typography, Badge, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Line, Pie, Column } from '@ant-design/charts'
import { Link } from 'react-router-dom'
import { 
  DatabaseOutlined, 
  WifiOutlined, 
  DisconnectOutlined, 
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'
import TelemetryTrend from './TelemetryTrend'
import Page from '../../components/layout/Page'

const { Title, Text } = Typography

// Mock API functions - in a real app these would call the backend
const fetchDashboardStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    totalDevices: 1250,
    onlineDevices: 1087,
    offlineDevices: 163,
    activeAlerts: 23,
    totalProducts: 15,
    totalAssets: 42,
    deviceTrend: [
      { date: '2023-11-01', online: 1020, offline: 150 },
      { date: '2023-11-02', online: 1035, offline: 145 },
      { date: '2023-11-03', online: 1050, offline: 140 },
      { date: '2023-11-04', online: 1065, offline: 135 },
      { date: '2023-11-05', online: 1080, offline: 130 },
      { date: '2023-11-06', online: 1087, offline: 163 },
    ],
    deviceTypes: [
      { type: '传感器', value: 680 },
      { type: '控制器', value: 320 },
      { type: '网关', value: 150 },
      { type: '其他', value: 100 },
    ],
    alertsBySeverity: [
      {
        severity: '严重',
        value: 5,
      },
      {
        severity: '警告',
        value: 12,
      },
      {
        severity: '信息',
        value: 6,
      }
    ],
  }
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <Page title="仪表盘">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </Page>
    )
  }

  if (error) {
    return (
      <Page title="仪表盘">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text type="danger">加载仪表盘数据失败</Text>
        </div>
      </Page>
    )
  }

  const deviceTrendConfig = {
    data: stats?.deviceTrend || [],
    xField: 'date',
    yField: ['online', 'offline'],
    seriesField: 'type',
    smooth: true,
    legend: {
      custom: true,
      items: [
        { name: '在线设备', value: 'online', marker: { symbol: 'circle' } },
        { name: '离线设备', value: 'offline', marker: { symbol: 'circle' } },
      ],
    },
    color: ['#52c41a', '#ff4d4f'],
  }

  const deviceTypesConfig = {
    data: stats?.deviceTypes || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  }

  const alertsConfig = {
    data: stats?.alertsBySeverity || [],
    xField: 'severity',
    yField: 'value',
    color: ({ severity }) => {
      if (severity === '严重') return '#ff4d4f'
      if (severity === '警告') return '#faad14'
      return '#1890ff'
    },
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
      },
    },
  }

  const onlineRate = stats ? Math.round((stats.onlineDevices / stats.totalDevices) * 100) : 0

  return (
    <Page title="仪表盘">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 总体统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="设备总数"
                value={stats?.totalDevices || 0}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="在线设备"
                value={stats?.onlineDevices || 0}
                prefix={<WifiOutlined />}
                suffix={
                  <Badge
                    count={`${onlineRate}%`}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                }
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="离线设备"
                value={stats?.offlineDevices || 0}
                prefix={<DisconnectOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="活跃告警"
                value={stats?.activeAlerts || 0}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="设备在线趋势" extra={<Link to="/devices">查看详情</Link>}>
              <Line {...deviceTrendConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="设备类型分布" extra={<Link to="/devices">查看详情</Link>}>
              <Pie {...deviceTypesConfig} height={300} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="告警严重程度分布" extra={<Link to="/alerts">查看详情</Link>}>
              <Column {...alertsConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="产品与资产概览">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="产品总数"
                    value={stats?.totalProducts || 0}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="资产总数"
                    value={stats?.totalAssets || 0}
                    prefix={<ArrowUpOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Link to="/products">管理产品</Link>
                  <Link to="/asset-tree">管理资产</Link>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 实时遥测数据 */}
        <Card title="实时遥测数据" extra={<Link to="/dashboard/telemetry">查看详情</Link>}>
          <TelemetryTrend />
        </Card>
      </Space>
    </Page>
  )
}


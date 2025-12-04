import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import AppRoutes from './routes'

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header>
        <Menu theme="dark" mode="horizontal" items={[
          { key: 'device', label: <Link to="/devices/demo">设备详情</Link> },
          { key: 'products', label: <Link to="/products">产品管理</Link> },
          { key: 'assets', label: <Link to="/asset-tree">资产管理</Link> },
          { key: 'rules', label: <Link to="/rule-engine">规则引擎</Link> },
          { key: 'alerts', label: <Link to="/alerts">告警中心</Link> },
          { key: 'debug', label: <Link to="/debug">调试</Link> },
        ]} />
      </Layout.Header>
      <Layout.Content style={{ padding: 24 }}>
        <AppRoutes />
      </Layout.Content>
    </Layout>
  )
}

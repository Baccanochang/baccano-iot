import { Card, Col, Row, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

function HealthCard({ title, base }: { title: string; base: string }) {
  const q = useQuery({ queryKey: ['health', base], queryFn: () => fetch(`${base}/debug/health`).then(r => r.json()) })
  return <Card title={title}><Typography.Text>{JSON.stringify(q.data || {})}</Typography.Text></Card>
}

export default function DebugStatus() {
  const gw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const dc = import.meta.env.VITE_CONNECT_BASE_URL || 'http://localhost:8090'
  const dm = import.meta.env.VITE_DEVICE_MANAGER_URL || 'http://localhost:8082'
  const am = import.meta.env.VITE_ASSET_MANAGER_URL || 'http://localhost:8083'
  const ac = import.meta.env.VITE_ALERT_CENTER_URL || 'http://localhost:8084'
  const re = import.meta.env.VITE_RULE_ENGINE_URL || 'http://localhost:8085'
  return (
    <Row gutter={[16, 16]}>
      <Col span={8}><HealthCard title="API Gateway" base={gw} /></Col>
      <Col span={8}><HealthCard title="Device Connect" base={dc} /></Col>
      <Col span={8}><HealthCard title="Device Manager" base={dm} /></Col>
      <Col span={8}><HealthCard title="Asset Manager" base={am} /></Col>
      <Col span={8}><HealthCard title="Alert Center" base={ac} /></Col>
      <Col span={8}><HealthCard title="Rule Engine" base={re} /></Col>
    </Row>
  )
}


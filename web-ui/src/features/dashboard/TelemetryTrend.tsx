import { Card } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Line } from '@ant-design/charts'

export default function TelemetryTrend() {
  const deviceId = 'demo'
  const q = useQuery({ queryKey: ['telemetry', deviceId], queryFn: () => fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/telemetry/${deviceId}/history`).then(r => r.json()) })
  const data = Array.isArray(q.data) ? q.data.map((d: any) => ({ ts: d.ts, value: d.temperature })) : []
  return <Card title="遥测趋势"><Line data={data} xField="ts" yField="value" /></Card>
}


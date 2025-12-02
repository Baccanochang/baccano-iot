import { Card, Table, Tag, Select, Space } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function AlertsPanel() {
  const base = import.meta.env.VITE_ALERT_CENTER_URL || 'http://localhost:8084'
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['alerts'], queryFn: () => fetch(`${base}/api/v1/alerts`).then(r => r.json()) })
  const upd = useMutation({ mutationFn: (p: { id: string; status: string }) => fetch(`${base}/api/v1/alerts/${p.id}`, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ status: p.status }) }).then(r => r.json()), onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }) })
  return <Card title="告警列表"><Table rowKey="id" dataSource={Array.isArray(q.data)?q.data:[]} columns={[{ title:'设备', dataIndex:'deviceId' }, { title:'类型', dataIndex:'type' }, { title:'等级', dataIndex:'severity', render:(v) => <Tag color={v==='CRITICAL'?'red':'orange'}>{v}</Tag> }, { title:'状态', dataIndex:'status', render:(v, r:any) => <Space><Tag>{v}</Tag><Select size="small" defaultValue={v} onChange={(s)=>upd.mutate({ id:r.id, status:s })} options={[{value:'ACTIVE',label:'ACTIVE'},{value:'ACKNOWLEDGED',label:'ACKNOWLEDGED'},{value:'CLEARED',label:'CLEARED'}]} /></Space> }]}/></Card>
}


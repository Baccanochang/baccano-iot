import { Table } from 'antd'
export default function KVTable({ data }: { data: Record<string, any> }) { return <Table rowKey={(r) => r[0]} columns={[{ title: '键', dataIndex: 0 }, { title: '值', dataIndex: 1 }]} dataSource={Object.entries(data || {})} pagination={false} /> }


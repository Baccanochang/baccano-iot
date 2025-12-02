import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Input, Space, Table } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, listThingModels } from '../../api/products'

export default function ProductList() {
  const nav = useNavigate()
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (v: any) => createProduct({ id: v.id, name: v.name, protocol: v.protocol }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] })
  })
  const data = useQuery({ queryKey: ['products'], queryFn: async () => [{ id: 'demo-prod', name: 'Demo Product', protocol: 'MQTT' }] })
  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Card title="创建产品">
        <Form onFinish={(v) => create.mutate(v)} layout="inline">
          <Form.Item name="id" label="ID"><Input /></Form.Item>
          <Form.Item name="name" label="名称"><Input /></Form.Item>
          <Form.Item name="protocol" label="协议"><Input placeholder="MQTT" /></Form.Item>
          <Form.Item><Button htmlType="submit" type="primary">创建</Button></Form.Item>
        </Form>
      </Card>
      <Card title="产品列表">
        <Table
          rowKey="id"
          columns={[
            { title: 'ID', dataIndex: 'id' },
            { title: '名称', dataIndex: 'name' },
            { title: '协议', dataIndex: 'protocol' },
            { title: '操作', render: (_, r) => <Button onClick={() => nav(`/products/${r.id}`)}>详情</Button> }
          ]}
          dataSource={data.data || []}
          pagination={false}
        />
      </Card>
    </Space>
  )
}


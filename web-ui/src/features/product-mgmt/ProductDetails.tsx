import { useParams } from 'react-router-dom'
import { Button, Card, Form, Input, Space, Table, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getThingModel, listThingModels, putThingModel, validateThingModel, diffThingModels } from '../../api/products'
import ThingModelEditor from './ThingModelEditor'

export default function ProductDetails() {
  const { productId } = useParams()
  const qc = useQueryClient()
  const list = useQuery({ queryKey: ['models', productId], queryFn: () => listThingModels(productId || 'demo-prod'), enabled: !!productId })
  const put = useMutation({ mutationFn: (v: any) => putThingModel(productId || 'demo-prod', v.version, v.model), onSuccess: () => qc.invalidateQueries({ queryKey: ['models', productId] }) })
  const validate = useMutation({ mutationFn: (model: any) => validateThingModel(model) })
  const diff = useMutation({ mutationFn: async (v: any) => diffThingModels(await getThingModel(productId || 'demo-prod', v.a), await getThingModel(productId || 'demo-prod', v.b)) })
  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Card title="物模型版本">
        <Table
          rowKey={(r) => r[0]}
          columns={[{ title: '版本', dataIndex: 0 }, { title: '模型', dataIndex: 1 }]}
          dataSource={list.data ? Object.entries(list.data) : []}
          pagination={false}
        />
      </Card>
      <Card title="新增或更新模型">
        <ThingModelEditor onSubmit={(v) => put.mutate(v)} />
      </Card>
      <Card title="验证模型">
        <ThingModelEditor onSubmit={(v) => validate.mutate(v.model)} />
        <Typography.Paragraph>{validate.data ? JSON.stringify(validate.data) : ''}</Typography.Paragraph>
      </Card>
      <Card title="模型对比">
        <Form onFinish={(v) => diff.mutate(v)} layout="inline">
          <Form.Item name="a" label="版本A"><Input placeholder="v1" /></Form.Item>
          <Form.Item name="b" label="版本B"><Input placeholder="v2" /></Form.Item>
          <Form.Item><Button htmlType="submit" type="primary">对比</Button></Form.Item>
        </Form>
        <Typography.Paragraph>{diff.data ? JSON.stringify(diff.data) : ''}</Typography.Paragraph>
      </Card>
    </Space>
  )
}


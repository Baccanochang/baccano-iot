import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Form, Input, Select, Space, Table, Typography } from 'antd'
import { callService, createDevice, getAttributes, getDevice, getLatestTelemetry, getShadow, getThingModelByDevice, updateAttributes, updateDesired } from '../api/devices'
import { getThingModel } from '../api/products'

export default function DeviceDetails() {
  const { deviceId } = useParams()
  const qc = useQueryClient()

  const createDemo = useMutation({
    mutationFn: () => createDevice({ id: deviceId || 'demo-dev', name: 'Demo Device', productId: 'demo-prod', modelVersion: 'v1' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['device', deviceId] })
      qc.invalidateQueries({ queryKey: ['shadow', deviceId] })
      qc.invalidateQueries({ queryKey: ['attributes', deviceId] })
    }
  })

  const device = useQuery({ queryKey: ['device', deviceId], queryFn: () => getDevice(deviceId || 'demo-dev'), enabled: !!deviceId })
  const model = useQuery({ 
    queryKey: ['model', deviceId], 
    queryFn: () => {
      const productId = device.data?.productId || 'demo-prod'
      const version = device.data?.modelVersion || 'v1'
      return getThingModel(productId, version)
    }, 
    enabled: !!deviceId && !!device.data?.productId 
  })
  const shadow = useQuery({ queryKey: ['shadow', deviceId], queryFn: () => getShadow(deviceId || 'demo-dev'), enabled: !!deviceId })
  const attributes = useQuery({ queryKey: ['attributes', deviceId], queryFn: () => getAttributes(deviceId || 'demo-dev'), enabled: !!deviceId })

  const desiredUpdate = useMutation({
    mutationFn: (values: Record<string, any>) => updateDesired(deviceId || 'demo-dev', values),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shadow', deviceId] })
  })

  const attrUpdate = useMutation({
    mutationFn: (values: Record<string, any>) => updateAttributes(deviceId || 'demo-dev', values),
    onMutate: async (values) => {
      await qc.cancelQueries({ queryKey: ['attributes', deviceId] })
      const prev = qc.getQueryData(['attributes', deviceId]) as any
      qc.setQueryData(['attributes', deviceId], (old: any) => ({ ...(old || {}), ...values }))
      return { prev }
    },
    onError: (_err, _vars, ctx) => { if (ctx?.prev) qc.setQueryData(['attributes', deviceId], ctx.prev) },
    onSettled: () => qc.invalidateQueries({ queryKey: ['attributes', deviceId] })
  })

  const serviceCall = useMutation({
    mutationFn: (values: Record<string, any>) => callService(deviceId || 'demo-dev', values.service, values),
  })

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Space>
        <Button type="primary" onClick={() => createDemo.mutate()}>
          创建示例设备
        </Button>
      </Space>
      <Card title="设备基本信息">
        <Typography.Paragraph>
          {device.data ? JSON.stringify(device.data) : '无数据'}
        </Typography.Paragraph>
      </Card>
      <Card title="物模型">
        <Typography.Paragraph>
          {model.data ? JSON.stringify(model.data) : '无数据'}
        </Typography.Paragraph>
      </Card>
      <Card title="影子 Desired 更新">
        <Form onFinish={(v) => desiredUpdate.mutate(v)} layout="inline">
          <Form.Item name="targetTemp" label="目标温度">
            <Input placeholder="例如 22" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">更新</Button>
          </Form.Item>
        </Form>
        <Typography.Paragraph>
          {shadow.data ? JSON.stringify(shadow.data) : '无数据'}
        </Typography.Paragraph>
      </Card>
      <Card title="属性管理">
        <Form onFinish={(v) => attrUpdate.mutate(v)} layout="vertical">
          {Array.isArray(model.data?.properties) && model.data?.properties.filter((p: any) => p.category === 'attribute').map((p: any) => (
            <Form.Item key={p.identifier} name={p.identifier} label={p.name} initialValue={attributes.data?.[p.identifier]}>
              <Input placeholder={p.identifier} />
            </Form.Item>
          ))}
          <Button htmlType="submit" type="primary">更新</Button>
        </Form>
        <Table
          rowKey={(r) => r[0]}
          columns={[{ title: '键', dataIndex: 0 }, { title: '值', dataIndex: 1 }]}
          dataSource={attributes.data ? Object.entries(attributes.data || {}) : []}
          pagination={false}
        />
      </Card>
      <Card title="服务调用">
        <Form onFinish={(v) => serviceCall.mutate(v)} layout="vertical">
          <Form.Item name="service" label="服务">
            <Select options={(model.data?.services || []).map((s: any) => ({ label: s.name, value: s.identifier }))} />
          </Form.Item>
          {(model.data?.services || []).map((s: any) => (
            <div key={s.identifier}>
              {Array.isArray(s.inputData) && s.inputData.map((inp: any) => (
                <Form.Item key={`${s.identifier}.${inp.identifier}`} name={inp.identifier} label={inp.name}>
                  <Input placeholder={inp.identifier} />
                </Form.Item>
              ))}
            </div>
          ))}
          <Button htmlType="submit" type="primary">调用</Button>
        </Form>
        <Typography.Paragraph>
          {serviceCall.data ? JSON.stringify(serviceCall.data) : ''}
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}

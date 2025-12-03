import { Card, Space, Typography, Form, Input, Button, Select, Divider, ArrayField } from 'antd'
import { useState } from 'react'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

const { Option } = Select

interface Property {
  identifier: string
  name: string
  category: 'telemetry' | 'attribute' | 'event'
  dataType: {
    type: 'int' | 'float' | 'string' | 'bool'
    specs?: Record<string, any>
  }
}

interface Service {
  identifier: string
  name: string
  callType: 'sync' | 'async'
  inputData: Array<{
    identifier: string
    name: string
    dataType: { type: string }
  }>
  outputData: Array<{
    identifier: string
    name: string
    dataType: { type: string }
  }>
}

interface Event {
  identifier: string
  name: string
  type: string
  outputData: Array<{
    identifier: string
    name: string
    dataType: { type: string }
  }>
}

interface ThingModel {
  schemaVersion: string
  properties: Property[]
  services: Service[]
  events: Event[]
}

export default function ThingModelEditor() {
  const [model, setModel] = useState<ThingModel>({
    schemaVersion: '1.0',
    properties: [],
    services: [],
    events: []
  })

  const addProperty = () => {
    setModel(prev => ({
      ...prev,
      properties: [...prev.properties, {
        identifier: '',
        name: '',
        category: 'telemetry',
        dataType: { type: 'string', specs: {} }
      }]
    }))
  }

  const updateProperty = (index: number, field: string, value: any) => {
    setModel(prev => {
      const newProperties = [...prev.properties]
      newProperties[index] = { ...newProperties[index], [field]: value }
      return { ...prev, properties: newProperties }
    })
  }

  const removeProperty = (index: number) => {
    setModel(prev => {
      const newProperties = prev.properties.filter((_, i) => i !== index)
      return { ...prev, properties: newProperties }
    })
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Card title="物模型编辑器">
        <Form layout="vertical">
          <Form.Item label="Schema版本">
            <Input 
              value={model.schemaVersion} 
              onChange={(e) => setModel(prev => ({ ...prev, schemaVersion: e.target.value }))}
            />
          </Form.Item>
          
          <Divider>属性</Divider>
          <Button type="dashed" onClick={addProperty} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
            添加属性
          </Button>
          
          {model.properties.map((prop, index) => (
            <Card key={index} size="small" style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography.Text strong>属性 {index + 1}</Typography.Text>
                  <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => removeProperty(index)} />
                </div>
                <Input 
                  placeholder="标识符" 
                  value={prop.identifier} 
                  onChange={(e) => updateProperty(index, 'identifier', e.target.value)} 
                />
                <Input 
                  placeholder="名称" 
                  value={prop.name} 
                  onChange={(e) => updateProperty(index, 'name', e.target.value)} 
                />
                <Select 
                  value={prop.category} 
                  onChange={(value) => updateProperty(index, 'category', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="telemetry">遥测</Option>
                  <Option value="attribute">属性</Option>
                  <Option value="event">事件</Option>
                </Select>
                <Select 
                  value={prop.dataType.type} 
                  onChange={(value) => updateProperty(index, 'dataType', { ...prop.dataType, type: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="int">整数</Option>
                  <Option value="float">浮点数</Option>
                  <Option value="string">字符串</Option>
                  <Option value="bool">布尔值</Option>
                </Select>
              </Space>
            </Card>
          ))}
        </Form>
      </Card>
      <Card title="实时预览">
        <Typography.Paragraph>
          <pre>{JSON.stringify(model, null, 2)}</pre>
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
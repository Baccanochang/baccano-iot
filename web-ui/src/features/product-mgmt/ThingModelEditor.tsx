import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Space, 
  Typography, 
  Form, 
  Input, 
  Button, 
  Select, 
  Divider, 
  Tabs, 
  Switch, 
  InputNumber, 
  Slider,
  message,
  Row,
  Col,
  Alert,
  Collapse,
  Tag,
  Tooltip,
  Modal,
  Empty
} from 'antd'
import { 
  PlusOutlined, 
  MinusCircleOutlined,
  EyeOutlined,
  CopyOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CodeOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots'

const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { Panel } = Collapse
const { Text, Title } = Typography

interface Property {
  identifier: string
  name: string
  category: 'telemetry' | 'attribute' | 'event'
  dataType: {
    type: 'int' | 'float' | 'string' | 'bool' | 'enum' | 'array' | 'object'
    specs?: {
      min?: number
      max?: number
      unit?: string
      step?: number
      length?: number
      enum?: Array<{ name: string; value: any }>
      arrayType?: string
      objectType?: string
    }
  }
  description?: string
  required?: boolean
  accessMode?: 'r' | 'w' | 'rw'
}

interface Service {
  identifier: string
  name: string
  description?: string
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
  description?: string
  type: string
  outputData: Array<{
    identifier: string
    name: string
    dataType: { type: string }
  }>
}

interface ThingModel {
  schemaVersion: string
  name?: string
  description?: string
  properties: Property[]
  services: Service[]
  events: Event[]
}

interface ValidationErrors {
  [key: string]: string[]
}

interface MockDataPoint {
  time: string
  value: number
  property: string
}

export default function ThingModelEditor() {
  const [model, setModel] = useState<ThingModel>({
    schemaVersion: '1.0',
    name: '',
    description: '',
    properties: [],
    services: [],
    events: []
  })

  const [activeTab, setActiveTab] = useState('properties')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [previewVisible, setPreviewVisible] = useState(false)
  const [mockData, setMockData] = useState<MockDataPoint[]>([])

  // 验证模型
  useEffect(() => {
    validateModel()
  }, [model])

  // 生成模拟数据
  useEffect(() => {
    generateMockData()
  }, [model.properties])

  const validateModel = () => {
    const errors: ValidationErrors = {}

    // 验证属性
    model.properties.forEach((prop, index) => {
      const propErrors: string[] = []
      
      if (!prop.identifier) {
        propErrors.push('标识符不能为空')
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(prop.identifier)) {
        propErrors.push('标识符格式不正确，只能包含字母、数字和下划线，且不能以数字开头')
      }
      
      if (!prop.name) {
        propErrors.push('名称不能为空')
      }
      
      if (prop.dataType.type === 'int' || prop.dataType.type === 'float') {
        const { min, max } = prop.dataType.specs || {}
        if (min !== undefined && max !== undefined && min >= max) {
          propErrors.push('最小值必须小于最大值')
        }
      }
      
      if (propErrors.length > 0) {
        errors[`property_${index}`] = propErrors
      }
    })

    // 验证服务
    model.services.forEach((service, index) => {
      const serviceErrors: string[] = []
      
      if (!service.identifier) {
        serviceErrors.push('服务标识符不能为空')
      }
      
      if (!service.name) {
        serviceErrors.push('服务名称不能为空')
      }
      
      if (serviceErrors.length > 0) {
        errors[`service_${index}`] = serviceErrors
      }
    })

    // 验证事件
    model.events.forEach((event, index) => {
      const eventErrors: string[] = []
      
      if (!event.identifier) {
        eventErrors.push('事件标识符不能为空')
      }
      
      if (!event.name) {
        eventErrors.push('事件名称不能为空')
      }
      
      if (eventErrors.length > 0) {
        errors[`event_${index}`] = eventErrors
      }
    })

    setValidationErrors(errors)
  }

  const generateMockData = () => {
    const now = new Date()
    const data: MockDataPoint[] = []
    
    model.properties
      .filter(prop => prop.category === 'telemetry' && (prop.dataType.type === 'int' || prop.dataType.type === 'float'))
      .forEach(prop => {
        for (let i = 0; i < 20; i++) {
          const time = new Date(now.getTime() - i * 60000).toISOString()
          let value = 0
          
          if (prop.dataType.type === 'int') {
            const { min = 0, max = 100 } = prop.dataType.specs || {}
            value = Math.floor(Math.random() * (max - min + 1)) + min
          } else if (prop.dataType.type === 'float') {
            const { min = 0, max = 100 } = prop.dataType.specs || {}
            value = Math.random() * (max - min) + min
            value = Math.round(value * 100) / 100
          }
          
          data.push({ time, value, property: prop.name || prop.identifier })
        }
      })
    
    setMockData(data)
  }

  const addProperty = () => {
    setModel(prev => ({
      ...prev,
      properties: [...prev.properties, {
        identifier: '',
        name: '',
        category: 'telemetry',
        dataType: { type: 'string', specs: {} },
        description: '',
        required: false,
        accessMode: 'r'
      }]
    }))
  }

  const updateProperty = (index: number, field: string, value: any) => {
    setModel(prev => {
      const newProperties = [...prev.properties]
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        newProperties[index] = { 
          ...newProperties[index], 
          [parent]: { 
            ...newProperties[index][parent as keyof Property], 
            [child]: value 
          } 
        }
      } else {
        newProperties[index] = { ...newProperties[index], [field]: value }
      }
      
      return { ...prev, properties: newProperties }
    })
  }

  const removeProperty = (index: number) => {
    setModel(prev => {
      const newProperties = prev.properties.filter((_, i) => i !== index)
      return { ...prev, properties: newProperties }
    })
  }

  const addService = () => {
    setModel(prev => ({
      ...prev,
      services: [...prev.services, {
        identifier: '',
        name: '',
        description: '',
        callType: 'sync',
        inputData: [],
        outputData: []
      }]
    }))
  }

  const updateService = (index: number, field: string, value: any) => {
    setModel(prev => {
      const newServices = [...prev.services]
      newServices[index] = { ...newServices[index], [field]: value }
      return { ...prev, services: newServices }
    })
  }

  const removeService = (index: number) => {
    setModel(prev => {
      const newServices = prev.services.filter((_, i) => i !== index)
      return { ...prev, services: newServices }
    })
  }

  const addEvent = () => {
    setModel(prev => ({
      ...prev,
      events: [...prev.events, {
        identifier: '',
        name: '',
        description: '',
        type: 'info',
        outputData: []
      }]
    }))
  }

  const updateEvent = (index: number, field: string, value: any) => {
    setModel(prev => {
      const newEvents = [...prev.events]
      newEvents[index] = { ...newEvents[index], [field]: value }
      return { ...prev, events: newEvents }
    })
  }

  const removeEvent = (index: number) => {
    setModel(prev => {
      const newEvents = prev.events.filter((_, i) => i !== index)
      return { ...prev, events: newEvents }
    })
  }

  const copyToClipboard = () => {
    const json = JSON.stringify(model, null, 2)
    navigator.clipboard.writeText(json).then(() => {
      message.success('物模型已复制到剪贴板')
    })
  }

  const downloadModel = () => {
    const json = JSON.stringify(model, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${model.name || 'thing-model'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    message.success('物模型已下载')
  }

  const uploadModel = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string
        const uploadedModel = JSON.parse(json)
        setModel(uploadedModel)
        message.success('物模型已上传')
      } catch (error) {
        message.error('上传失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
    return false
  }

  const hasErrors = Object.keys(validationErrors).length > 0

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card 
            title="物模型编辑器" 
            extra={
              <Space>
                <Button icon={<UploadOutlined />} onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.json'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) uploadModel(file)
                  }
                  input.click()
                }}>
                  导入
                </Button>
                <Button icon={<DownloadOutlined />} onClick={downloadModel}>
                  导出
                </Button>
                <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                  复制
                </Button>
                <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>
                  预览
                </Button>
              </Space>
            }
          >
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="模型名称">
                    <Input 
                      value={model.name} 
                      onChange={(e) => setModel(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="请输入物模型名称"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Schema版本">
                    <Input 
                      value={model.schemaVersion} 
                      onChange={(e) => setModel(prev => ({ ...prev, schemaVersion: e.target.value }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="模型状态">
                    <Space>
                      <Text>验证状态：</Text>
                      {hasErrors ? 
                        <Tag color="error" icon={<ExclamationCircleOutlined />}>有错误</Tag> : 
                        <Tag color="success" icon={<CheckCircleOutlined />}>验证通过</Tag>
                      }
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="模型描述">
                <TextArea 
                  value={model.description} 
                  onChange={(e) => setModel(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入物模型描述"
                  rows={3}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {hasErrors && (
        <Alert
          message="模型验证错误"
          description={
            <div>
              {Object.entries(validationErrors).map(([key, errors]) => (
                <div key={key}>
                  <Text strong>{key}:</Text>
                  <ul style={{ margin: '4px 0 0 20px' }}>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          }
          type="error"
          showIcon
          closable
          style={{ marginBottom: '24px' }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab={`属性 (${model.properties.length})`} key="properties">
                <Button 
                  type="dashed" 
                  onClick={addProperty} 
                  icon={<PlusOutlined />} 
                  style={{ marginBottom: 16 }}
                >
                  添加属性
                </Button>
                
                {model.properties.length === 0 ? (
                  <Empty description="暂无属性，请点击上方按钮添加" />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    {model.properties.map((prop, index) => (
                      <Card 
                        key={index} 
                        size="small" 
                        title={
                          <Space>
                            <Text strong>属性 {index + 1}</Text>
                            {prop.required && <Tag color="red">必填</Tag>}
                            <Tag color={prop.category === 'telemetry' ? 'blue' : prop.category === 'attribute' ? 'green' : 'orange'}>
                              {prop.category === 'telemetry' ? '遥测' : prop.category === 'attribute' ? '属性' : '事件'}
                            </Tag>
                            <Tag color="cyan">{prop.accessMode === 'r' ? '只读' : prop.accessMode === 'w' ? '只写' : '读写'}</Tag>
                          </Space>
                        }
                        extra={
                          <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => removeProperty(index)} />
                        }
                      >
                        {validationErrors[`property_${index}`] && (
                          <Alert
                            message="验证错误"
                            description={
                              <ul style={{ margin: '4px 0 0 20px' }}>
                                {validationErrors[`property_${index}`].map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                        )}
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="标识符" required>
                              <Input 
                                placeholder="标识符" 
                                value={prop.identifier} 
                                onChange={(e) => updateProperty(index, 'identifier', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="名称" required>
                              <Input 
                                placeholder="名称" 
                                value={prop.name} 
                                onChange={(e) => updateProperty(index, 'name', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Form.Item label="描述">
                          <Input 
                            placeholder="描述" 
                            value={prop.description} 
                            onChange={(e) => updateProperty(index, 'description', e.target.value)} 
                          />
                        </Form.Item>
                        
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item label="属性类型">
                              <Select 
                                value={prop.category} 
                                onChange={(value) => updateProperty(index, 'category', value)}
                                style={{ width: '100%' }}
                              >
                                <Option value="telemetry">遥测</Option>
                                <Option value="attribute">属性</Option>
                                <Option value="event">事件</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="数据类型">
                              <Select 
                                value={prop.dataType.type} 
                                onChange={(value) => updateProperty(index, 'dataType.type', value)}
                                style={{ width: '100%' }}
                              >
                                <Option value="int">整数</Option>
                                <Option value="float">浮点数</Option>
                                <Option value="string">字符串</Option>
                                <Option value="bool">布尔值</Option>
                                <Option value="enum">枚举</Option>
                                <Option value="array">数组</Option>
                                <Option value="object">对象</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="访问模式">
                              <Select 
                                value={prop.accessMode} 
                                onChange={(value) => updateProperty(index, 'accessMode', value)}
                                style={{ width: '100%' }}
                              >
                                <Option value="r">只读</Option>
                                <Option value="w">只写</Option>
                                <Option value="rw">读写</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Row gutter={16}>
                          <Col span={6}>
                            <Form.Item label="是否必填">
                              <Switch 
                                checked={prop.required} 
                                onChange={(checked) => updateProperty(index, 'required', checked)} 
                              />
                            </Form.Item>
                          </Col>
                          {prop.dataType.type === 'int' || prop.dataType.type === 'float' ? (
                            <>
                              <Col span={6}>
                                <Form.Item label="最小值">
                                  <InputNumber 
                                    value={prop.dataType.specs?.min} 
                                    onChange={(value) => updateProperty(index, 'dataType.specs.min', value)} 
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="最大值">
                                  <InputNumber 
                                    value={prop.dataType.specs?.max} 
                                    onChange={(value) => updateProperty(index, 'dataType.specs.max', value)} 
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item label="单位">
                                  <Input 
                                    placeholder="单位" 
                                    value={prop.dataType.specs?.unit || ''} 
                                    onChange={(e) => updateProperty(index, 'dataType.specs.unit', e.target.value)} 
                                  />
                                </Form.Item>
                              </Col>
                            </>
                          ) : prop.dataType.type === 'string' ? (
                            <Col span={6}>
                              <Form.Item label="最大长度">
                                <InputNumber 
                                  value={prop.dataType.specs?.length} 
                                  onChange={(value) => updateProperty(index, 'dataType.specs.length', value)} 
                                  style={{ width: '100%' }}
                                  min={1}
                                />
                              </Form.Item>
                            </Col>
                          ) : null}
                        </Row>
                      </Card>
                    ))}
                  </Space>
                )}
              </TabPane>
              
              <TabPane tab={`服务 (${model.services.length})`} key="services">
                <Button 
                  type="dashed" 
                  onClick={addService} 
                  icon={<PlusOutlined />} 
                  style={{ marginBottom: 16 }}
                >
                  添加服务
                </Button>
                
                {model.services.length === 0 ? (
                  <Empty description="暂无服务，请点击上方按钮添加" />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    {model.services.map((service, index) => (
                      <Card 
                        key={index} 
                        size="small" 
                        title={
                          <Space>
                            <Text strong>服务 {index + 1}</Text>
                            <Tag color={service.callType === 'sync' ? 'blue' : 'green'}>
                              {service.callType === 'sync' ? '同步' : '异步'}
                            </Tag>
                          </Space>
                        }
                        extra={
                          <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => removeService(index)} />
                        }
                      >
                        {validationErrors[`service_${index}`] && (
                          <Alert
                            message="验证错误"
                            description={
                              <ul style={{ margin: '4px 0 0 20px' }}>
                                {validationErrors[`service_${index}`].map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                        )}
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="服务标识符" required>
                              <Input 
                                placeholder="服务标识符" 
                                value={service.identifier} 
                                onChange={(e) => updateService(index, 'identifier', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="服务名称" required>
                              <Input 
                                placeholder="服务名称" 
                                value={service.name} 
                                onChange={(e) => updateService(index, 'name', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Form.Item label="服务描述">
                          <Input 
                            placeholder="服务描述" 
                            value={service.description} 
                            onChange={(e) => updateService(index, 'description', e.target.value)} 
                          />
                        </Form.Item>
                        
                        <Form.Item label="调用类型">
                          <Select 
                            value={service.callType} 
                            onChange={(value) => updateService(index, 'callType', value)}
                            style={{ width: '100%' }}
                          >
                            <Option value="sync">同步</Option>
                            <Option value="async">异步</Option>
                          </Select>
                        </Form.Item>
                      </Card>
                    ))}
                  </Space>
                )}
              </TabPane>
              
              <TabPane tab={`事件 (${model.events.length})`} key="events">
                <Button 
                  type="dashed" 
                  onClick={addEvent} 
                  icon={<PlusOutlined />} 
                  style={{ marginBottom: 16 }}
                >
                  添加事件
                </Button>
                
                {model.events.length === 0 ? (
                  <Empty description="暂无事件，请点击上方按钮添加" />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size={16}>
                    {model.events.map((event, index) => (
                      <Card 
                        key={index} 
                        size="small" 
                        title={
                          <Space>
                            <Text strong>事件 {index + 1}</Text>
                            <Tag color="blue">{event.type}</Tag>
                          </Space>
                        }
                        extra={
                          <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => removeEvent(index)} />
                        }
                      >
                        {validationErrors[`event_${index}`] && (
                          <Alert
                            message="验证错误"
                            description={
                              <ul style={{ margin: '4px 0 0 20px' }}>
                                {validationErrors[`event_${index}`].map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            }
                            type="error"
                            showIcon
                            style={{ marginBottom: 16 }}
                          />
                        )}
                        
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item label="事件标识符" required>
                              <Input 
                                placeholder="事件标识符" 
                                value={event.identifier} 
                                onChange={(e) => updateEvent(index, 'identifier', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="事件名称" required>
                              <Input 
                                placeholder="事件名称" 
                                value={event.name} 
                                onChange={(e) => updateEvent(index, 'name', e.target.value)} 
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        
                        <Form.Item label="事件描述">
                          <Input 
                            placeholder="事件描述" 
                            value={event.description} 
                            onChange={(e) => updateEvent(index, 'description', e.target.value)} 
                          />
                        </Form.Item>
                        
                        <Form.Item label="事件类型">
                          <Select 
                            value={event.type} 
                            onChange={(value) => updateEvent(index, 'type', value)}
                            style={{ width: '100%' }}
                          >
                            <Option value="info">信息</Option>
                            <Option value="alert">告警</Option>
                            <Option value="error">错误</Option>
                          </Select>
                        </Form.Item>
                      </Card>
                    ))}
                  </Space>
                )}
              </TabPane>
              
              <TabPane tab="数据可视化" key="visualization">
                {mockData.length === 0 ? (
                  <Empty description="暂无遥测数据，请先添加遥测类型的属性" />
                ) : (
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Card title="模拟数据趋势图">
                        <Line
                          data={mockData}
                          xField="time"
                          yField="value"
                          seriesField="property"
                          smooth={true}
                          animation={{
                            appear: {
                              animation: 'path-in',
                              duration: 1000,
                            },
                          }}
                          point={{
                            size: 3,
                            shape: 'circle',
                          }}
                          tooltip={{
                            formatter: (data) => {
                              return {
                                name: data.property,
                                value: data.value,
                              };
                            },
                          }}
                        />
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card title="属性分布">
                        <Column
                          data={mockData}
                          xField="property"
                          yField="value"
                          seriesField="property"
                          legend={{
                            position: 'top',
                          }}
                          meta={{
                            value: {
                              alias: '数值',
                            },
                            property: {
                              alias: '属性',
                            },
                          }}
                        />
                      </Card>
                    </Col>
                  </Row>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="物模型预览"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button key="copy" type="primary" onClick={copyToClipboard}>
            复制到剪贴板
          </Button>,
        ]}
        width={800}
      >
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '4px', 
          maxHeight: '500px', 
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {JSON.stringify(model, null, 2)}
        </pre>
      </Modal>
    </div>
  )
}
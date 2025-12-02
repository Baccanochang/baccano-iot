import { withTheme, Form } from '@rjsf/antd'
import { Card, Space, Typography } from 'antd'
import { useState } from 'react'

const Theme = withTheme({ templates: {}, widgets: {} } as any)

const schema = {
  type: 'object',
  properties: {
    schemaVersion: { type: 'string', default: '1.0' },
    properties: { type: 'array', items: { type: 'object', properties: {
      identifier: { type: 'string' }, name: { type: 'string' }, category: { type: 'string', enum: ['telemetry','attribute','event'] },
      dataType: { type: 'object', properties: { type: { type: 'string', enum: ['int','float','string','bool'] }, specs: { type: 'object' } } }
    } } },
    services: { type: 'array', items: { type: 'object', properties: {
      identifier: { type: 'string' }, name: { type: 'string' }, callType: { type: 'string', enum: ['sync','async'] },
      inputData: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, name: { type: 'string' }, dataType: { type: 'object', properties: { type: { type: 'string' } } } } } },
      outputData: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, name: { type: 'string' }, dataType: { type: 'object', properties: { type: { type: 'string' } } } } } }
    } } },
    events: { type: 'array', items: { type: 'object', properties: {
      identifier: { type: 'string' }, name: { type: 'string' }, type: { type: 'string' }, outputData: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, name: { type: 'string' }, dataType: { type: 'object', properties: { type: { type: 'string' } } } } } }
    } } }
  }
}

export default function ThingModelEditor() {
  const [model, setModel] = useState<any>({ schemaVersion: '1.0', properties: [], services: [], events: [] })
  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Card title="物模型编辑器">
        <Theme>
          <Form schema={schema as any} formData={model} onChange={(e: any) => setModel(e.formData)} onSubmit={() => {}} />
        </Theme>
      </Card>
      <Card title="实时预览">
        <Typography.Paragraph>{JSON.stringify(model)}</Typography.Paragraph>
      </Card>
    </Space>
  )
}


import { Card } from 'antd'
export default function Page({ title, children }: { title: string; children: any }) { return <Card title={title}>{children}</Card> }


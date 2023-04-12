import { ErrorBlock } from 'antd-mobile'
import { PageHeader } from '@components/common/PageHeader'
export default function Page403() {
  return (
    <div>
      <PageHeader title="遇到无权限访问点错误" />
      <ErrorBlock
        status="empty"
        fullPage
        title={<div>没有权限访问，请联系系统管理员</div>}
        description={<div>错误代码403</div>}
      />
    </div>
  )
}

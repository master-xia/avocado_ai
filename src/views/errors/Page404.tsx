import { ErrorBlock } from 'antd-mobile'
import { PageHeader } from '@components/common/PageHeader'
export default function Page404() {
  return (
    <div>
      <PageHeader title="404" />
      <ErrorBlock
        status="empty"
        fullPage
        title={<div>真的很抱歉，我们搞丢了页面...</div>}
        description={<div>错误代码404</div>}
      />
    </div>
  )
}

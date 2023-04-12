import { PageHeader } from '@components/common/PageHeader'
import { isWxEnv } from '@utils/common'

export default function ContactMe() {
  return (
    <>
      <PageHeader title="宝比特-贵金属珠宝ERP系统" />
      <iframe
        src="https://pc.baobte.com"
        style={{
          border: 'none',
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          width: '100%',
        }}
        title="宝比特"
      ></iframe>
    </>
  )
}

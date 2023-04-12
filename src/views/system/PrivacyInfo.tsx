import { PageHeader } from '@components/common/PageHeader'
import { isWxEnv } from '@utils/common'

export default function PrivacyInfo() {
  return (
    <>
      <PageHeader title="服务条款与隐私协议" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
        }}
      >
        <iframe
          src="/privacy.html"
          title="服务条款与隐私协议"
          style={{ height: '100%', border: 'none', width: '100%' }}
        />
      </div>
    </>
  )
}

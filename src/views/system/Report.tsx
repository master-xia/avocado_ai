import { PageHeader } from '@components/common/PageHeader'
import { isWxEnv } from '@utils/common'

export default function Report() {
  return (
    <>
      <PageHeader title="反馈" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 40px)`,
          overflow: 'auto',
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
          <div>
            <img
              src="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/Images/contactQrCode.jpeg?x-oss-process=style/jmms"
              alt="微信二维码"
              style={{ height: 200 }}
            />
          </div>
        </div>
        <div>请您新增微信反馈您遇到的问题或改进建议</div>
        <div>
          1、如使用遇到问题，包括但不限于数据展示错误、系统卡死、操作提示错误等，请详细描述问题。
        </div>
        <div>2、如需要提供改进建议，请详细描述如何改进。</div>
      </div>
    </>
  )
}

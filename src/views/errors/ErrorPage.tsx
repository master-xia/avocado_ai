import { ErrorBlock } from 'antd-mobile'
import { PageHeader } from '@components/common/PageHeader'
import { useRouteError } from 'react-router-dom'
export default function ErrorPage() {
  let errorData = useRouteError() as any
  let errorMsg = errorData.errorMsg || errorData.Message || errorData
  //返回数据检验的错误信息
  let validationErrors = Array<string>()
  if (errorData.Data && errorData.Data.errors) {
    const tmp = errorData.Data.errors
    for (var key in tmp) {
      validationErrors.push(`${key}:${tmp[key]}`)
    }
  }
  return (
    <div>
      <PageHeader title="遇到点错误" />
      <ErrorBlock
        status="default"
        fullPage
        style={{ paddingTop: '100px' }}
        title={<div>操作遇到一些小问题</div>}
        description={
          <>
            <div>请截图联系管理员</div>
            <div style={{ textAlign: 'left', padding: '0 20px' }}>
              <div style={{ color: 'red' }}>{errorMsg}</div>
              {validationErrors.length !== 0 && (
                <>
                  <div>
                    <div>数据验证失败详情</div>
                    <div style={{ color: 'red' }}>
                      {validationErrors.map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        }
      />
    </div>
  )
}

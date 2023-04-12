import { getNoWatermarkContentInfoVM } from '@api/cmmon'
import { PageHeader } from '@components/common/PageHeader'
import { copyText, errorMsg, isWxEnv } from '@utils/common'
import { Avatar, Form } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function NoWatermarkDetail() {
  var contentId = useParams()['contentId']
  const [contentInfo, setContentInfo] = useState<NoWatermarkContentInfoVM>()
  function loadData() {
    getNoWatermarkContentInfoVM(contentId!)
      .then((res) => {
        if (res.IsSuccess) {
          setContentInfo(res.Result)
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <>
      <PageHeader title={'解析结果'} />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
        }}
      >
        <Form>
          {contentInfo?.ContentUrl && (
            <Form.Item
              label="无水印视频链接"
              description="请复制到浏览器打开"
              extra={
                <span
                  className="iconfont icon-fuzhi"
                  style={{
                    color: 'var(--adm-color-primary)',
                    display: 'flex',
                    alignSelf: 'center',
                  }}
                  onClick={() => {
                    copyText(contentInfo?.ContentUrl ?? '')
                  }}
                ></span>
              }
            >
              <div style={{ wordBreak: 'break-all' }}>
                {contentInfo?.ContentUrl}
              </div>
            </Form.Item>
          )}
          <Form.Item label="内容封面">
            <img src={contentInfo?.Img} alt="" style={{ width: '100%' }} />
          </Form.Item>
          {contentInfo?.Pics && contentInfo.Pics && (
            <Form.Item label="无水印图集">
              {contentInfo.Pics.map((m) => (
                <img src={m} alt="" style={{ width: '100%' }} key={m} />
              ))}
            </Form.Item>
          )}
        </Form>
      </div>
    </>
  )
}

import { getContentWithoutWatermark } from '@api/cmmon'
import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, TextArea } from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
export default function NoWatermark() {
  const formRef = useRef<FormInstance>(null)
  const navigate = useNavigate()
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  function onSubmit() {
    var content = formRef.current?.getFieldValue('Content')
    if (!content || content.trim().length === 0) {
      errorMsg('内容不能为空')
      return
    }
    Dialog.confirm({
      title: '提示',
      content: (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span>需消耗</span>
            <span>{avocadoInfo?.GetContentWithoutWatermark}</span>
            <Avocado />
            <span>，是否提取无水印内容？</span>
          </div>
        </>
      ),
      onConfirm: () => {
        getContentWithoutWatermark({
          Content: content,
        })
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('解析成功')
              window.setTimeout(() => {
                navigate('/noWatermark/detail/' + res.Result)
              }, 500)
            } else {
              if (res.Code !== 40001) {
                errorMsg(res.Message)
              }
            }
          })
          .catch(() => {
            errorMsg('网络异常')
          })
      },
    })
  }
  return (
    <>
      <PageHeader title={'无水印下载'} />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
        }}
      >
        <Form ref={formRef}>
          <Form.Item name={'Content'} label="分享文案/链接">
            <TextArea
              placeholder="平台视频分享文案（包含分享链接）"
              maxLength={200}
              rows={5}
              showCount
            ></TextArea>
          </Form.Item>
        </Form>
        <div style={{ color: '#999', marginTop: 10, padding: 10 }}>
          抖音 快手 小红书 微博 微视 皮皮虾 陌陌 唱吧 西瓜视频 今日头条 好看视频
          全民小视频 看点视频 趣头条 全民K歌 酷狗音乐 酷我音乐 看看视频 梨视频
          哔哩哔哩 网易云音乐 看点视频 QQ看点 小咖秀 看点快报 糖豆 配音秀
          大众点评 懂车帝 火山 皮皮搞笑 最左 小影 火山小视频 轻视频 百度视频
          新片场 迅雷 美图秀秀 秒拍 美拍 刷宝 剪影 京东 淘宝 天猫 微信公众号
          虎牙视频 uc浏览器 QQ浏览器 oppo浏览器 油果浏览器 万能钥匙WiFi 知乎
          腾讯新闻 人民日报 开眼 微叭 微云 快看点 彩视 TikTok youtube twitter
          VUE vigo ACfun yy now 等等200多个短视频平台。如果遇到提取失败请
          <span
            style={{ color: 'var(--adm-color-primary)', marginLeft: '' }}
            onClick={() => {
              navigate('/system/report')
            }}
          >
            联系我们
          </span>
        </div>
        <div style={{ padding: 10 }}>
          <Button
            block
            shape="rounded"
            color="primary"
            style={{ marginTop: 30 }}
            onClick={onSubmit}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>提取无水印内容，需消耗</span>
              <span>{avocadoInfo?.GetContentWithoutWatermark}</span>
              <Avocado />
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}

import { getUserInfo } from '@api/user'
import { PageHeader } from '@components/common/PageHeader'
import { copyText, errorMsg, isWxEnv } from '@utils/common'
import { Form } from 'antd-mobile'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode.react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import Avocado from '@components/common/Avocado'
export default function UserIndex() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfoVM>()
  const [rewardCount, setRewardCount] = useState(0)
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  function refresh(): Promise<void> {
    return new Promise((resolove, reject) => {
      getUserInfo(false)
        .then((res) => {
          if (res.IsSuccess) {
            setUserInfo(res.Result)
            resolove()
          } else {
            reject()
            errorMsg(res.Message)
          }
        })
        .catch(() => {
          reject()
        })
    })
  }
  function copyInviteUrl() {
    copyText(window.location.origin + '/' + userInfo?.InviteCode ?? '')
  }
  useEffect(() => {
    refresh()
  }, [])

  return (
    <>
      <PageHeader title="邀请用户" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
        }}
      >
        <div>
          <Form>
            <Form.Item label="每个用户奖励">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {avocadoInfo?.InviteUserGet}
                <Avocado />
              </div>
            </Form.Item>
            <Form.Item label="共邀请人数">
              {userInfo ? userInfo.InviteCount : '-'}
            </Form.Item>
            <Form.Item
              label="邀请链接"
              extra={
                <span
                  className="iconfont icon-fuzhi"
                  style={{ color: 'var(--adm-color-primary)' }}
                  onClick={copyInviteUrl}
                ></span>
              }
            >
              <span style={{ wordBreak: 'break-all' }}>
                {userInfo
                  ? window.location.origin + '/' + userInfo.InviteCode
                  : '-'}
              </span>
            </Form.Item>
            <Form.Item label="长按保存邀请二维码">
              {userInfo && (
                <QRCode
                  value={window.location.origin + '/' + userInfo.InviteCode} // 生成二维码的内容
                  size={200} // 二维码的大小
                  fgColor="#000000" // 二维码的颜色
                  imageSettings={{
                    src: 'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/chatgpt.png?x-oss-process=style/jmms',
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              )}
            </Form.Item>
            {rewardCount > 0 && (
              <>
                <Form.Item label="提示">
                  <div>每邀请一个用户可获得{rewardCount}次免费次数</div>
                  <div>用户完成认证后次数自动到账</div>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  )
}

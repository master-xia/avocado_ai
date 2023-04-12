import { getUserInfo } from '@api/user'
import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { copyText, errorMsg, formatDate, isWxEnv } from '@utils/common'

import { Avatar, Form } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Info() {
  const [userInfo, setUserInfo] = useState<UserInfoVM>()
  function loadData() {
    getUserInfo(false).then((res) => {
      if (res.IsSuccess && res.Result) {
        setUserInfo(res.Result)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  const navigate = useNavigate()
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="我的信息" />
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
            overflow: 'auto',
          }}
        >
          <Form layout="horizontal">
            <Form.Header>基础信息</Form.Header>
            <Form.Item label=" ">
              <Avatar
                src={userInfo?.Header ?? ''}
                style={{
                  '--border-radius': '50%',
                  '--size': '60px',
                  padding: 10,
                }}
              />
            </Form.Item>
            <Form.Item label="名称">{userInfo?.Name ?? ' '}</Form.Item>
            <Form.Item label="用户名">{userInfo?.UserName ?? ' '}</Form.Item>
            <Form.Item label="剩余" extra={<Avocado />}>
              {userInfo ? parseFloat(userInfo.RemainCount.toFixed(2)) : ''}
            </Form.Item>
            <Form.Item label="共使用" extra={<Avocado />}>
              {userInfo ? parseFloat(userInfo.UsedCount.toFixed(2)) : ''}
            </Form.Item>
            <Form.Item label="共邀请" extra="人">
              {userInfo?.InviteCount}
            </Form.Item>
            <Form.Item
              label="邀请码"
              extra={
                <span
                  className="iconfont icon-fuzhi"
                  style={{ color: 'var(--adm-color-primary)' }}
                  onClick={() => {
                    copyText(userInfo?.InviteCode ?? '')
                  }}
                ></span>
              }
            >
              {userInfo?.InviteCode}
            </Form.Item>
            <Form.Header>安全信息</Form.Header>
            <Form.Item
              label="绑定手机"
              extra={
                !userInfo?.PhoneStatus && (
                  <span
                    style={{ color: 'var(--adm-color-primary)' }}
                    onClick={() => {
                      navigate('/user/verify/phone')
                    }}
                  >
                    立即绑定
                  </span>
                )
              }
            >
              {userInfo?.PhoneMask}
            </Form.Item>
            <Form.Item label="绑定邮箱">{'暂时不可绑定'}</Form.Item>
            <Form.Item label="最后登录">
              {userInfo?.LastLogin ? formatDate(userInfo.LastLogin) : ''}
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

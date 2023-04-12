import { getVerifyPhoneRewardCount } from '@api/cmmon'
import { getUserInfo, getVerifyPhoneCode, verifyPhone } from '@api/user'
import { PageHeader } from '@components/common/PageHeader'
import GraphicValidate, {
  IGraphicVaidateRef,
} from '@components/validate/GraphicValidate'
import { logout } from '@utils/auth'
import { copyText, errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, Input } from 'antd-mobile'
import { FormInstance } from 'rc-field-form'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function VerifyPhone() {
  const navigate = useNavigate()
  useEffect(() => {}, [])
  const formRef = useRef<FormInstance>(null)
  const codeRef = useRef<IGraphicVaidateRef>(null)
  const [smsCodeRemainSeconds, setSmsCodeRemainSeconds] = useState<number>(0)
  const localKey = 'smsCode'
  const [rewardCount, setRewardCount] = useState(0)
  useEffect(() => {
    check()
    getVerifyPhoneRewardCount().then((res) => {
      if (res.IsSuccess) {
        setRewardCount(parseInt(res.Result!))
      }
    })
    getUserInfo().then((res) => {
      if (res.IsSuccess) {
        const userInfo = res.Result
        if (userInfo?.PhoneStatus) {
          Dialog.alert({
            content: '已验证通过，无需重复操作',
            title: '提示',
            onClose: () => {
              navigate(-1)
            },
          })
        }
      }
    })
  }, [])
  function check() {
    let lastTime = 0
    if (localStorage.getItem(localKey)) {
      lastTime = parseInt(localStorage.getItem(localKey)!)
    }
    if (lastTime && lastTime - new Date().getTime() > 0) {
      setSmsCodeRemainSeconds(
        Math.round((lastTime - new Date().getTime()) / 1000)
      )
      const tmp = setInterval(() => {
        let val = Math.max(
          0,
          Math.round((lastTime - new Date().getTime()) / 1000)
        )
        setSmsCodeRemainSeconds(val)
        if (val === 0) {
          clearInterval(tmp)
        }
      }, 1000)
    }
  }
  function sendCode(token: string) {
    let phone = formRef.current?.getFieldValue('Phone')
    getVerifyPhoneCode({
      Phone: phone,
      Token: token,
    }).then((res) => {
      if (res.IsSuccess) {
        successMsg('发送成功')
        localStorage.setItem(
          localKey,
          (new Date().getTime() + 60 * 1000).toString()
        )
        check()
      } else {
        errorMsg(res.Message)
      }
    })
  }
  function validate() {
    let phone = formRef.current?.getFieldValue('Phone')
    let msg = ''
    if (!phone) {
      msg = '请输入手机号'
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      msg = '手机号不合法'
    }
    if (msg) {
      errorMsg(msg)
    } else {
      codeRef.current?.show()
    }
  }
  function verify(values: BindPhoneVM) {
    let msg = ''
    if (!values.Phone) {
      msg = '请输入手机号'
    } else if (!/^1[3-9]\d{9}$/.test(values.Phone)) {
      msg = '手机号不合法'
    } else if (!values.Code) {
      msg = '请输入短信验证码'
    } else if (!/^\d{4,8}$/.test(values.Code)) {
      msg = '验证码错误'
    }
    if (msg) {
      errorMsg(msg)
    } else {
      verifyPhone(values).then((res) => {
        if (res.IsSuccess) {
          successMsg('验证成功')
          window.setTimeout(() => {
            logout()
          }, 500)
        } else {
          errorMsg(res.Message)
        }
      })
    }
  }
  return (
    <>
      <PageHeader title="验证手机号" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
          backgroundColor: 'white',
        }}
      >
        <div style={{ padding: 20 }}>
          <Form
            style={{ '--border-top': 'none' }}
            layout="vertical"
            requiredMarkStyle="none"
            ref={formRef}
            onFinish={verify}
          >
            <Form.Item name="Phone" label="手机号" initialValue={''}>
              <Input
                placeholder="请输入手机号"
                clearable
                autoComplete="new-password"
              />
            </Form.Item>
            <Form.Item
              name="Code"
              label="短信验证码"
              extra={
                smsCodeRemainSeconds === 0 ? (
                  <span
                    style={{ color: 'var(--adm-color-primary)' }}
                    onClick={validate}
                  >
                    发送验证码
                  </span>
                ) : (
                  <span style={{ color: 'var(--adm-color-text)' }}>
                    {smsCodeRemainSeconds}秒后重试
                  </span>
                )
              }
            >
              <Input
                placeholder="请输入短信验证码"
                clearable
                autoComplete="new-password"
              />
            </Form.Item>
            {rewardCount > 0 && (
              <>
                <Form.Item label="提示">
                  <div>
                    用户完成认证后才可使用系统全部功能，并可获取免费次数
                    {rewardCount}次
                  </div>
                </Form.Item>
              </>
            )}

            <div
              style={{
                display: 'flex',
                borderTop: '1px solid #eee',
                padding: '20px 10px',
              }}
            ></div>

            <Button
              block
              type="submit"
              shape="rounded"
              color="primary"
              style={{ marginTop: 30 }}
            >
              提交验证
            </Button>
          </Form>
          <GraphicValidate
            ref={codeRef}
            success={(token) => {
              sendCode(token)
            }}
          />
        </div>
      </div>
    </>
  )
}

import { getVerifyPhoneRewardCount } from '@api/cmmon'
import {
  forgotPwd,
  getForgotPwdSmsCode,
  getUserInfo,
  getVerifyPhoneCode,
  verifyPhone,
} from '@api/user'
import { PageHeader } from '@components/common/PageHeader'
import GraphicValidate, {
  IGraphicVaidateRef,
} from '@components/validate/GraphicValidate'
import { useAppSelector } from '@store/hooks'
import { logout } from '@utils/auth'
import { copyText, errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, Input } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { FormInstance } from 'rc-field-form'

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function VerifyPhone() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfoVM>()
  useEffect(() => {}, [])
  const formRef = useRef<FormInstance>(null)
  const codeRef = useRef<IGraphicVaidateRef>(null)
  const [smsCodeRemainSeconds, setSmsCodeRemainSeconds] = useState<number>(0)
  const localKey = 'smsCode'
  const loginStatus = useAppSelector((state) => state.auth.loginStatus)

  useEffect(() => {
    check()
    if (loginStatus) {
      getUserInfo().then((res) => {
        if (res.IsSuccess) {
          const userInfo = res.Result
          setUserInfo(userInfo)
          if (!userInfo?.PhoneStatus) {
            Dialog.alert({
              content: '未绑定手机号，无法找回密码',
              title: '提示',
              onClose: () => {
                navigate(-1)
              },
            })
          }
        }
      })
    }
  }, [loginStatus])
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
    getForgotPwdSmsCode({
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
  function verify(values: any) {
    let message = ''
    if (!values.Phone) {
      message = '请输入手机号'
    } else if (!/^1[3-9]\d{9}$/.test(values.Phone)) {
      message = '手机号不合法'
    } else if (!values.Code) {
      message = '请输入短信验证码'
    } else if (!/^\d{4,8}$/.test(values.Code)) {
      message = '验证码错误'
    } else if (!values.Pwd || values.Pwd.length === 0) {
      message = '请输入新密码'
    } else if (values.Pwd.length < 8) {
      message = '新密码最少8位'
    } else if (values.Pwd.length > 32) {
      message = '新密码最多32位'
    } else if (!values.Pwd2 || values.Pwd2.length === 0) {
      message = '请确认密码'
    } else if (values.Pwd !== values.Pwd2) {
      message = '两次密码不相同'
    }
    if (message) {
      errorMsg(message)
    } else {
      forgotPwd({
        Code: values.Code,
        NewPwd: values.Pwd,
        Phone: values.Phone,
      }).then((res) => {
        if (res.IsSuccess) {
          successMsg('找回密码成功')
          window.setTimeout(() => {
            logout()
          }, 500)
        } else {
          errorMsg(res.Message)
        }
      })
    }
  }
  const [visible, setVisible] = useState(false)
  return (
    <>
      <PageHeader title="找回密码" />
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
            {loginStatus ? (
              <>
                <Form.Item label="手机号">
                  {userInfo?.PhoneMask ?? ' '}
                </Form.Item>
                <Form.Item name="Phone" hidden initialValue={'18600000000'}>
                  <Input />
                </Form.Item>
              </>
            ) : (
              <Form.Item name="Phone" label="手机号" initialValue={''}>
                <Input
                  placeholder="请输入手机号"
                  clearable
                  autoComplete="new-password"
                />
              </Form.Item>
            )}

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
            <Form.Item
              name="Pwd"
              extra={
                <div className="eye">
                  {!visible ? (
                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                  ) : (
                    <EyeOutline onClick={() => setVisible(false)} />
                  )}
                </div>
              }
              label="新密码"
            >
              <Input
                placeholder="请输入密码"
                clearable
                type={visible ? 'text' : 'password'}
              />
            </Form.Item>
            <Form.Item
              name="Pwd2"
              extra={
                <div className="eye">
                  {!visible ? (
                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                  ) : (
                    <EyeOutline onClick={() => setVisible(false)} />
                  )}
                </div>
              }
              label="确认密码"
            >
              <Input
                placeholder="请确认密码"
                clearable
                type={visible ? 'text' : 'password'}
              />
            </Form.Item>
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
              确认找回
            </Button>
          </Form>
          <GraphicValidate
            ref={codeRef}
            success={(token) => {
              sendCode(token)
            }}
          />
        </div>
        <style>
          {`
          .extraPart {
            border-left: solid 1px #eeeeee;
            padding-left: 12px;
            font-size: 17px;
            line-height: 22px;
          }
          .eye {
            padding: 4px;
            cursor: pointer;
            svg {
              display: block;
              font-size: var(--adm-font-size-7);
            }
          }
          `}
        </style>
      </div>
    </>
  )
}

import { Form, Input, Button, Dialog } from 'antd-mobile'
import { register } from '@api/user'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@components/common/PageHeader'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import GraphicValidate, {
  IGraphicVaidateRef,
} from '@components/validate/GraphicValidate'
import { FormInstance } from 'antd-mobile/es/components/form'
export default function Register() {
  let navigation = useNavigate()
  const codeRef = useRef<IGraphicVaidateRef>(null)
  const formRef = useRef<FormInstance>(null)
  function doRegister(values: RegisterVM) {
    //进行验证
    let message = ''
    if (!values.UserName || values.UserName.trim().length === 0) {
      message = '请输入用户名'
    } else if (values.UserName.trim().length > 30) {
      message = '用户名最多30位'
    } else if (!values.Pwd || values.Pwd.length === 0) {
      message = '请输入密码'
    } else if (values.Pwd.length < 8) {
      message = '密码最少8位'
    } else if (values.Pwd.length > 32) {
      message = '密码最多32位'
    } else if (!values.Pwd2 || values.Pwd2.length === 0) {
      message = '请确认密码'
    } else if (values.Pwd !== values.Pwd2) {
      message = '两次密码不相同'
    } else if (values.ReferCode && !/^[A-Za-z0-9]{8}$/.test(values.ReferCode)) {
      message = '推荐码不合法'
    }
    if (message) {
      Dialog.alert({
        title: '提示',
        content: message,
        closeOnMaskClick: true,
      })
    } else {
      codeRef.current?.show()
    }
  }
  function doAction(token: string) {
    let values = formRef.current?.getFieldsValue()
    values.UserName = values.UserName.trim()
    register({ ...values, Token: token }).then((res) => {
      if (res.IsSuccess) {
        successMsg('注册成功')
        localStorage.removeItem('referCode')
        window.setTimeout(() => {
          navigation('/user/login', { replace: true })
        }, 500)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  useEffect(() => {
    let referCode = localStorage.getItem('referCode')
    if (referCode) {
      formRef.current?.setFieldValue('ReferCode', referCode)
    }
  }, [])
  const [visible, setVisible] = useState(false)
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="" />
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
            overflow: 'auto',
          }}
        >
          <div style={{ padding: 20 }}>
            <div
              style={{
                fontSize: 25,
                fontWeight: 500,
                marginTop: 30,
                textAlign: 'center',
              }}
            >
              注册
            </div>
            <div
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: 'var(--adm-color-text-secondary)',
                marginBottom: 50,
                marginTop: 20,
              }}
            >
              欢迎注册智问平台
            </div>
            <Form
              ref={formRef}
              onFinish={doRegister}
              style={{ '--border-top': 'none' }}
              layout="vertical"
              requiredMarkStyle="none"
            >
              <Form.Item name="UserName" label="用户名">
                <Input
                  placeholder="请输入用户名"
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
                label="密码"
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
              <Form.Item name="ReferCode" label="推荐码">
                <Input placeholder="请输入推荐码（非必填）" clearable />
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
                注册账号
              </Button>
            </Form>
          </div>

          <div
            style={{
              position: 'fixed',
              bottom: 100,
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'var(--adm-color-text)',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              已经有账号了？
              <span
                style={{ color: 'var(--adm-color-primary)' }}
                onClick={() => {
                  navigation('/user/login', { replace: true })
                }}
              >
                立即登录
              </span>
            </div>
          </div>
        </div>
      </div>
      <GraphicValidate
        ref={codeRef}
        success={(token) => {
          doAction(token)
        }}
      />
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
    </>
  )
}

import { Form, Input, Button, Dialog } from 'antd-mobile'
import { changePwd, register } from '@api/user'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PageHeader } from '@components/common/PageHeader'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { logout } from '@utils/auth'
export default function Register() {
  let navigation = useNavigate()

  function doRegister(values: any) {
    console.log(values)
    //进行验证
    let message = ''
    if (!values.OldPwd || values.OldPwd.length === 0) {
      message = '请输入旧密码'
    } else if (values.OldPwd.length < 8) {
      message = '旧密码最少8位'
    } else if (values.OldPwd.length > 32) {
      message = '旧密码最多32位'
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
    } else if (values.OldPwd === values.Pwd2) {
      message = '新旧密码不能相同'
    }
    if (message) {
      Dialog.alert({
        title: '提示',
        content: message,
        closeOnMaskClick: true,
      })
    } else {
      changePwd({
        OldPwd: values.OldPwd,
        NewPwd: values.Pwd,
      }).then((res) => {
        if (res.IsSuccess) {
          successMsg('修改密码成功')
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
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="修改密码" />
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
            overflow: 'auto',
          }}
        >
          <div style={{ padding: 20 }}>
            <Form
              onFinish={doRegister}
              style={{ '--border-top': 'none' }}
              layout="vertical"
              requiredMarkStyle="none"
            >
              <Form.Item
                name="OldPwd"
                extra={
                  <div className="eye">
                    {!visible ? (
                      <EyeInvisibleOutline onClick={() => setVisible(true)} />
                    ) : (
                      <EyeOutline onClick={() => setVisible(false)} />
                    )}
                  </div>
                }
                label="旧密码"
              >
                <Input
                  placeholder="请输入密码"
                  clearable
                  type={visible ? 'text' : 'password'}
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
                确认修改
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
              不记得密码了？
              <span
                style={{ color: 'var(--adm-color-primary)' }}
                onClick={() => {
                  navigation('/user/forgotPwd', { replace: true })
                }}
              >
                找回密码
              </span>
            </div>
          </div>
        </div>
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
    </>
  )
}

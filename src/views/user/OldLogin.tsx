import { Form, Input, Button, Modal, Checkbox, Dialog } from 'antd-mobile'
import { login } from '@api/user'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { getToken } from '@utils/auth'
import { PageHeader } from '@components/common/PageHeader'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useAppDispatch } from '@store/hooks'
import { updateLoginStatus } from '@store/modules/auth'
import GraphicValidate, {
  IGraphicVaidateRef,
} from '@components/validate/GraphicValidate'
import { FormInstance } from 'antd-mobile/es/components/form'
export default function Login() {
  let navigation = useNavigate()
  const codeRef = useRef<IGraphicVaidateRef>(null)
  const formRef = useRef<FormInstance>(null)
  //是否展示隐私条款
  const [showPrivacyPanel, setShowPrivacyPanel] = useState(false)
  const [privacyStatus, setPrivacyStatus] = useState(false)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (localStorage.getItem('agreePrivacy') === '1') {
      setPrivacyStatus(true)
    } else {
      setShowPrivacyPanel(true)
    }
  }, [])
  function updatePrivacyStatus(status: boolean) {
    setPrivacyStatus(status)
    setShowPrivacyPanel(false)
    localStorage.setItem('agreePrivacy', status ? '1' : '0')
  }
  function doLogin(values: LoginVM) {
    if (!privacyStatus) {
      Dialog.alert({
        title: '提示',
        content: '请勾选同意牛油果AI服务条款与隐私协议',
      })
      return
    }
    //进行验证
    let message = ''
    if (!values.Account || values.Account.trim().length === 0) {
      message = '请输入账号'
    } else if (!values.Pwd || values.Pwd.length === 0) {
      message = '请输入密码'
    } else if (values.Pwd.length < 8) {
      message = '密码最少8位'
    } else if (values.Pwd.length > 32) {
      message = '密码最多32位'
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
    login({ ...values, Token: token }).then((res) => {
      if (res.IsSuccess) {
        successMsg('登录成功')
        dispatch(updateLoginStatus(true))
        window.setTimeout(() => {
          navigation(-1)
        }, 500)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Dialog
        title="服务条款与隐私协议"
        visible={showPrivacyPanel}
        style={{ padding: 0 }}
        content={
          <>
            <div>
              <iframe
                src="/privacy.html"
                title="服务条款与隐私协议"
                style={{
                  height: '50vh',
                  border: 'none',
                  width: '100%',
                }}
              />
            </div>
          </>
        }
        actions={[
          [
            {
              key: 'cancel',
              danger: true,
              text: '不同意',
              onClick: () => {
                updatePrivacyStatus(false)
              },
            },
            {
              key: 'confirm',
              text: '同意',
              onClick: () => {
                updatePrivacyStatus(true)
              },
            },
          ],
        ]}
      ></Dialog>
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
              登录
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
              未登录只能使用智问平台部分功能
            </div>
            <Form
              ref={formRef}
              onFinish={doLogin}
              style={{ '--border-top': 'none' }}
              layout="vertical"
              requiredMarkStyle="none"
            >
              <Form.Item name="Account" label="账号">
                <Input
                  placeholder="请输入手机号/用户名"
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

              <div
                style={{
                  display: 'flex',
                  borderTop: '1px solid #eee',
                  padding: '20px 10px',
                }}
              >
                <Checkbox
                  checked={privacyStatus}
                  onChange={(val) => {
                    updatePrivacyStatus(val)
                  }}
                  value="true"
                  style={{
                    '--icon-size': '18px',
                    '--font-size': '14px',
                    '--gap': '6px',
                  }}
                >
                  我同意智问
                </Checkbox>
                <span
                  style={{ fontSize: 14, color: 'dodgerblue', marginLeft: 4 }}
                  onClick={() => {
                    setShowPrivacyPanel(true)
                  }}
                >
                  服务条款与隐私协议
                </span>
              </div>
              <div
                style={{
                  color: 'var(--adm-color-text-secondary)',
                  fontSize: 14,
                  textAlign: 'right',
                }}
              ></div>
              <Button
                block
                type="submit"
                shape="rounded"
                color="primary"
                style={{ marginTop: 30 }}
              >
                登录
              </Button>
            </Form>
          </div>
          <div>
            <div
              style={{
                color: 'var(--adm-color-primary)',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              <span
                onClick={() => {
                  navigation('/user/forgotPwd')
                }}
              >
                忘记密码？
              </span>
            </div>
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
              没有账号？
              <span
                style={{ color: 'var(--adm-color-primary)' }}
                onClick={() => {
                  navigation('/user/register', { replace: true })
                }}
              >
                立即注册
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

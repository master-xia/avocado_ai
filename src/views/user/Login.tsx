import { Form, Input, Button, Modal, Checkbox, Dialog } from 'antd-mobile'
import { getLoginCode, login, phoneLogin } from '@api/user'
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
  const [smsCodeRemainSeconds, setSmsCodeRemainSeconds] = useState<number>(0)
  const localKey = 'smsCode'
  const [referCode, setReferCode] = useState('')
  const dispatch = useAppDispatch()
  useEffect(() => {
    check()
    if (localStorage.getItem('agreePrivacy') === '1') {
      setPrivacyStatus(true)
    } else {
      setShowPrivacyPanel(true)
    }
    setReferCode(localStorage.getItem('referCode') ?? '')
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
  function updatePrivacyStatus(status: boolean) {
    setPrivacyStatus(status)
    setShowPrivacyPanel(false)
    localStorage.setItem('agreePrivacy', status ? '1' : '0')
  }
  function onSubmit() {
    var values = formRef.current?.getFieldsValue()
    //进行验证
    let message = ''
    if (!values.Phone) {
      message = '请输入手机号'
    } else if (!/^1[3-9]\d{9}$/.test(values.Phone)) {
      message = '手机号不合法'
    } else if (!values.Code) {
      message = '请输验证码'
    } else if (!/^\d{4,8}$/.test(values.Code!)) {
      message = '验证码不合法'
    }
    if (!privacyStatus) {
      Dialog.alert({
        title: '提示',
        content: '请勾选同意牛油果AI服务条款与隐私协议',
      })
      return
    }
    if (message) {
      Dialog.alert({
        title: '提示',
        content: message,
        closeOnMaskClick: true,
      })
    } else {
      doAction()
    }
  }
  function validate() {
    let phone = formRef.current?.getFieldValue('Phone')
    let msg = ''
    if (!phone) {
      msg = '请输入手机号'
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      msg = '手机号不合法'
    }
    if (!privacyStatus) {
      Dialog.alert({
        title: '提示',
        content: '请勾选同意牛油果AI服务条款与隐私协议',
      })
      return
    }
    if (msg) {
      errorMsg(msg)
    } else {
      codeRef.current?.show()
    }
  }
  function doAction() {
    let values = formRef.current?.getFieldsValue()
    phoneLogin({ ...values, ReferCode: referCode }).then((res) => {
      if (res.IsSuccess) {
        successMsg('登录成功')
        window.setTimeout(() => {
          localStorage.removeItem('referCode')
          dispatch(updateLoginStatus(true))
          navigation(-1)
        }, 500)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  function sendCode(token: string) {
    let phone = formRef.current?.getFieldValue('Phone')
    getLoginCode({
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
          <div>
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
              未登录只能使用牛油果AI部分功能
            </div>
            <Form
              ref={formRef}
              style={{ '--border-top': 'none' }}
              layout="vertical"
              requiredMarkStyle="none"
            >
              <Form.Item name="Phone" label="手机号">
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
            </Form>
          </div>
          <div>
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
                我同意牛油果AI
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
            <div style={{ padding: 20 }}>
              <Button
                block
                shape="rounded"
                color="primary"
                onClick={onSubmit}
                style={{ marginTop: 30 }}
              >
                <div>登录</div>
              </Button>
            </div>
          </div>
          <div>
            <div
              style={{
                color: 'var(--adm-color-text-secondary)',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              <span>未注册的手机号将自动注册</span>
            </div>
          </div>
        </div>
      </div>
      <GraphicValidate ref={codeRef} success={sendCode} />
    </>
  )
}

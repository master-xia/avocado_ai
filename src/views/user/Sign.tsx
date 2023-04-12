import { Form, Input, Button, Dialog, TextArea, Result } from 'antd-mobile'
import { changePwd, register, signToday } from '@api/user'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import Avocado from '@components/common/Avocado'
import { FormInstance } from 'antd-mobile/es/components/form'
export default function Register() {
  let navigate = useNavigate()
  const userInfo = useAppSelector((state) => state.auth.userInfo)
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  const formRef = useRef<FormInstance>(null)
  function onSubmit() {
    const values = formRef.current?.getFieldsValue()
    if (!values.Note || values.Note.trim().length === 0) {
      errorMsg('说的什么东西再提交吧！')
    } else if (values.Note.trim().length < 3) {
      errorMsg('内容也太少了，最少说3个字吧！')
    } else {
      signToday(values).then((res) => {
        if (res.IsSuccess) {
          successMsg('签到成功')
          window.setTimeout(() => {
            navigate(-1)
          }, 500)
        } else {
          errorMsg(res.Message)
        }
      })
    }
  }
  return (
    <>
      <PageHeader title={'每日签到'} />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'hidden',
        }}
      >
        {userInfo?.IsSignToday && (
          <>
            <Result
              title="今天已经签到了，明天再来吧！"
              style={{ height: '100vh' }}
            />
          </>
        )}
        {!userInfo?.IsSignToday && (
          <>
            <div style={{ padding: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                每日签到可获得 {avocadoInfo?.SignGet}
                <Avocado />
              </div>
              <div>
                <Form ref={formRef}>
                  <Form.Item label="今天有什么想说的" name="Note">
                    <TextArea
                      showCount
                      maxLength={200}
                      placeholder="可以讲讲你今天的心情或者其他有趣的事情"
                      rows={4}
                    />
                  </Form.Item>
                </Form>
                <Button
                  block
                  shape="rounded"
                  color="primary"
                  style={{ marginTop: 30 }}
                  onClick={() => onSubmit()}
                >
                  提交
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

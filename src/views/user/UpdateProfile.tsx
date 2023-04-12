import {
  Form,
  Input,
  Button,
  Dialog,
  TextArea,
  Result,
  Grid,
} from 'antd-mobile'
import { changePwd, register, signToday, updateProfile } from '@api/user'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import Avocado from '@components/common/Avocado'
import { FormInstance } from 'antd-mobile/es/components/form'
export default function Register() {
  let navigate = useNavigate()
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  const headerList = useMemo(() => {
    let list: string[] = []
    for (let i = 1; i <= 8; i++) {
      list.push(
        `https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/Headers/boy${i}.png?x-oss-process=style/jmms`
      )
    }
    for (let i = 1; i <= 14; i++) {
      list.push(
        `https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/Headers/girl${i}.png?x-oss-process=style/jmms`
      )
    }
    return list
  }, [])
  const [header, setHeader] = useState(headerList[0])

  const formRef = useRef<FormInstance>(null)
  function onSubmit() {
    const values = formRef.current?.getFieldsValue()
    if (!values.Name || values.Name.trim().length === 0) {
      errorMsg('名称必须填写')
    } else if (values.Name.trim().length > 20) {
      errorMsg('名称长度不能超过20位')
    } else {
      Dialog.confirm({
        title: '提示',
        content: '后续无法修改以下信息，是否提交？',
        onConfirm: () => {
          updateProfile({
            ...values,
            Header: header,
          }).then((res) => {
            if (res.IsSuccess) {
              successMsg('修改成功')
              window.setTimeout(() => {
                navigate(-1)
              }, 500)
            } else {
              errorMsg(res.Message)
            }
          })
        },
      })
    }
  }
  return (
    <>
      <PageHeader title={'账号信息'} showBack={false} />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflow: 'auto',
        }}
      >
        <div style={{ padding: 10 }}>
          <div>
            <div style={{ color: 'var(--adm-color-danger)', fontSize: 14 }}>
              *后续无法修改以下信息
            </div>
            <Form ref={formRef}>
              <Form.Item label="名称" name="Name">
                <Input placeholder="用户名，全网唯一" />
              </Form.Item>
              <Form.Item label="头像">
                <div>
                  <Grid columns={5} gap={10}>
                    {headerList.map((m) => (
                      <Grid.Item
                        key={m}
                        onClick={() => {
                          setHeader(m)
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor:
                                header === m ? 'rgba(200,200,200,0.7)' : '',
                              height: 50,
                              width: 50,
                            }}
                          >
                            <img
                              src={m}
                              alt=""
                              style={{ height: 40, width: 40 }}
                            />
                          </div>
                        </div>
                      </Grid.Item>
                    ))}
                  </Grid>
                </div>
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
      </div>
    </>
  )
}

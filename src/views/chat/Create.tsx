import { createConversation } from '@api/chat'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateCategoryListVMAsync } from '@store/modules/converstaion'
import { errorMsg, formatDate, successMsg } from '@utils/common'
import { Button, Dialog, Form, Input, Picker, TextArea } from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Index() {
  let formRef = useRef<FormInstance>(null)
  const navigate = useNavigate()

  function submit(values: any) {
    let msg = ''
    if (!values.Title || values.Title.trim().length === 0) {
      msg = '对话标题必须填写'
    }
    if (msg) {
      errorMsg(msg)
    } else {
      Dialog.confirm({
        title: '提示',
        content: '是否新建ChatGPT对话？',
        onConfirm: () => {
          createConversation({
            ...values,
            ConversationType: 1,
          }).then((res) => {
            if (res.IsSuccess) {
              successMsg('创建成功')
              window.setTimeout(() => {
                navigate('/chat/' + res.Result, { replace: true })
              }, 500)
            } else {
              if (res.Code !== 40001) {
                errorMsg(res.Message)
              }
            }
          })
        },
      })
    }
  }

  return (
    <>
      <PageHeader title={'ChatGPT新对话'} />
      <Form ref={formRef} onFinish={submit}>
        <Form.Item
          name="Title"
          label="标题"
          initialValue={'个人对话' + formatDate(new Date(), 'yyyy-MM-dd hh:mm')}
        >
          <TextArea
            maxLength={50}
            rows={3}
            placeholder="请输入对话标题"
            showCount
          />
        </Form.Item>
        <Form.Item
          name="RoleDescription"
          label="ChatGPT角色描述"
          initialValue={'你是一个十分智能的助手'}
        >
          <TextArea
            maxLength={200}
            rows={3}
            placeholder="请输入ChatGPT角色描述"
            showCount
          />
        </Form.Item>
      </Form>
      <div style={{ padding: '0 10px' }}>
        <div style={{ wordBreak: 'break-all', fontSize: 14, marginTop: 10 }}>
          <div>
            ChatGPT会根据聊天上下文和用户进行的角色描述进行回答，为了更加精确的回答您的问题，您可以开启一个新的对话，并尽可能的描述您需要的角色信息。
          </div>
          <div style={{ color: 'var(--adm-color-danger)' }}>
            最好描述ChatGPT的角色，不指定角色的话ChatGPT会根据聊天上下文自动分析。
          </div>
        </div>
      </div>
      <div style={{ padding: 15 }}>
        <Button
          block
          shape="rounded"
          color="primary"
          onClick={() => {
            formRef.current?.submit()
          }}
        >
          <div>创建对话</div>
        </Button>
      </div>
    </>
  )
}

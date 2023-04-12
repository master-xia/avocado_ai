import { addDicInfo } from '@api/cmmon'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, successMsg } from '@utils/common'
import { Form, Input, Button, TextArea, Dialog } from 'antd-mobile'
import { FormInstance } from 'rc-field-form'
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddCustomer() {
  const navigate = useNavigate()
  const curDomain = useParams()['domain']
  function doAction(values: any) {
    if (curDomain) {
      values.DomainType = curDomain
    }
    Dialog.confirm({
      content: '是否新增字典信息？',
      onConfirm: () => {
        addDicInfo(values).then((res) => {
          if (res.IsSuccess) {
            successMsg('新增成功')
            formRef.current?.resetFields()
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
  let formRef = useRef<FormInstance>(null)
  return (
    <>
      <PageHeader title="新增字典" />
      <div style={{ borderTop: '1px solid #eee' }}></div>
      <Form
        layout="vertical"
        onFinish={doAction}
        style={{ '--border-top': 'none', padding: 10 }}
        footer={
          <Button block type="submit" color="primary">
            确认新增
          </Button>
        }
        ref={formRef}
      >
        {curDomain ? (
          <Form.Item label="类别">
            <span>{curDomain}</span>
          </Form.Item>
        ) : (
          <Form.Item
            name="DomainType"
            label="类别"
            rules={[
              { required: true, message: '类别不能为空' },
              {
                max: 200,
                message: '类别过长',
              },
            ]}
          >
            <Input placeholder="输入名类别" clearable />
          </Form.Item>
        )}

        <Form.Item
          name="Key"
          label="名称"
          rules={[
            { required: true, message: '名称不能为空' },
            {
              max: 50,
              message: '名称过长',
            },
          ]}
        >
          <Input placeholder="输入名称" clearable />
        </Form.Item>
        <Form.Item
          name="Value"
          label="数值"
          rules={[
            { required: true, message: '数值不能为空' },
            {
              max: 1000,
              message: '数值过长',
            },
          ]}
        >
          <Input placeholder="输入数值" clearable />
        </Form.Item>
        <Form.Item
          name="Note"
          label="备注"
          rules={[
            {
              max: 200,
              message: '备注过长',
            },
          ]}
        >
          <TextArea showCount maxLength={200} placeholder="输入备注信息" />
        </Form.Item>
      </Form>
    </>
  )
}

import { deleteDicInfo, getDicInfo, updateDicInfo } from '@api/cmmon'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, successMsg } from '@utils/common'
import { Form, Input, Button, TextArea, Dialog } from 'antd-mobile'
import { FormInstance } from 'rc-field-form'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditCustomer() {
  const id = parseInt(useParams()['id']!)
  const navigate = useNavigate()
  const [dicInfo, setDicInfo] = useState<CI_DicInfo | null>(null)
  function loadData() {
    getDicInfo(id).then((res) => {
      if (res.IsSuccess) {
        const dicInfo = res.Result!
        dicInfo.Note = dicInfo.Note ?? ''
        setDicInfo(dicInfo)
        formRef.current?.setFieldsValue(dicInfo)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  useEffect(() => {
    loadData()
  }, [])
  function doAction(values: any) {
    Dialog.confirm({
      content: '是否保存字典信息？',
      onConfirm: () => {
        updateDicInfo(values).then((res) => {
          if (res.IsSuccess) {
            successMsg('保存成功')
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
  function doDelete() {
    deleteDicInfo(id).then((res) => {
      if (res.IsSuccess) {
        successMsg('删除成功')
        window.setTimeout(() => {
          navigate(-1)
        }, 500)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  let formRef = useRef<FormInstance>(null)
  return (
    <>
      <PageHeader
        title="编辑字典"
        right={
          <span
            style={{ color: 'red' }}
            onClick={() =>
              Dialog.confirm({
                content: '是否删除字典信息',
                onConfirm: async () => {
                  doDelete()
                },
              })
            }
          >
            删除
          </span>
        }
      />
      <div style={{ borderTop: '1px solid #eee' }}></div>
      <Form
        layout="vertical"
        onFinish={doAction}
        style={{ '--border-top': 'none', padding: 10 }}
        footer={
          <Button block type="submit" color="primary">
            保存修改
          </Button>
        }
        ref={formRef}
      >
        <Form.Item name="Id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="DomainType" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="类别">
          <span>{dicInfo?.DomainType ?? '未知'}</span>
        </Form.Item>
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

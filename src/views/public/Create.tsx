import { createConversation } from '@api/chat'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateCategoryListVMAsync } from '@store/modules/converstaion'
import { errorMsg, successMsg } from '@utils/common'
import { Button, Dialog, Form, Input, Picker, TextArea } from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Index() {
  const categoryList = useAppSelector((m) => m.chat.categoryList)
  const categoryIdParms = useParams()['categoryId']
  const dispatch = useAppDispatch()
  let formRef = useRef<FormInstance>(null)
  const [categoryId, setCategoryId] = useState([''])
  const navigate = useNavigate()
  useEffect(() => {
    if (categoryList === undefined) {
      dispatch(updateCategoryListVMAsync())
    }
    if (categoryIdParms) {
      selectCategory(categoryIdParms)
    }
  }, [categoryList])
  const [visible, setVisible] = useState(false)
  const categoryColumns = useMemo(() => {
    if (!categoryList) {
      return []
    }
    return [
      categoryList
        ?.filter((m) => m.CategoryId !== 'aiht')
        .map((item) => ({
          label: item.CategoryName,
          value: item.CategoryId,
        })),
    ]
  }, [categoryList])
  function submit(values: any) {
    let msg = ''
    if (!values.CategoryId) {
      msg = '请选择话题分类'
    } else if (!values.Title) {
      msg = '话题标题不能为空'
    } else if (values.Title.trim().length < 5) {
      msg = '话题标题不能少于5个字'
    }
    if (msg) {
      errorMsg(msg)
    } else {
      Dialog.confirm({
        title: '提示',
        content: '是否发布该话题？',
        onConfirm: () => {
          createConversation({
            ...values,
            ConversationType: 2,
          }).then((res) => {
            if (res.IsSuccess) {
              successMsg('发布成功')
              window.setTimeout(() => {
                navigate('/p/' + res.Result, { replace: true })
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
  function selectCategory(cid: string) {
    let categoryInfo = categoryList?.filter((m) => m.CategoryId === cid)[0]
    setCategoryId([cid])
    formRef.current?.setFieldsValue({
      CategoryId: categoryInfo?.CategoryId,
      CategoryName: categoryInfo?.CategoryName,
    })
  }
  return (
    <>
      <PageHeader title={'我要发布'} />
      <Form ref={formRef} onFinish={submit}>
        <Form.Item name="CategoryId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="CategoryName"
          label="分类"
          onClick={() => {
            setVisible(true)
          }}
        >
          <Input readOnly placeholder="请选择话题分类" />
        </Form.Item>
        <Form.Item name="Title" label="标题">
          <TextArea
            maxLength={200}
            rows={3}
            placeholder="请输入话题标题"
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
      <div style={{ padding: 15 }}>
        <Button
          block
          shape="rounded"
          color="primary"
          onClick={() => {
            formRef.current?.submit()
          }}
        >
          <div>发布话题</div>
        </Button>
      </div>
      <Picker
        columns={categoryColumns}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        value={categoryId}
        onConfirm={(v) => {
          let id = v[0]!
          selectCategory(id)
        }}
      />
    </>
  )
}

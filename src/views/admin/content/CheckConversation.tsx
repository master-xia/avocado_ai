import { checkConversation, getNextUncheckConversation } from '@api/content'
import Avocado from '@components/common/Avocado'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import {
  Avatar,
  Button,
  ErrorBlock,
  Form,
  Grid,
  List,
  Popup,
  Switch,
  Tag,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
export default function Check() {
  const [conversationInfo, setConversationInfo] =
    useState<CT_ConversationInfo>()
  const [images, setImages] = useState<ConversationImageInfoVM[]>([])
  const [failedImages, setFailedImages] = useState<string[]>([])
  const [exampleImages, setExampleImages] = useState<string[]>([])
  const [failVisible, setFailVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const failFormRef = useRef<FormInstance>(null)
  const successFormRef = useRef<FormInstance>(null)
  const notes = ['含有违规图片', '含有违规内容', '其他']
  function addFailedImage(md5: string) {
    setFailedImages([...failedImages, md5])
  }
  function removeFailedImage(md5: string) {
    setFailedImages([...failedImages.filter((m) => m !== md5)])
  }
  function addExampleImage(md5: string) {
    setExampleImages([...exampleImages, md5])
  }
  function removeExampleImage(md5: string) {
    setExampleImages([...exampleImages.filter((m) => m !== md5)])
  }
  function loadNext() {
    setConversationInfo(undefined)
    setImages([])
    failFormRef.current?.resetFields()
    successFormRef.current?.resetFields()
    setFailVisible(false)
    setSuccessVisible(false)
    getNextUncheckConversation()
      .then((res) => {
        if (res.IsSuccess) {
          setConversationInfo(res.Result?.Conversation)
          setImages(res.Result?.Images ?? [])
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }
  const tags = useMemo(() => {
    if (conversationInfo) {
      return conversationInfo.Keywords.split('|')
    }
    return []
  }, [conversationInfo])
  useEffect(() => {
    loadNext()
  }, [])
  function check(status: boolean) {
    if (conversationInfo) {
      checkConversation({
        ConversationId: conversationInfo?.ConversationId,
        CheckStatus: status,
        FailedImagesMD5: failedImages,
        ExampleImagesMD5: exampleImages,
        Note: status
          ? successFormRef.current?.getFieldValue('Note')
          : failFormRef.current?.getFieldValue('Note'),
      })
        .then((res) => {
          if (res.IsSuccess) {
            successMsg('操作成功')
          } else {
            errorMsg(res.Message)
          }
          loadNext()
        })
        .catch(() => {
          errorMsg('网络异常')
        })
    }
  }
  if (!conversationInfo) {
    return (
      <>
        <PageHeader title={'审核话题/AI绘图'} />
        <ErrorBlock
          description="稍后再来看看"
          title="当前没有需要审核的话题/AI绘图"
          style={{ marginTop: 30 }}
        />
      </>
    )
  }
  return (
    <>
      <PageHeader title={'审核话题/AI绘图'} />
      <div
        style={{
          overflow: 'auto',
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
        }}
      >
        <Form>
          <Form.Item label="用户">
            <div style={{ display: 'flex' }}>
              <Avatar src={conversationInfo?.Header ?? ''} />
              <div style={{ marginLeft: 10 }}>
                <div style={{ color: '#666' }}>{conversationInfo?.Name}</div>
                <div style={{ color: '#999' }}>
                  {conversationInfo?.UserName}
                </div>
              </div>
            </div>
          </Form.Item>
          {conversationInfo?.ConversationType === 2 && (
            <>
              <Form.Item label="话题类型">普通话题</Form.Item>
              <Form.Item label="角色描述">
                {conversationInfo.RoleDescription}
              </Form.Item>
            </>
          )}
          {conversationInfo?.ConversationType === 3 && (
            <Form.Item label="话题类型">Ai绘图</Form.Item>
          )}
          <Form.Item label="话题标题">{conversationInfo?.Title}</Form.Item>
          <Form.Item label={'图片X' + conversationInfo?.ImageCount}>
            <PhotoProvider photoClosable>
              {images.map((m) => (
                <PhotoView src={m.Url} key={m.FileId}>
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    <img src={m.Url} style={{ width: '100%' }} alt="" />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <Switch
                        onChange={(checked) => {
                          if (checked) {
                            addExampleImage(m.MD5)
                          } else {
                            removeExampleImage(m.MD5)
                          }
                        }}
                        checkedText="样品图"
                        uncheckedText="设为样品图"
                        style={{
                          '--height': '25px',
                          '--width': '60px',
                          marginLeft: 10,
                        }}
                      />
                      <Switch
                        onChange={(checked) => {
                          if (checked) {
                            addFailedImage(m.MD5)
                          } else {
                            removeFailedImage(m.MD5)
                          }
                        }}
                        checkedText="图片违规"
                        uncheckedText="正常图片"
                        style={{
                          '--checked-color': 'red',
                          '--height': '25px',
                          '--width': '60px',
                          marginLeft: 10,
                        }}
                      />
                    </div>
                  </div>
                </PhotoView>
              ))}
            </PhotoProvider>
          </Form.Item>
          <Form.Item label="花费">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {conversationInfo?.CountCost}
              <Avocado />
            </div>
          </Form.Item>
          <Form.Item label="类目">{conversationInfo?.CategoryName}</Form.Item>
          <Form.Item label="关键字">
            {tags.map((m) => (
              <Tag
                fill="outline"
                style={{ marginRight: 5 }}
                color="primary"
                key={m}
              >
                {m}
              </Tag>
            ))}
          </Form.Item>
          <Form.Item label="创建时间">
            <Datetime type="datetime" datetime={conversationInfo?.CreateTime} />
          </Form.Item>
          <Form.Item label="更新时间">
            <Datetime type="datetime" datetime={conversationInfo?.UpdateTime} />
          </Form.Item>
          <Form.Header>地址位置</Form.Header>
          <Form.Item label="IP地址">{conversationInfo?.Ip}</Form.Item>
          <Form.Item label="国家">{conversationInfo?.Country}</Form.Item>
          <Form.Item label="省份">{conversationInfo?.Province}</Form.Item>
          <Form.Item label="城市">{conversationInfo?.City}</Form.Item>
        </Form>
      </div>
      <div
        style={{
          width: '100%',
        }}
      >
        <div style={{ padding: 10 }}>
          <Grid columns={2} gap={10}>
            <Grid.Item>
              <Button
                color="danger"
                block
                onClick={() => {
                  setFailVisible(true)
                }}
              >
                失败
              </Button>
            </Grid.Item>
            <Grid.Item>
              <Button
                color="success"
                block
                onClick={() => {
                  setSuccessVisible(true)
                }}
              >
                通过
              </Button>
            </Grid.Item>
          </Grid>
        </div>
      </div>
      <Popup
        visible={successVisible}
        onMaskClick={() => {
          setSuccessVisible(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <Form ref={successFormRef}>
          <Form.Item label="备注" name="Note">
            <TextArea showCount maxLength={200} />
          </Form.Item>
        </Form>
        <div style={{ padding: 10 }}>
          <Button
            block
            color="success"
            onClick={() => {
              check(true)
            }}
          >
            审核通过
          </Button>
        </div>
      </Popup>
      <Popup
        visible={failVisible}
        onMaskClick={() => {
          setFailVisible(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <Form ref={failFormRef}>
          <Form.Item label="审核失败原因" name="Note">
            <TextArea showCount maxLength={200} />
          </Form.Item>
        </Form>
        <div style={{ padding: 10 }}>
          {notes.map((m) => (
            <div key={m} style={{ marginBottom: 5 }}>
              <Tag
                color="primary"
                onClick={() => {
                  failFormRef.current?.setFieldValue('Note', m)
                }}
              >
                {m}
              </Tag>
            </div>
          ))}
        </div>
        <div style={{ padding: 10 }}>
          <Button
            block
            color="danger"
            onClick={() => {
              check(false)
            }}
          >
            审核失败
          </Button>
        </div>
      </Popup>
    </>
  )
}

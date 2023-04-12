import { checkComment, getNextUncheckCommnetInfo } from '@api/content'
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
  Popup,
  Tag,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
export default function Check() {
  const [commentInfo, setCommentInfo] = useState<CT_CommentInfo>()
  const [failVisible, setFailVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const failFormRef = useRef<FormInstance>(null)
  const successFormRef = useRef<FormInstance>(null)
  const notes = ['含有违规内容', '其他']

  function loadNext() {
    setCommentInfo(undefined)
    failFormRef.current?.resetFields()
    successFormRef.current?.resetFields()
    setFailVisible(false)
    setSuccessVisible(false)
    getNextUncheckCommnetInfo()
      .then((res) => {
        if (res.IsSuccess) {
          setCommentInfo(res.Result)
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }

  useEffect(() => {
    loadNext()
  }, [])
  function check(status: boolean) {
    if (commentInfo) {
      checkComment({
        CommentId: commentInfo?.CommentId,
        CheckStatus: status,
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
  if (!commentInfo) {
    return (
      <>
        <PageHeader title={'审核评论'} />
        <ErrorBlock
          description="稍后再来看看"
          title="当前没有需要审核的评论"
          style={{ marginTop: 30 }}
        />
      </>
    )
  }
  return (
    <>
      <PageHeader title={'审核评论'} />
      <div
        style={{
          overflow: 'auto',
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
        }}
      >
        <Form>
          <Form.Item label="用户">
            <div style={{ display: 'flex' }}>
              <Avatar src={commentInfo?.Header ?? ''} />
              <div style={{ marginLeft: 10 }}>
                <div style={{ color: '#666' }}>{commentInfo?.Name}</div>
                <div style={{ color: '#999' }}>{commentInfo?.UserName}</div>
              </div>
            </div>
          </Form.Item>

          <Form.Item label="话题标题">{commentInfo?.Title}</Form.Item>
          <Form.Item label="评论内容">{commentInfo?.Content}</Form.Item>
          <Form.Item label="花费">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {commentInfo?.CountCost}
              <Avocado />
            </div>
          </Form.Item>
          <Form.Item label="创建时间">
            <Datetime type="datetime" datetime={commentInfo?.CreateTime} />
          </Form.Item>
          <Form.Item label="更新时间">
            <Datetime type="datetime" datetime={commentInfo?.UpdateTime} />
          </Form.Item>
          <Form.Header>地址位置</Form.Header>
          <Form.Item label="IP地址">{commentInfo?.Ip}</Form.Item>
          <Form.Item label="国家">{commentInfo?.Country}</Form.Item>
          <Form.Item label="省份">{commentInfo?.Province}</Form.Item>
          <Form.Item label="城市">{commentInfo?.City}</Form.Item>
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

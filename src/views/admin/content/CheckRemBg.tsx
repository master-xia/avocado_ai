import { checkRemoveBgInfo, getNextUncheckRemBgInfo } from '@api/content'
import Avocado from '@components/common/Avocado'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { noColorBgImg } from '@components/common/SelectColor'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import {
  Avatar,
  Button,
  ErrorBlock,
  Form,
  Grid,
  Loading,
  Popup,
  Tag,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
export default function Check() {
  const [removeBgInfo, setRemoveBgInfo] = useState<RemoveBgInfoVM>()
  const [failVisible, setFailVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const failFormRef = useRef<FormInstance>(null)
  const successFormRef = useRef<FormInstance>(null)
  const notes = ['含有违规内容', '其他']

  function loadNext() {
    setRemoveBgInfo(undefined)
    failFormRef.current?.resetFields()
    successFormRef.current?.resetFields()
    setFailVisible(false)
    setSuccessVisible(false)
    getNextUncheckRemBgInfo()
      .then((res) => {
        if (res.IsSuccess) {
          setRemoveBgInfo(res.Result)
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
    if (removeBgInfo) {
      checkRemoveBgInfo({
        RemoveId: removeBgInfo?.RemoveId,
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
  if (!removeBgInfo) {
    return (
      <>
        <PageHeader title={'审核AI抠图'} />
        <ErrorBlock
          description="稍后再来看看"
          title="当前没有需要审核的内容"
          style={{ marginTop: 30 }}
        />
      </>
    )
  }
  return (
    <>
      <PageHeader title={'审核AI抠图'} />
      <div
        style={{
          overflow: 'auto',
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
        }}
      >
        <PhotoProvider photoClosable>
          <Form>
            <Form.Item label="用户名">{removeBgInfo.UserName}</Form.Item>
            <Form.Item label="去除类型">
              {removeBgInfo.RemoveBgType === 0 ? '常规背景移除' : '证件照制作'}
            </Form.Item>
            <Form.Item label="花费">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {removeBgInfo.CountCost}
                <Avocado />
              </div>
            </Form.Item>
            <Form.Item label="图片信息">
              <Grid columns={2} gap={5}>
                <Grid.Item>
                  <PhotoView src={removeBgInfo.SourceImageUrl}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#999', fontSize: 14 }}>
                        <span>{removeBgInfo.SourceImageSizeStr}</span>（
                        <span>
                          {removeBgInfo.SourceImageWidth}X
                          {removeBgInfo.SourceImageHeight}
                        </span>
                        ）
                      </div>
                      <img
                        alt=""
                        src={removeBgInfo.SourceImageUrl}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </PhotoView>
                </Grid.Item>
                {removeBgInfo.RemovedBgImageUrl && (
                  <Grid.Item>
                    <PhotoView src={removeBgInfo.RemovedBgImageUrl}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#999', fontSize: 14 }}>
                          <span>{removeBgInfo.RemovedImageSizeStr}</span>（
                          <span>
                            {removeBgInfo.RemovedImageWidth}X
                            {removeBgInfo.RemovedImageHeight}
                          </span>
                          ）
                        </div>
                        <img
                          alt=""
                          src={removeBgInfo.RemovedBgImageUrl}
                          style={{
                            width: '100%',
                            backgroundImage: noColorBgImg,
                          }}
                        />
                      </div>
                    </PhotoView>
                  </Grid.Item>
                )}
              </Grid>
            </Form.Item>

            <Form.Item label="创建时间">
              <Datetime type="datetime" datetime={removeBgInfo?.CreateTime} />
            </Form.Item>
            <Form.Item label="更新时间">
              <Datetime type="datetime" datetime={removeBgInfo?.UpdateTime} />
            </Form.Item>
          </Form>
        </PhotoProvider>
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

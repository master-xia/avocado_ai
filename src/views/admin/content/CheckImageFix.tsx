import { checkImageFixInfo, getNextUncheckImageFixInfo } from '@api/content'
import Avocado from '@components/common/Avocado'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import {
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
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
export default function Check() {
  const [imageFixInfo, setImageFixInfo] = useState<ImageFixInfoVM>()
  const [failVisible, setFailVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const failFormRef = useRef<FormInstance>(null)
  const successFormRef = useRef<FormInstance>(null)
  const notes = ['含有违规内容', '其他']

  function loadNext() {
    setImageFixInfo(undefined)
    failFormRef.current?.resetFields()
    successFormRef.current?.resetFields()
    setFailVisible(false)
    setSuccessVisible(false)
    getNextUncheckImageFixInfo()
      .then((res) => {
        if (res.IsSuccess) {
          setImageFixInfo(res.Result)
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
    if (imageFixInfo) {
      checkImageFixInfo({
        FixId: imageFixInfo?.FixId,
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
  if (!imageFixInfo) {
    return (
      <>
        <PageHeader title={'审核AI修复图片'} />
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
      <PageHeader title={'审核图片审核AI修复图片修复'} />
      <div
        style={{
          overflow: 'auto',
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
        }}
      >
        <PhotoProvider photoClosable>
          <Form>
            <Form.Item label="用户名">{imageFixInfo.UserName}</Form.Item>

            <Form.Item label="花费">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {imageFixInfo.CountCost}
                <Avocado />
              </div>
            </Form.Item>
            <Form.Item label="原始图片">
              <div>
                <PhotoView src={imageFixInfo.SourceImageUrl}>
                  <img
                    alt=""
                    src={imageFixInfo.SourceImageUrl}
                    style={{ width: '100%' }}
                  />
                </PhotoView>
              </div>
              <div style={{ color: '#999', fontSize: 14 }}>
                <span>图片大小{imageFixInfo.SourceImageSizeStr}</span>
                <span>
                  ，尺寸{imageFixInfo.SourceImageWidth}X
                  {imageFixInfo.SourceImageHeight}
                </span>
              </div>
            </Form.Item>
            {imageFixInfo.FixedImageUrl && (
              <Form.Item label="修复结果">
                <div>
                  <PhotoView src={imageFixInfo.FixedImageUrl}>
                    <img
                      alt=""
                      src={imageFixInfo.FixedImageUrl}
                      style={{ width: '100%' }}
                    />
                  </PhotoView>
                </div>
                <div style={{ color: '#999', fontSize: 14 }}>
                  <span>图片大小{imageFixInfo.FixedImageSizeStr}</span>
                  <span>
                    ，尺寸{imageFixInfo.FixedImageWidth}X
                    {imageFixInfo.FixedImageHeight}
                  </span>
                </div>
              </Form.Item>
            )}
            <Form.Item label="创建时间">
              <Datetime type="datetime" datetime={imageFixInfo?.CreateTime} />
            </Form.Item>
            <Form.Item label="更新时间">
              <Datetime type="datetime" datetime={imageFixInfo?.UpdateTime} />
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

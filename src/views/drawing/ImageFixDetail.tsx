import {
  deleteImageFixInfo,
  getImageFixInfoVM,
  getImageFixStatus,
} from '@api/drawing'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Dialog, Form, Loading } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
export default function ImageFixDetail() {
  const fixId = useParams()['fixId']
  const status = useRef(-1)
  const navigate = useNavigate()
  const [flag, setFlag] = useState(0)
  const imageFixInfo = useRef<ImageFixInfoVM>()
  function loadData() {
    if (!fixId) return
    getImageFixInfoVM(fixId, true)
      .then((res) => {
        if (res.IsSuccess) {
          imageFixInfo.current = res.Result
          setFlag(new Date().getTime())
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }

  useEffect(() => {
    let getStatusInterval = -1
    function getStatus() {
      if (fixId && status.current <= 1) {
        getImageFixStatus(fixId, true)
          .then((res) => {
            if (res.IsSuccess) {
              if (status.current !== res.Result!) {
                loadData()
                status.current = res.Result!
              }
              getStatusInterval = window.setTimeout(() => {
                getStatus()
              }, 2000)
            } else {
              errorMsg(res.Message)
            }
          })
          .catch(() => {
            errorMsg('网络异常')
          })
      }
    }
    getStatus()
    return () => {
      if (getStatusInterval !== -1) {
        window.clearInterval(getStatusInterval)
      }
    }
  }, [])
  function deleteFixInfo() {
    if (!fixId) return
    Dialog.confirm({
      title: '提示',
      content: '是否删除该条记录？',
      onConfirm: () => {
        deleteImageFixInfo(fixId)
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('删除成功')
              window.setTimeout(() => {
                navigate(-1)
              }, 500)
            } else {
              errorMsg(res.Message)
            }
          })
          .catch(() => {
            errorMsg('网络异常')
          })
      },
    })
  }
  if (!imageFixInfo.current) {
    return (
      <>
        <PageHeader
          title={'AI图片修复'}
          right={
            <span
              onClick={deleteFixInfo}
              style={{
                color: 'var(--adm-color-danger)',
              }}
            >
              删除
            </span>
          }
        />
      </>
    )
  }
  return (
    <>
      <PageHeader
        title={'AI图片修复'}
        right={
          <span
            onClick={deleteFixInfo}
            style={{
              color: 'var(--adm-color-danger)',
            }}
          >
            删除
          </span>
        }
      />
      <div style={{  height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`, overflow: 'auto' }}>
        <div>
          <PhotoProvider photoClosable>
            <Form>
              <Form.Item label="原始图片">
                <div>
                  <PhotoView src={imageFixInfo.current?.SourceImageUrl}>
                    <img
                      alt=""
                      src={imageFixInfo.current?.SourceImageUrl}
                      style={{ width: '100%' }}
                    />
                  </PhotoView>
                </div>
                <div style={{ color: '#999', fontSize: 14 }}>
                  <span>
                    图片大小{imageFixInfo.current?.SourceImageSizeStr}
                  </span>
                  <span>
                    ，尺寸{imageFixInfo.current?.SourceImageWidth}X
                    {imageFixInfo.current?.SourceImageHeight}
                  </span>
                </div>
              </Form.Item>
              {imageFixInfo.current?.FixedImageUrl && (
                <Form.Item label="修复结果，长按图片保存">
                  <div>
                    <PhotoView src={imageFixInfo.current?.FixedImageUrl}>
                      <img
                        alt=""
                        src={imageFixInfo.current?.FixedImageUrl}
                        style={{ width: '100%' }}
                      />
                    </PhotoView>
                  </div>
                  <div style={{ color: '#999', fontSize: 14 }}>
                    <span>
                      图片大小{imageFixInfo.current?.FixedImageSizeStr}
                    </span>
                    <span>
                      ，尺寸{imageFixInfo.current?.FixedImageWidth}X
                      {imageFixInfo.current?.FixedImageHeight}
                    </span>
                  </div>
                </Form.Item>
              )}
              {!imageFixInfo.current?.FixedImageUrl && (
                <Form.Item>
                  <div style={{ color: '#999' }}>
                    {imageFixInfo.current?.Status === 0 && (
                      <span>
                        <Loading />
                        等待AI修复该图片
                      </span>
                    )}
                    {imageFixInfo.current?.Status === 1 && (
                      <span>
                        <Loading />
                        AI正在修复该图片
                      </span>
                    )}
                    {imageFixInfo.current?.Status === 2 && (
                      <span>AI修复该图片失败</span>
                    )}
                  </div>
                </Form.Item>
              )}
            </Form>
          </PhotoProvider>
        </div>
      </div>
    </>
  )
}

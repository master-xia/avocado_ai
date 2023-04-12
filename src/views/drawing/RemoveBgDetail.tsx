import {
  deleteRemoveBgInfo,
  getRemoveBgInfoVM,
  getRemoveBgStatus,
  updateEditInfo,
} from '@api/drawing'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, Grid, Loading, Selector } from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import EditPicture from '@components/common/EditPicture'
import { noColorBgImg } from '@components/common/SelectColor'

export default function RemoveBgDetail() {
  const removeId = useParams()['removeId']
  const status = useRef(-1)
  const navigate = useNavigate()
  const [flag, setFlag] = useState(0)
  const removeBgInfo = useRef<RemoveBgInfoVM>()
  const updateEditInfoTimeout = useRef(-1)
  const updateEditInfoStatus = useRef(0) //0正常 1请求中 2失败
  function loadData() {
    if (!removeId) return
    getRemoveBgInfoVM(removeId, true)
      .then((res) => {
        if (res.IsSuccess) {
          removeBgInfo.current = res.Result
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
      if (removeId && status.current <= 1) {
        getRemoveBgStatus(removeId, true)
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
    if (!removeId) return
    Dialog.confirm({
      title: '提示',
      content: '是否删除该条记录？',
      onConfirm: () => {
        deleteRemoveBgInfo(removeId)
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

  if (!removeBgInfo.current) {
    return (
      <>
        <PageHeader
          title={'详情'}
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
  function submit() {}
  return (
    <>
      <PageHeader
        title={
          removeBgInfo.current.RemoveBgType === 1 ? '证件照制作' : 'AI抠图'
        }
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
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div>
          {removeBgInfo.current?.RemovedBgImageUrl && (
            <EditPicture
              Image={removeBgInfo.current.RemovedBgImageUrl}
              ShowPhotoType={removeBgInfo.current?.RemoveBgType === 1}
              initialData={removeBgInfo.current.EditInfo}
              onChange={(data) => {
                if (
                  updateEditInfoTimeout.current !== -1 &&
                  updateEditInfoStatus.current !== 1
                ) {
                  window.clearTimeout(updateEditInfoTimeout.current)
                }
                function error() {
                  updateEditInfoStatus.current = 2
                  updateEditInfoTimeout.current = -1
                  Dialog.alert({
                    title: '提示',
                    content: '保存编辑信息失败',
                    onConfirm: () => {
                      updateEditInfoStatus.current = 0
                    },
                  })
                }
                if (updateEditInfoStatus.current === 0) {
                  updateEditInfoTimeout.current = window.setTimeout(() => {
                    updateEditInfoStatus.current = 1
                    updateEditInfo({
                      RemoveId: removeId!,
                      EditInfo: data,
                    })
                      .then((res) => {
                        if (res.IsSuccess) {
                          updateEditInfoStatus.current = 0
                        } else {
                          error()
                        }
                        updateEditInfoTimeout.current = -1
                      })
                      .catch(() => {
                        error()
                      })
                  }, 100)
                }
              }}
            />
          )}

          <Form>
            {removeBgInfo.current.RemovedBgImageUrl && (
              <Form.Item label="图片信息">
                <PhotoProvider photoClosable>
                  <Grid columns={2} gap={5}>
                    <Grid.Item>
                      <PhotoView src={removeBgInfo.current?.SourceImageUrl}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#999', fontSize: 14 }}>
                            <span>
                              {removeBgInfo.current?.SourceImageSizeStr}
                            </span>
                            （
                            <span>
                              {removeBgInfo.current?.SourceImageWidth}X
                              {removeBgInfo.current?.SourceImageHeight}
                            </span>
                            ）
                          </div>
                          <img
                            alt=""
                            src={removeBgInfo.current?.SourceImageUrl}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </PhotoView>
                    </Grid.Item>
                    <Grid.Item>
                      <PhotoView src={removeBgInfo.current?.RemovedBgImageUrl}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#999', fontSize: 14 }}>
                            <span>
                              {removeBgInfo.current?.RemovedImageSizeStr}
                            </span>
                            （
                            <span>
                              {removeBgInfo.current?.RemovedImageWidth}X
                              {removeBgInfo.current?.RemovedImageHeight}
                            </span>
                            ）
                          </div>
                          <img
                            alt=""
                            src={removeBgInfo.current?.RemovedBgImageUrl}
                            style={{
                              width: '100%',
                              backgroundImage: noColorBgImg,
                            }}
                          />
                        </div>
                      </PhotoView>
                    </Grid.Item>
                  </Grid>
                </PhotoProvider>
              </Form.Item>
            )}
            {!removeBgInfo.current?.RemovedBgImageUrl && (
              <>
                <Form.Item label="原始图片">
                  <div>
                    <PhotoProvider photoClosable>
                      <PhotoView src={removeBgInfo.current?.SourceImageUrl}>
                        <div style={{ textAlign: 'center' }}>
                          <img
                            alt=""
                            src={removeBgInfo.current?.SourceImageUrl}
                            style={{ width: '100%' }}
                          />
                          <div style={{ color: '#999', fontSize: 14 }}>
                            <span>
                              {removeBgInfo.current?.SourceImageSizeStr}
                            </span>
                            （
                            <span>
                              {removeBgInfo.current?.SourceImageWidth}X
                              {removeBgInfo.current?.SourceImageHeight}
                            </span>
                            ）
                          </div>
                        </div>
                      </PhotoView>
                    </PhotoProvider>
                  </div>
                </Form.Item>
                <Form.Item>
                  <div style={{ color: '#999' }}>
                    {removeBgInfo.current?.Status === 0 && (
                      <span>
                        <Loading />
                        等待AI对图片进行操作
                      </span>
                    )}
                    {removeBgInfo.current?.Status === 1 && (
                      <span>
                        <Loading />
                        AI正在操作该图片
                      </span>
                    )}
                    {removeBgInfo.current?.Status === 2 && (
                      <span>AI抠图该图片失败</span>
                    )}
                  </div>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  )
}

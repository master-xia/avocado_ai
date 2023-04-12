import { createImageFix } from '@api/drawing'
import { getImageFixUplodaToAliyunOSSPolicyToken } from '@api/file'
import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { UploadSingleImage } from '@components/file/UploadSingleImage'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, Grid, Slider } from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useNavigate } from 'react-router-dom'
export default function ImageFix() {
  const formRef = useRef<FormInstance>(null)
  const [fileInfo, setFileInfo] = useState<CheckFileResultVM>()
  const [quality, setQuality] = useState(1)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  let minQuality = useMemo(() => {
    if (fileInfo) {
      let tmp1 = Math.ceil(fileInfo.ImageHeight! / 1024)
      let tmp2 = Math.ceil(fileInfo.ImageWidth! / 1024)
      return Math.max(tmp1, tmp2)
    }
    return 1
  }, [fileInfo])
  let fixeImageInfo = useMemo(() => {
    if (fileInfo) {
      let width = quality * 1024
      let ration = fileInfo.ImageWidth! / fileInfo.ImageHeight!
      if (ration > 1) {
        return {
          Width: width,
          Height: Math.ceil(width / ration),
        }
      } else {
        return {
          Height: width,
          Width: Math.ceil(width * ration),
        }
      }
    }
    return undefined
  }, [fileInfo, quality])
  useEffect(() => {
    setQuality(Math.max(quality, minQuality))
  }, [fileInfo])
  function onSubmit() {
    if (!fileInfo) {
      errorMsg('请上传需要修改的图片')
      return
    }
    Dialog.confirm({
      title: '提示',
      content: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            <span>本次需要消耗{quality * avocadoInfo?.RepairPicture!}</span>
            <Avocado />
            <span>是否修复该图片？</span>
          </span>
        </div>
      ),
      onConfirm: () => {
        createImageFix({
          SourceFileId: fileInfo.FileId,
          Quality: quality,
        })
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('创建成功')
              window.setTimeout(() => {
                navigate('/drawing/fix/detail/' + res.Result, {
                  replace: true,
                })
              }, 500)
            } else {
              if (res.Code !== 40001) {
                errorMsg(res.Message)
              }
            }
          })
          .catch(() => {
            errorMsg('服务器异常')
          })
      },
    })
  }
  return (
    <>
      <PageHeader title="AI图片修复" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
          overflow: 'auto',
        }}
      >
        <div>
          <Form ref={formRef}>
            <Form.Item
              label="原始图片"
              description={
                fileInfo && (
                  <>
                    <span>图片大小{fileInfo.FileSizeStr}</span>
                    <span>
                      ，宽高{fileInfo.ImageWidth}X{fileInfo.ImageHeight}
                    </span>
                  </>
                )
              }
            >
              <UploadSingleImage
                getToken={getImageFixUplodaToAliyunOSSPolicyToken}
                onSelect={() => {
                  setFileInfo(undefined)
                }}
                onDelete={() => {
                  setFileInfo(undefined)
                }}
                onSuccess={(fileInfo) => {
                  setFileInfo(fileInfo)
                }}
              />
            </Form.Item>
            <Form.Item
              label={
                <>
                  <span>质量</span>(<span>{quality}K画质</span>)
                </>
              }
              description={
                <>
                  <span>质量越高，等待时间越长</span>
                </>
              }
            >
              <Slider
                ticks
                max={8}
                min={1}
                onChange={(value) => {
                  if ((value as number) < minQuality) {
                    setQuality(minQuality)
                  } else {
                    setQuality(value as number)
                  }
                }}
                value={quality}
              />
            </Form.Item>
            {fixeImageInfo && (
              <Form.Item label="修复后图片宽高">
                {fixeImageInfo.Width}X{fixeImageInfo.Height}
              </Form.Item>
            )}
          </Form>

          <div style={{ marginTop: 10 }}>
            <PhotoProvider
              onIndexChange={(index) => {}}
              photoClosable
              overlayRender={() => {
                return <div></div>
              }}
            >
              <Grid columns={2} gap={5}>
                <Grid.Item>
                  <PhotoView src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageFixExample/example1.jpeg">
                    <div style={{ position: 'relative' }}>
                      <div style={{ lineHeight: '30px', textAlign: 'center' }}>
                        原始图片
                      </div>
                      <img
                        src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageFixExample/example1.jpeg"
                        style={{ width: '100%' }}
                        alt=""
                      />
                    </div>
                  </PhotoView>
                </Grid.Item>
                <Grid.Item>
                  <PhotoView src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageFixExample/example1_fixed.png">
                    <div style={{ position: 'relative' }}>
                      <div style={{ lineHeight: '30px', textAlign: 'center' }}>
                        修复结果
                      </div>
                      <img
                        src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageFixExample/example1_fixed.png"
                        style={{ width: '100%' }}
                        alt=""
                      />
                    </div>
                  </PhotoView>
                </Grid.Item>
              </Grid>
            </PhotoProvider>
          </div>
        </div>
      </div>
      <div
        style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div style={{ width: '100%', padding: '0 10px' }}>
          <Button block shape="rounded" color="primary" onClick={onSubmit}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>立即修复</span>
              {avocadoInfo && (
                <span>，需消耗 {quality * avocadoInfo?.RepairPicture!}</span>
              )}
              {avocadoInfo && <Avocado />}
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}

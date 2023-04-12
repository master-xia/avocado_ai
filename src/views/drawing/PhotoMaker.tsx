import { createImageFix, createRemoveBg } from '@api/drawing'
import { getRemoveBgUplodaToAliyunOSSPolicyToken } from '@api/file'
import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { UploadSingleImage } from '@components/file/UploadSingleImage'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, Form, Grid, Selector, Slider } from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useNavigate } from 'react-router-dom'
export default function PhotoMaker() {
  const formRef = useRef<FormInstance>(null)
  const [fileInfo, setFileInfo] = useState<CheckFileResultVM>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])

  function onSubmit() {
    if (!fileInfo) {
      errorMsg('请上传需要制作证件照的图片')
      return
    }
    Dialog.confirm({
      title: '提示',
      content: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>
            <span>本次需要消耗{avocadoInfo?.RemoveBg!}</span>
            <Avocado />
            <span>是否进行抠图？</span>
          </span>
        </div>
      ),
      onConfirm: () => {
        createRemoveBg({
          SourceFileId: fileInfo.FileId,
          ModelType: 1,
          RemoveBgType: 1,
          BgColor: '#FFFFFF',
        })
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('创建成功')
              window.setTimeout(() => {
                navigate('/drawing/rembg/detail/' + res.Result, {
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
      <PageHeader title="AI制作证件照" />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
          overflow: 'auto',
        }}
      >
        <div style={{ padding: 10 }}>
          <Form ref={formRef}>
            <Form.Item
              label="拍摄的照片"
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
                getToken={getRemoveBgUplodaToAliyunOSSPolicyToken}
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
          </Form>
        </div>
        <div style={{ padding: 10 }}>
          <div>1.在明亮的房间里拍照。使用白色的墙壁作为背景。</div>
          <div>2.远离墙壁一米，否则墙壁上可能有阴影。</div>
          <div>3.使用三脚架。将相机位置调整到与眼睛水平的水平。</div>
          <div>
            4.调整相机距离时，请在头部顶部和照片顶部边框之间留出足够的空间。
          </div>
          <div>5.如果您是在白色墙壁上拍照，则墙壁上不应有任何装饰。</div>
          <div>6.直视镜头。两只耳朵应该可见。</div>
          <div>7.不要戴帽子。整个脸必须可见。</div>
          <div>
            8.如果可能，请勿戴眼镜，尤其是深色镜框的眼镜。如果必须戴眼镜，请确保眼镜上没有反射。两只眼睛必须清晰可见。
          </div>
          <div>9.前额和眉毛应该可见。不要用头发遮住眉毛。</div>
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
              <span>开始制作</span>
              {avocadoInfo && <span>，需消耗 {avocadoInfo?.RemoveBg!}</span>}
              {avocadoInfo && <Avocado />}
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}

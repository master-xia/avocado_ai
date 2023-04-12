import { createRemoveBg } from '@api/drawing'
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
export default function RemoveBg() {
  const formRef = useRef<FormInstance>(null)
  const [fileInfo, setFileInfo] = useState<CheckFileResultVM>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  let [selectModel, setSelectModel] = useState(0)
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  let models = useMemo(() => {
    return [
      { label: '通用', value: 0 },
      { label: '抠出人物', value: 1 },
      { label: '抠出服装', value: 2 },
      { label: '抠出物品', value: 3 },
    ]
  }, [])
  function onSubmit() {
    if (!fileInfo) {
      errorMsg('请上传需要抠图的图片')
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
          ModelType: selectModel,
          RemoveBgType: 0,
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
      <PageHeader title="AI抠图" />
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
            <Form.Item
              label="抠图类型"
              name="ModelType"
              initialValue={[selectModel]}
            >
              <Selector
                showCheckMark={false}
                options={models}
                columns={4}
                onChange={(arr, extend) => {
                  if (arr.length === 0) {
                    formRef.current?.setFieldValue('ModelType', [selectModel])
                  } else {
                    setSelectModel(arr[0])
                  }
                }}
                style={{ '--padding': '4px 6px', fontSize: 12 }}
              />
            </Form.Item>
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
                  <PhotoView src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageRemBgExample/example1_fixed.png">
                    <div style={{ position: 'relative' }}>
                      <div style={{ lineHeight: '30px', textAlign: 'center' }}>
                        原始图片
                      </div>
                      <img
                        src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageRemBgExample/example1_fixed.png"
                        style={{ width: '100%' }}
                        alt=""
                      />
                    </div>
                  </PhotoView>
                </Grid.Item>
                <Grid.Item>
                  <PhotoView src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageRemBgExample/example1_rembg.png">
                    <div style={{ position: 'relative' }}>
                      <div style={{ lineHeight: '30px', textAlign: 'center' }}>
                        抠图结果
                      </div>
                      <img
                        src="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/imageRemBgExample/example1_rembg.png"
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
              <span>开始抠图</span>
              {avocadoInfo && <span>，需消耗 {avocadoInfo?.RemoveBg!}</span>}
              {avocadoInfo && <Avocado />}
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}

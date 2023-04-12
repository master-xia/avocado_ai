import { getAiDrawingDetailsByConversationId } from '@api/drawing'
import { errorMsg } from '@utils/common'
import { Avatar, Button, ErrorBlock, Loading, Swiper } from 'antd-mobile'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  ForwardRefRenderFunction,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { RightOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'

interface IAiDrawingPictureList {
  ConversationId: string
  Status: number
}
export interface IAiDrawingPictureListRef {
  ImageCount: number
}
const AiDrawingPictureList: ForwardRefRenderFunction<
  IAiDrawingPictureListRef,
  IAiDrawingPictureList
> = (props: IAiDrawingPictureList, ref: Ref<IAiDrawingPictureListRef>) => {
  const [pictures, setPictures] = useState<DrawingPictureDetailInfoVM[]>([])
  const [curPicture, setCurPicture] = useState<DrawingPictureDetailInfoVM>()
  useImperativeHandle(ref, () => ({
    ImageCount: 0,
  }))

  useEffect(() => {
    if (props.Status === 4) {
      loadData()
    }
  }, [props.Status])

  function loadData() {
    getAiDrawingDetailsByConversationId(props.ConversationId).then((res) => {
      if (res.IsSuccess) {
        setPictures(res.Result!)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  return (
    <>
      {props.Status !== 4 && (
        <div>
          <div>
            <ErrorBlock
              style={{
                '--image-height': '150px',
              }}
              title={(() => {
                if (props.Status === 1) {
                  return '无操作'
                } else if (props.Status === 2) {
                  return (
                    <>
                      <span>AI马上开始绘制</span>
                      <Loading />
                    </>
                  )
                } else if (props.Status === 3) {
                  return (
                    <>
                      <span>AI正在绘制</span>
                      <Loading />
                    </>
                  )
                } else if (props.Status === 4) {
                  return '绘制成功'
                } else if (props.Status === 5) {
                  return '当前人数过多，Ai绘图失败。'
                }
                return ''
              })()}
              description={<></>}
            />
          </div>
        </div>
      )}
      {props.Status === 4 && (
        <>
          <PhotoProvider
            onIndexChange={(index) => {
              setCurPicture(pictures[index])
            }}
            onVisibleChange={(visible, index) => {
              if (visible) {
                setCurPicture(pictures[index])
              } else {
                setCurPicture(undefined)
              }
            }}
            photoClosable
            overlayRender={() => {
              return <div>{curPicture && <OwnerInfo {...curPicture} />}</div>
            }}
          >
            {pictures.map((m) => {
              if (m.Url === '') {
                return (
                  <div key={m.PictureId} style={{ position: 'relative' }}>
                    <div
                      style={{
                        textAlign: 'center',
                        height: '100vw',
                        backgroundColor: '#eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 40,
                          color: '#999',
                        }}
                      >
                        图片违规
                      </div>
                    </div>
                    <OwnerInfo {...m} />
                  </div>
                )
              }
              return (
                <PhotoView src={m.Url} key={m.Id}>
                  <div style={{ position: 'relative' }}>
                    <img src={m.Url} style={{ width: '100%' }} alt="" />
                    {!curPicture && <OwnerInfo {...m} />}
                  </div>
                </PhotoView>
              )
            })}
          </PhotoProvider>
        </>
      )}
    </>
  )
}
export default forwardRef(AiDrawingPictureList)

function OwnerInfo(m: DrawingPictureDetailInfoVM) {
  const navigate = useNavigate()
  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          opacity: 0.6,
          background: 'white',
          width: '100%',
          zIndex: 9999,
        }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate('/drawing/picture/' + m.PictureId)
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 30,
            padding: 10,
          }}
        >
          <div>
            <span>{m.Views}浏览</span>
            <span style={{ margin: '0 3px', color: '#999' }}>|</span>
            <span>{m.Likes}点赞</span>
            <span style={{ margin: '0 3px', color: '#999' }}>|</span>
            <span>{m.OwnerCount}授权</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span>查看无水印原图</span>
            <RightOutline />
          </div>
        </div>
      </div>
    </>
  )
}

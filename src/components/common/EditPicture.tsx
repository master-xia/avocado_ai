import { Form, Grid, Input, Picker, Popup, Selector } from 'antd-mobile'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
import SelectColor, { noColorBgImg } from './SelectColor'
import { CloseOutline } from 'antd-mobile-icons'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
interface IEditPictureProps {
  Image: string
  ShowPhotoType?: boolean
  onChange?: (data: RemBgEditInfoVM) => void
  initialData?: RemBgEditInfoVM
}

interface IPhotoType {
  label: string
  value: string
  ratio: string
  bgColor: string
}
interface ICropperCanvasData {
  left?: number
  top?: number
  width?: number
  height?: number
  naturalHeight?: number
  naturalWidth?: number
}
interface IDownloadImageData {
  width: number
  height: number
}
export default function EditPicture(props: IEditPictureProps) {
  const cropperRef = useRef<ReactCropperElement>(null)
  const selectRatioRef = useRef('')
  const selectPhotoTypeRef = useRef('')
  const [photoTypeVisible, setPhotoTypeVisible] = useState(false)
  const [dragMode, setDragMode] = useState('move')
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const bgColorRef = useRef('')
  const [imageData, setImageData] = useState<string | undefined>('')
  const [editData, setEditData] = useState<RemBgEditInfoVM>()
  const [downloadVisible, setDownloadVisible] = useState(false)
  const [downloadImageData, setDownloadImageData] =
    useState<IDownloadImageData>()
  const [flag, setFlag] = useState(0)
  var photoTypes = useMemo<IPhotoType[]>(() => {
    return [
      {
        label: '驾驶证',
        value: '驾驶证',
        ratio: '260:378',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '身份证',
        value: '身份证',
        ratio: '358:441',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '港澳通行证',
        value: '港澳通行证',
        ratio: '354:472',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '美国签证',
        value: '美国签证',
        ratio: '51:51',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '日本签证',
        value: '日本签证',
        ratio: '45:45',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '护照',
        value: '护照',
        ratio: '48:33',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '车照证件照',
        value: '车照证件照',
        ratio: '60:91',
        bgColor: 'rgba(255,255,255,1)',
      },
      {
        label: '小二寸证件照',
        value: '小二寸证件照',
        ratio: '35:45',
        bgColor: '',
      },
      {
        label: '1英寸',
        value: '1英寸',
        ratio: '25:35',
        bgColor: '',
      },
      {
        label: '2英寸',
        value: '2英寸',
        ratio: '35:49',
        bgColor: '',
      },
      {
        label: '3英寸',
        value: '3英寸',
        ratio: '50:72',
        bgColor: '',
      },
      {
        label: '其他',
        value: '',
        ratio: '',
        bgColor: '',
      },
    ]
  }, [])
  var selectPhotoTypeInfo = () => {
    return photoTypes.filter((m) => m.value === selectPhotoTypeRef.current)[0]
  }
  var ratios = (() => {
    if (selectPhotoTypeRef.current !== '') {
      return []
    }
    return [
      {
        label: (
          <span
            style={{ fontSize: 12 }}
            className="iconfont icon-caijian handlerItem"
          ></span>
        ),
        value: '',
      },
      {
        label: '1:1',
        value: '1:1',
      },
      {
        label: '9:16',
        value: '9:16',
      },
      {
        label: '16:9',
        value: '16:9',
      },
      {
        label: '3:4',
        value: '3:4',
      },
      {
        label: '4:3',
        value: '4:3',
      },
      {
        label: '1:2',
        value: '1:2',
      },
      {
        label: '2:1',
        value: '2:1',
      },
    ]
  })()
  function updateRatio(ratio: string) {
    ratio = ratio ?? ''
    var cropper = cropperRef.current?.cropper
    selectRatioRef.current = ratio
    if (ratio !== '') {
      var tmp = ratio.split(':')
      if (cropper) {
        cropper.setAspectRatio(parseFloat(tmp[0]) / parseFloat(tmp[1]))
      }
    } else {
      if (cropper) {
        cropper.setAspectRatio(NaN)
      }
    }
    selectRatioRef.current = ratio
  }
  function updateDragMode(mode: string) {
    setDragMode(mode)
    cropperRef.current?.cropper.setDragMode(mode as Cropper.DragMode)
  }
  function updateScaleX(x: number) {
    cropperRef.current?.cropper.scaleX(x)
    setScaleX(x)
  }
  function updateScaleY(y: number) {
    cropperRef.current?.cropper.scaleY(y)
    setScaleY(y)
  }
  function updateBgColor(color: string) {
    bgColorRef.current = color
    rerender()
  }
  function updateSelectPhotoType(t: string) {
    selectPhotoTypeRef.current = t
    var tmp = selectPhotoTypeInfo()
    if (tmp.value === '') {
      updateRatio('')
    } else {
      updateRatio(tmp.ratio)
    }
    if (tmp.bgColor !== '') {
      updateBgColor(tmp.bgColor)
    }
    rerender()
  }
  function rerender() {
    setFlag(new Date().getTime())
    updateCropperData()
  }
  var bgClass = `
  .editImg .cropper-bg{
    background-color:${bgColorRef.current} !important;
    background-image:none !important;}
.editImg .cropper-modal{
    background-color:${bgColorRef.current} !important;
}
    `
  function renderDownloadImage() {
    var imageData = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
    var cropData = cropperRef.current?.cropper.getData()!
    setImageData('')
    if (imageData) {
      var canvas: HTMLCanvasElement = document.createElement('canvas')
      canvas.height = cropData.height
      canvas.width = cropData.width

      var maxHeight = 300
      var maxWidth = 300
      var imgRatio = cropData.width / cropData.height
      if (maxWidth / imgRatio > maxHeight) {
        setDownloadImageData({
          width: maxHeight * imgRatio,
          height: maxHeight,
        })
      } else {
        setDownloadImageData({
          width: maxWidth,
          height: maxWidth / imgRatio,
        })
      }
      const context = canvas.getContext('2d')!
      if (bgColorRef.current !== '') {
        context.fillStyle = bgColorRef.current
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      var img = new Image()
      img.src = imageData
      img.onload = function () {
        context?.drawImage(img, 0, 0)
        setImageData(canvas.toDataURL())
        setDownloadVisible(true)
      }
    }
  }
  function updateCropperData() {
    var cropper = cropperRef.current!.cropper
    var imageData = cropper.getData()
    var cropData = cropper.getCropBoxData()
    var canvasData = cropper.getCanvasData()
    if (imageData.width && cropData.width && canvasData.width) {
      var data: RemBgEditInfoVM = {
        Height: imageData.height,
        Width: imageData.width,
        X: imageData.x,
        Y: imageData.y,
        ScaleX: imageData.scaleX,
        ScaleY: imageData.scaleY,
        Rotate: imageData.rotate,
        CropLeft: cropData.left,
        CropTop: cropData.top,
        CropWidth: cropData.width,
        CropHeight: cropData.height,
        BgColor: bgColorRef.current,
        Ratio: selectRatioRef.current,
        PhotoType: selectPhotoTypeRef.current,
        CanvasHeight: canvasData.height,
        CanvasWidth: canvasData.width,
        CanvasLeft: canvasData.left,
        CanvasNatureWidth: canvasData.naturalWidth,
        CanvasNatureHeight: canvasData.naturalWidth,
        CanvasTop: canvasData.top,
      }
      setEditData(data)
      if (props.onChange) {
        props.onChange(data)
      }
    }
  }

  function initCropper() {
    var m = props.initialData!
    var cropper = cropperRef.current!.cropper

    updateScaleX(m.ScaleX)
    updateScaleY(m.ScaleY)
    cropper.setData({
      width: m.Width,
      height: m.Height,
      rotate: m.Rotate,
      x: m.X,
      y: m.Y,
    })
    cropper.setCropBoxData({
      height: m.CropHeight,
      width: m.CropWidth,
      left: m.CropLeft,
      top: m.CropTop,
    })
    cropper.setCanvasData({
      height: m.CanvasHeight,
      width: m.CanvasWidth,
      left: m.CanvasLeft,
      top: m.CanvasTop,
    })
  }
  useEffect(() => {
    var checkInterval = -1
    if (props.initialData) {
      var m = props.initialData
      updateSelectPhotoType(m.PhotoType ?? '')
      updateBgColor(m.BgColor ?? '')
      updateRatio(m.Ratio ?? '')

      checkInterval = window.setInterval(() => {
        var cropper = cropperRef.current?.cropper
        if (cropper) {
          var imageData = cropper.getData()
          var cropData = cropper.getCropBoxData()
          var canvasData = cropper.getCanvasData()
          if (imageData.width && cropData.width && canvasData.width) {
            initCropper()
            window.clearInterval(checkInterval)
            checkInterval = -1
          }
        }
      }, 100)
    }
    return () => {
      if (checkInterval !== -1) window.clearInterval(checkInterval)
    }
  }, [])
  return (
    <>
      <div className="editImg">
        <Cropper
          guides={false}
          src={props.Image}
          style={{ height: 400, width: '100%' }}
          crop={(event) => {
            updateCropperData()
          }}
          dragMode={dragMode as Cropper.DragMode}
          ref={cropperRef}
        />
      </div>
      <div>
        <div style={{ padding: '10px 0' }}>
          <Grid columns={8} gap={5}>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-move handlerItem"
                  style={{
                    color:
                      dragMode === 'move' ? 'var(--adm-color-primary)' : '',
                  }}
                  onClick={() => {
                    updateDragMode('move')
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-caijian handlerItem"
                  style={{
                    color:
                      dragMode === 'crop' ? 'var(--adm-color-primary)' : '',
                  }}
                  onClick={() => {
                    updateDragMode('crop')
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xiangzuo handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.move(-10, 0)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xiangshang handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.move(0, -10)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-paixu handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.move(0, 10)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xiangyou handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.move(10, 0)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-suofangda handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.zoom(0.1)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-suofangxiao handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.zoom(-0.1)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-zuoyoufanzhuan handlerItem"
                  style={{
                    color: scaleX === -1 ? 'var(--adm-color-primary)' : '',
                  }}
                  onClick={() => {
                    updateScaleX(scaleX * -1)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-shangxiafanzhuan handlerItem"
                  style={{
                    color: scaleY === -1 ? 'var(--adm-color-primary)' : '',
                  }}
                  onClick={() => {
                    updateScaleY(scaleY * -1)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xuanzhuan-2 handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.rotate(-45)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xuanzhuan-1 handlerItem"
                  onClick={() => {
                    cropperRef.current?.cropper.rotate(45)
                  }}
                ></span>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <SelectColor
                  color={bgColorRef.current}
                  onChange={(color) => {
                    updateBgColor(color)
                  }}
                />
              </div>
            </Grid.Item>
            <Grid.Item>
              <div className="handlerItemCon">
                <span
                  className="iconfont icon-xiazai handlerItem"
                  onClick={() => {
                    renderDownloadImage()
                  }}
                ></span>
              </div>
            </Grid.Item>
          </Grid>
        </div>
        <Form>
          {props.ShowPhotoType && (
            <Form.Item
              label="证件类型"
              onClick={() => {
                setPhotoTypeVisible(true)
              }}
            >
              <Input value={selectPhotoTypeInfo().label} readOnly />
            </Form.Item>
          )}
          {ratios.length > 0 && (
            <Form.Item label="裁剪比例">
              <div style={{ maxHeight: 100, overflow: 'auto' }}>
                <Selector
                  columns={8}
                  showCheckMark={false}
                  options={ratios}
                  value={[selectRatioRef.current]}
                  onChange={(arr, extend) => {
                    if (arr.length === 0) {
                      return
                    }
                    updateRatio(arr[0])
                  }}
                  style={{ '--padding': '4px 6px', fontSize: 12 }}
                />
              </div>
            </Form.Item>
          )}
        </Form>
      </div>
      <Popup
        visible={downloadVisible}
        onMaskClick={() => {
          setDownloadVisible(false)
        }}
      >
        <div
          style={{
            color: '#666',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: 16,
          }}
        >
          长按图片保存
          <span
            style={{ position: 'absolute', right: 10 }}
            onClick={() => {
              setDownloadVisible(false)
            }}
          >
            <CloseOutline />
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: 300,
              width: 300,
              alignItems: 'center',
            }}
          >
            {imageData && (
              <PhotoProvider photoClosable>
                <PhotoView src={imageData}>
                  <div
                    style={{
                      width: downloadImageData?.width,
                      height: downloadImageData?.height,
                      backgroundImage:
                        bgColorRef.current === '' ? noColorBgImg : '',
                      border: '1px solid #eee',
                    }}
                  >
                    <img
                      src={imageData}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>
                </PhotoView>
              </PhotoProvider>
            )}
          </div>
        </div>
      </Popup>
      <Picker
        columns={[photoTypes]}
        visible={photoTypeVisible}
        onClose={() => {
          setPhotoTypeVisible(false)
        }}
        value={[selectPhotoTypeRef.current]}
        onConfirm={(v) => {
          updateSelectPhotoType(v[0] as string)
        }}
      />

      <style>
        {`
        .handlerItemCon{
            text-align:center;
        }
        .handlerItem{
            font-size:16px;
            color:#666;
        }
        .handlerItem:hover{
            color:#999;
        }
        .handlerItem:active{
            color:#999;
        }
        ${bgColorRef.current !== '' ? bgClass : ''}
      
        `}
      </style>
    </>
  )
}

import { Grid, Popup } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import { useEffect, useState } from 'react'
import {
  CustomPicker,
  HuePicker,
  AlphaPicker,
  MaterialPicker,
} from 'react-color'
import { InjectedColorProps } from 'react-color/lib/components/common/ColorWrap'
export const noColorBgImg =
  'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC)'
function SelectColor(props: InjectedColorProps) {
  const colors = [
    '#4D4D4D',
    '#999999',
    '#FFFFFF',
    '#F44E3B',
    '#FE9200',
    '#FCDC00',
    '#DBDF00',
    '#A4DD00',
    '#68CCCA',
    '#73D8FF',
    '#AEA1FF',
    '#FDA1FF',
    '#333333',
    '#808080',
    '#cccccc',
    '#D33115',
    '#E27300',
    '#FCC400',
    '#B0BC00',
    '#68BC00',
    '#16A5A5',
    '#009CE0',
    '#7B64FF',
    '#FA28FF',
    '#000000',
    '#666666',
    '#B3B3B3',
    '#9F0500',
    '#C45100',
    '#FB9E00',
    '#808900',
    '#194D33',
    '#0C797D',
    '#0062B1',
    '#653294',
    '#AB149E',
  ]
  const [alpha, setAlpha] = useState(1)
  function hexToRgba(hexColor: string, alpha?: number) {
    var sColor = hexColor.toLowerCase()
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = '#'
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      //处理六位的颜色值
      var sColorChange = []
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'rgba(' + sColorChange.join(',') + `,${alpha ?? 1})`
    }
    return sColor
  }
  return (
    <>
      <div style={{ padding: 10 }}>
        <div>
          <Grid columns={12} gap={5}>
            <Grid.Item>
              <div
                onClick={() => {
                  if (props.onChange) {
                    props.onChange('TRANSPARENT')
                  }
                }}
                style={{
                  height: 25,
                  width: 25,
                  backgroundImage: noColorBgImg,
                  borderRadius: 3,
                }}
              ></div>
            </Grid.Item>
            {colors.map((m) => (
              <div
                key={m}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  onClick={() => {
                    if (props.onChange) {
                      props.onChange(hexToRgba(m, alpha))
                    }
                  }}
                  style={{
                    height: 25,
                    width: 25,
                    background: m,
                    borderRadius: 3,
                  }}
                ></div>
              </div>
            ))}
          </Grid>
        </div>
        <div
          style={{ justifyContent: 'center', display: 'flex', marginTop: 20 }}
        >
          <div>
            <HuePicker
              color={props.rgb}
              onChange={(color) => {
                if (props.onChange) {
                  color.rgb.a = alpha
                  props.onChange(color.rgb)
                }
              }}
            />
            <div style={{ color: '#999', textAlign: 'center', marginTop: 4 }}>
              色调
            </div>
            <div style={{ marginTop: 10 }}>
              <AlphaPicker
                color={props.rgb}
                onChange={(color) => {
                  setAlpha(color.rgb.a ?? 1)
                  if (props.onChange) {
                    props.onChange(color.rgb)
                  }
                }}
              />
            </div>
            <div style={{ color: '#999', textAlign: 'center', marginTop: 4 }}>
              透明度
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <MaterialPicker
                color={props.rgb}
                onChange={(color) => {
                  if (props.onChange) {
                    color.rgb.a = alpha
                    props.onChange(color.rgb)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
const CustomerColorPicker = CustomPicker(SelectColor)

interface IWrapSelectColor {
  color: string
  onChange: (color: string) => void
  width?: number
  height?: number
  title?: string | JSX.Element
}
export default function WrapSelectColor(props: IWrapSelectColor) {
  const [color, setColor] = useState('')
  const [selecColorVisible, setSelecColorVisible] = useState(false)

  useEffect(() => {
    if (!props.color || props.color.trim() === '') {
      setColor('TRANSPARENT')
    } else {
      setColor(props.color)
    }
  }, [props.color])
  function updateColor(color: string) {
    setColor(color)
    props.onChange(color)
  }
  function clearColor() {
    setColor('TRANSPARENT')
    props.onChange('')
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: props.height ?? 15,
            width: props.width ?? 15,
            backgroundColor: color,
            backgroundImage: color === 'TRANSPARENT' ? noColorBgImg : '',
            border: '1px solid #999',
          }}
          onClick={() => {
            setSelecColorVisible(true)
          }}
        ></div>
      </div>
      <Popup
        visible={selecColorVisible}
        onMaskClick={() => {
          setSelecColorVisible(false)
        }}
        bodyStyle={{ height: 500 }}
      >
        <div
          style={{
            color: '#666',
            textAlign: 'center',
            lineHeight: '40px',
            fontSize: 16,
          }}
        >
          {props.title ?? '选择颜色'}
          <span
            style={{ position: 'absolute', right: 10 }}
            onClick={() => {
              setSelecColorVisible(false)
            }}
          >
            <CloseOutline />
          </span>
        </div>
        <div>
          <CustomerColorPicker
            color={color}
            onChange={(color) => {
              if (color.hex.toUpperCase() === 'TRANSPARENT') {
                clearColor()
              } else {
                var rgb = color.rgb
                updateColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a ?? 255})`)
              }
            }}
          />
        </div>
      </Popup>
      <style>
        {`
          .noColor{
            background-image:
          }
          `}
      </style>
    </>
  )
}

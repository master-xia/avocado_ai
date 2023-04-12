import { formatNumber, numberToChinese } from '@utils/common'
import type { FC } from 'react'
import { Popover } from 'antd-mobile'
import { Placement } from 'antd-mobile/es/components/popover'

export interface INumberProps {
  /**值 */
  val: number | undefined | null
  /**设置这个颜色就忽略其他设置的颜色 */
  color?: string
  /**是否显示符号如果是正数 ，默认不显示*/
  showSign?: boolean
  /**负数的颜色 默认red*/
  negativeColor?: string
  /**0的颜色 默认#666*/
  zeroColor?: string
  /**正数的颜色 默认green*/
  positiveColor?: string
  /**精度 */
  precise?: number
  /**是否格式化数字 10000->1000,0 */
  isFormatNumber?: boolean
  /**如果不是数字默认展示的文本 默认-- */
  defaultText?: string
  /**是否展示英文 默认false */
  showChinese?: boolean
  /**中文显示位置， 默认top */
  chinesePlacement?: Placement
  /**style */
  style?: any
  /**单位 */
  unit?: string
  /**是否展示单位 */
  showUnit?: boolean
}

function getCurrentColor(props: INumberProps): string {
  if (!isNumber(props)) {
    return props.zeroColor!
  }

  if (props.color) {
    return props.color
  }
  const n = props.val as number
  return n === 0
    ? props.zeroColor!
    : n > 0
    ? props.positiveColor!
    : props.negativeColor!
}
function isNumber(props: INumberProps): boolean {
  return typeof props.val === 'number'
}
function getText(props: INumberProps): string {
  let text = props.defaultText!
  if (isNumber(props)) {
    let n = props.val as number
    if (props.isFormatNumber) {
      if (props.isFormatNumber) {
        text = formatNumber(n, props.precise!)
      } else {
        text = n.toFixed(2)
      }
    }
    if (props.showSign! && n > 0) {
      text = '+' + text
    }
  }
  return text
}
/**展示金钱 ，点击会显示中文的钱*/
const NumberBase: FC<INumberProps> = (props) => {
  let color = getCurrentColor(props)
  let text = getText(props)
  let chinese =
    props.showChinese && isNumber(props)
      ? numberToChinese(props.val as number)
      : ''
  return (
    <>
      {props.showChinese ? (
        <Popover
          content={chinese}
          trigger="click"
          placement={props.chinesePlacement!}
          mode="dark"
        >
          <span style={{ color: color, ...props.style! }}>{text}</span>
        </Popover>
      ) : (
        <span style={{ color: color, ...props.style! }}>{text}</span>
      )}
      {props.unit && props.showUnit && (
        <span
          style={{
            color: '#969696',
            marginLeft: 3,
            fontSize: 12,
          }}
        >
          {props.unit}
        </span>
      )}
    </>
  )
}

NumberBase.defaultProps = {
  showSign: false,
  negativeColor: 'red',
  zeroColor: '#666',
  positiveColor: 'green',
  precise: 2,
  isFormatNumber: true,
  defaultText: '--',
  style: {},
  showChinese: false,
  chinesePlacement: 'top',
  showUnit: true,
}

/**显示钱 */
const NumberMoney: FC<INumberProps> = (props) => {
  return <NumberBase {...props} />
}
NumberMoney.defaultProps = {
  showChinese: true,
  unit: '元',
  precise: 0,
}

/**显示重量,会把重量g转成kg */
interface INumberWeightProps {
  /**divider重量会除这个数，默认1000 */
  divider?: number
}
const NumberWeight: FC<INumberProps & INumberWeightProps> = (props) => {
  return <NumberBase {...props} val={props.val ?? 0} />
}
NumberWeight.defaultProps = {
  unit: '克',
  divider: 1000,
}

/**显示百分比 */
const NumberPercentage: FC<INumberProps> = (props) => {
  return <NumberBase {...props} />
}
NumberPercentage.defaultProps = {
  unit: '%',
}
/**价格*/
const NumberPrice: FC<INumberProps> = (props) => {
  return <NumberBase {...props} />
}
NumberPrice.defaultProps = {
  unit: '元/g',
}
/**显示盈亏 会有正负*/
const NumberProfit: FC<INumberProps> = (props) => {
  return <NumberMoney {...props} />
}
NumberProfit.defaultProps = {
  showSign: true,
}
/**显示盈亏率 会有正负*/
const NumberProfitRate: FC<INumberProps> = (props) => {
  return <NumberPercentage {...props} />
}
NumberProfitRate.defaultProps = {
  showSign: true,
}
export const Money = NumberMoney
export const Weight = NumberWeight
export const Percentage = NumberPercentage
export const Profit = NumberProfit
export const ProfitRate = NumberProfitRate
export const Price = NumberPrice
export const Number = NumberBase

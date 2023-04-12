import { formatDate } from '@utils/common'
import React, { FC } from 'react'
interface IDatetimeProps {
  datetime: Date | string | undefined
  type?: 'date' | 'datetime'
  format?: string
  style?: React.CSSProperties
  default?: string
}
export const Datetime: FC<IDatetimeProps> = (props) => {
  const format =
    props.format ??
    (props.type === 'date' ? 'yyyy年MM月dd日' : 'yyyy年MM月dd日 hh:mm:ss')
  const text = props.datetime
    ? formatDate(props.datetime, format)
    : props.default
  return <span style={{ ...props.style }}>{text}</span>
}
Datetime.defaultProps = {
  type: 'date',
  default: '--',
}

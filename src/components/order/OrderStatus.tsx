import { Tag } from 'antd-mobile'
import { FC } from 'react'
interface IOrderStatusProps {
  value: number | undefined
  style?: React.CSSProperties
  type?: 'tag' | 'text'
}
export const OrderStatus: FC<IOrderStatusProps> = (
  props: IOrderStatusProps
) => {
  let text = '未知'
  let color = 'default'
  switch (props.value) {
    case 1:
      text = '未支付'
      color = 'default'
      break
    case 2:
      text = '已支付'
      color = 'success'
      break
    case 10:
      text = '已取消'
      color = 'danger'
      break
  }
  let element = <></>
  if (props.type === 'tag') {
    element = (
      <>
        <Tag
          color={color}
          style={{ minWidth: 50, textAlign: 'center', ...props.style! }}
        >
          {text}
        </Tag>
      </>
    )
  } else if (props.type === 'text') {
    element = (
      <>
        <span style={{ ...props.style! }}>{text}</span>
      </>
    )
  }
  return element
}
OrderStatus.defaultProps = {
  type: 'tag',
}

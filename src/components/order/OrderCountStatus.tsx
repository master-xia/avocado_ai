import { Tag } from 'antd-mobile'
import { FC } from 'react'
interface IOrderCountStatusProps {
  value: number | undefined
  style?: React.CSSProperties
  type?: 'tag' | 'text'
}
export const OrderCountStatus: FC<IOrderCountStatusProps> = (
  props: IOrderCountStatusProps
) => {
  let text = '未知'
  let color = 'default'
  switch (props.value) {
    case 1:
      text = '待审核'
      color = 'default'
      break
    case 2:
      text = '审核通过'
      color = 'success'
      break
    case 3:
      text = '审核失败'
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
OrderCountStatus.defaultProps = {
  type: 'tag',
}

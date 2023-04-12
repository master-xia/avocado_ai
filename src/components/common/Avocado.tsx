import React, { FC } from 'react'

interface IAvocado {
  height?: string | number
  width?: string | number
  style?: React.CSSProperties
}
const Avocado: FC<IAvocado> = (props: IAvocado) => {
  return (
    <>
      <img
        src="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/avocado.png?x-oss-process=style/jmms"
        alt="avocado"
        style={{
          height: props.height,
          width: props.width,
          ...props.style,
        }}
      />
    </>
  )
}
Avocado.defaultProps = {
  height: 24,
  width: 22,
}
export default Avocado

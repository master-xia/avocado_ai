import { PropsWithChildren, FC } from 'react'
import { DotLoading } from 'antd-mobile'
/**
 * 全局加载框
 * @returns
 */
interface IGlobalLoadingProps {
  timeout?: Number
}
export const GlobalLoading: FC<PropsWithChildren<IGlobalLoadingProps>> = (
  props
) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ margin: 'auto' }}>
        <div style={{ fontSize: 24 }}>
          <DotLoading />
        </div>
        <div>加载中...</div>
      </div>
    </div>
  )
}

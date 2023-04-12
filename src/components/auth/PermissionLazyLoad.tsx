import Permission from './Permission'
import { Suspense } from 'react'
import { GlobalLoading } from '../common/GlobalLoading'
/**
 * @param Component 懒加载的组件
 * @param code 用于判断权限的字段
 * @returns
 */
const PermissionLazyLoad = (
  Component: React.LazyExoticComponent<() => JSX.Element>,
  code?: string
) => {
  return (
    <Permission code={code}>
      <Suspense fallback={<GlobalLoading />}>
        <Component />
      </Suspense>
    </Permission>
  )
}
export default PermissionLazyLoad

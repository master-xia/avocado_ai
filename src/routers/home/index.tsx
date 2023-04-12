import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Index = lazy(() => import('@views/home/Index'))
const NoWatermark = lazy(() => import('@views/home/NoWatermark'))
const NoWatermarkDetail = lazy(() => import('@views/home/NoWatermarkDetail'))
const BindWxOfficialAccount = lazy(
  () => import('@views/user/BindWxOfficialAccount')
)

const routes: RouteObject = {
  path: '/',
  children: [
    {
      path: 'home',
      element: PermissionLazyLoad(Index, 'home'),
    },
    {
      path: 'b/:bindKey',
      element: PermissionLazyLoad(
        BindWxOfficialAccount,
        'BindWxOfficialAccount'
      ),
    },
    {
      path: 'noWatermark',
      element: PermissionLazyLoad(NoWatermark, 'NoWatermark'),
    },
    {
      path: 'noWatermark/detail/:contentId',
      element: PermissionLazyLoad(NoWatermarkDetail, 'NoWatermark'),
    },
  ],
}

export default routes

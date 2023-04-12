import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const OrderList = lazy(() => import('@views/admin/order/OrderList'))
const routes: RouteObject = {
  path: '/admin/order',
  children: [
    {
      path: 'list',
      element: PermissionLazyLoad(OrderList, 'OrderList'),
    },
    {
      path: 'list/:tab',
      element: PermissionLazyLoad(OrderList, 'OrderList'),
    },
  ],
}

export default routes

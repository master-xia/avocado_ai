import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Buy = lazy(() => import('@views/order/Buy'))
const OrderListAdmin = lazy(() => import('@views/admin/order/OrderList'))
const routes: RouteObject = {
  path: '/order',
  children: [
    {
      path: 'buy',
      element: PermissionLazyLoad(Buy, 'Buy'),
    },
  ],
}

export default routes

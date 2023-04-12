import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const PrivacyInfo = lazy(() => import('@views/system/PrivacyInfo'))
const Report = lazy(() => import('@views/system/Report'))
const ContactMe = lazy(() => import('@views/system/ContactMe'))
const GetCountTips = lazy(() => import('@views/system/AvocadoTips'))

const routes: RouteObject = {
  path: '/system',
  children: [
    {
      path: 'privacy',
      element: PermissionLazyLoad(PrivacyInfo, 'PrivateInfo'),
    },
    {
      path: 'report',
      element: PermissionLazyLoad(Report, 'Report'),
    },
    {
      path: 'contactMe',
      element: PermissionLazyLoad(ContactMe, 'ContactMe'),
    },
    {
      path: 'avocadoTips',
      element: PermissionLazyLoad(GetCountTips, 'GetCountTips'),
    },
  ],
}

export default routes

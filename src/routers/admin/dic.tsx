import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const DicList = lazy(() => import('@views/admin/dic/DicList'))
const AddDic = lazy(() => import('@views/admin/dic/AddDic'))
const EditDic = lazy(() => import('@views/admin/dic/EditDic'))

const routes: RouteObject = {
  path: '/admin/dic',
  children: [
    {
      path: 'list',
      element: PermissionLazyLoad(DicList, 'DicInfoList'),
    },
    {
      path: 'list/:domain',
      element: PermissionLazyLoad(DicList, 'DicInfoList'),
    },
    {
      path: 'add',
      element: PermissionLazyLoad(AddDic, 'AddDicInfo'),
    },
    {
      path: 'add/:domain',
      element: PermissionLazyLoad(AddDic, 'AddDicInfo'),
    },
    {
      path: ':id',
      element: PermissionLazyLoad(EditDic, 'EditDicInfo'),
    },
  ],
}
export default routes

import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Check = lazy(() => import('@views/admin/content/Index'))
const CheckConversation = lazy(
  () => import('@views/admin/content/CheckConversation')
)
const CheckComment = lazy(() => import('@views/admin/content/CheckComment'))
const CheckMessage = lazy(() => import('@views/admin/content/CheckMessage'))
const CheckRemBg = lazy(() => import('@views/admin/content/CheckRemBg'))
const CheckImageFix = lazy(() => import('@views/admin/content/CheckImageFix'))
const routes: RouteObject = {
  path: '/admin/content',
  children: [
    {
      path: 'check',
      element: PermissionLazyLoad(Check, 'Check'),
    },
    {
      path: 'check/conversation',
      element: PermissionLazyLoad(CheckConversation, 'Check'),
    },
    {
      path: 'check/comment',
      element: PermissionLazyLoad(CheckComment, 'Check'),
    },
    {
      path: 'check/imageFix',
      element: PermissionLazyLoad(CheckImageFix, 'Check'),
    },
    {
      path: 'check/rembg',
      element: PermissionLazyLoad(CheckRemBg, 'Check'),
    },
    {
      path: 'check/message',
      element: PermissionLazyLoad(CheckMessage, 'Check'),
    },
  ],
}

export default routes

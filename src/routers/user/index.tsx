import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '@components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Index = lazy(() => import('@views/user/Index'))
const Login = lazy(() => import('@views/user/Login'))
const Info = lazy(() => import('@views/user/Info'))
const Invite = lazy(() => import('@views/user/Invite'))
const Sign = lazy(() => import('@views/user/Sign'))
const NotificationList = lazy(() => import('@views/user/NotificationList'))
const UpdateProfile = lazy(() => import('@views/user/UpdateProfile'))
const ChatHistory = lazy(() => import('@views/user/ChatHistory'))
const PublicHistory = lazy(() => import('@views/user/PublicHistory'))
const DrawingHistory = lazy(() => import('@views/user/DrawingHistory'))
const OwnershipList = lazy(() => import('@views/user/OwnershipList'))

const routes: RouteObject = {
  path: '/user',
  children: [
    {
      path: '',
      element: PermissionLazyLoad(Index, 'User.Index'),
    },
    {
      path: 'sign',
      element: PermissionLazyLoad(Sign, 'User.Sign'),
      children: [],
    },
    {
      path: 'login',
      element: PermissionLazyLoad(Login, 'User.Login'),
      children: [],
    },
    {
      path: 'invite',
      element: PermissionLazyLoad(Invite, 'User.Invite'),
      children: [],
    },
    {
      path: 'info',
      element: PermissionLazyLoad(Info, 'User.Info'),
      children: [],
    },
    {
      path: 'notification/list',
      element: PermissionLazyLoad(NotificationList, 'User.NotificationList'),
      children: [],
    },
    {
      path: 'notification/list/:tabName',
      element: PermissionLazyLoad(NotificationList, 'User.NotificationList'),
      children: [],
    },
    {
      path: 'edit',
      element: PermissionLazyLoad(UpdateProfile, 'User.UpdateProfile'),
      children: [],
    },
    {
      path: 'chatHistory',
      element: PermissionLazyLoad(ChatHistory, 'User.ChatHistory'),
      children: [],
    },
    {
      path: 'publicHistory',
      element: PermissionLazyLoad(PublicHistory, 'User.PublicHistory'),
      children: [],
    },
    {
      path: 'drawingHistory',
      element: PermissionLazyLoad(DrawingHistory, 'User.DrawingHistory'),
      children: [],
    },
    {
      path: 'ownership/list',
      element: PermissionLazyLoad(OwnershipList, 'User.OwnershipList'),
      children: [],
    },
  ],
}

export default routes

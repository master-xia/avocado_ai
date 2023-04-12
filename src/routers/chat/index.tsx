import { Navigate, RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

// const Chat = lazy(() => import('@views/chat/Chat'))
// const ChatList = lazy(() => import('@views/user/ChatList'))
const Detail = lazy(() => import('@views/chat/Detail'))
const Create = lazy(() => import('@views/chat/Create'))
const routes: RouteObject = {
  path: '/chat',
  children: [
    {
      path: '',
      element: <Navigate to="/home" />,
    },
    // {
    //   path: 'list',
    //   element: PermissionLazyLoad(ChatList, 'Chat'),
    // },
    // {
    //   path: 'list/:tab',
    //   element: PermissionLazyLoad(ChatList, 'Chat'),
    // },
    {
      path: ':conversationId',
      element: PermissionLazyLoad(Detail, 'Chat'),
    },
    {
      path: 'create',
      element: PermissionLazyLoad(Create, 'Chat.Create'),
    },
  ],
}

export default routes

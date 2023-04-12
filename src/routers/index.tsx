import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import IndexLayout from '@views/layout/AppLayout'
import ErrorPage from '@views/errors/ErrorPage'
import Page404 from '@views/errors/Page404'
import { checkReferCode } from '@api/user'
import CheckReferCode from '@views/user/CheckReferCode'
/**
 * 跟加载器，获取用户信息,加载菜单，并鉴权,其他路由可以获取这个loader的返回值信息
 * 通过useRouteLoaderData('root')
 */
const rootLoader = async (data: any) => {
  return {}
}

const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" />,
  },
  {
    path: '/',
    loader: rootLoader,
    errorElement: <ErrorPage />,
    element: <IndexLayout />,
    children: [
      require('./home').default,
      require('./chat').default,
      require('./user').default,
      require('./drawing').default,
      require('./system').default,
      require('./order').default,
      require('./public').default,
      require('./admin/order').default,
      require('./admin/dic').default,
      require('./admin/content').default,
    ],
  },
  {
    path: '/404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <CheckReferCode />,
  },
]

export const routes = createBrowserRouter(routerConfig)

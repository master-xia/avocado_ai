import type { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Index = lazy(() => import('@views/public/Index'))
const Create = lazy(() => import('@views/public/Create'))
const Detail = lazy(() => import('@views/public/Detail'))
const Records = lazy(() => import('@views/public/Records'))
const Search = lazy(() => import('@views/public/Search'))
const CategoryIndex = lazy(() => import('@views/public/CategoryIndex'))
const routes: RouteObject = {
  path: '/p',
  children: [
    {
      path: '',
      element: PermissionLazyLoad(Index, 'Index'),
    },
    {
      path: 'create',
      element: PermissionLazyLoad(Create, 'Create'),
    },
    {
      path: 'create/:categoryId',
      element: PermissionLazyLoad(Create, 'Create'),
    },
    {
      path: ':conversationId',
      element: PermissionLazyLoad(Detail, 'Detail'),
    },
    {
      path: 'actions/history/:tab',
      element: PermissionLazyLoad(Records, 'Records'),
    },
    {
      path: 'search',
      element: PermissionLazyLoad(Search, 'Search'),
    },
    {
      path: 'search/:categoryId',
      element: PermissionLazyLoad(Search, 'Search'),
    },
    {
      path: 'category/:categoryId',
      element: PermissionLazyLoad(CategoryIndex, 'Search'),
    },
  ],
}

export default routes

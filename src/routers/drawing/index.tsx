import { RouteObject } from 'react-router-dom'
import PermissionLazyLoad from '../../components/auth/PermissionLazyLoad'
import { lazy } from 'react'

const Create = lazy(() => import('@views/drawing/Create'))
const PictureDetail = lazy(() => import('@views/drawing/PictureDetail'))
const ImageFix = lazy(() => import('@views/drawing/ImageFix'))
const ImageFixDetail = lazy(() => import('@views/drawing/ImageFixDetail'))
const ImageFixList = lazy(() => import('@views/drawing/ImageFixList'))

const RemoveBg = lazy(() => import('@views/drawing/RemoveBg'))
const RemoveBgDetail = lazy(() => import('@views/drawing/RemoveBgDetail'))
const RemoveBgList = lazy(() => import('@views/drawing/RemoveBgList'))
const PhotoMaker = lazy(() => import('@views/drawing/PhotoMaker'))
const routes: RouteObject = {
  path: '/drawing',
  children: [
    {
      path: 'create',
      element: PermissionLazyLoad(Create, 'Drawing.Create'),
    },
    {
      path: 'picture/:pictureId',
      element: PermissionLazyLoad(PictureDetail, 'Drawing.PictureDetail'),
    },
    {
      path: 'fix',
      element: PermissionLazyLoad(ImageFix, 'Drawing.ImageFix'),
    },
    {
      path: 'fix/detail/:fixId',
      element: PermissionLazyLoad(ImageFixDetail, 'Drawing.ImageFixDetail'),
    },
    {
      path: 'fix/list',
      element: PermissionLazyLoad(ImageFixList, 'Drawing.ImageFixList'),
    },
    {
      path: 'rembg',
      element: PermissionLazyLoad(RemoveBg, 'Drawing.RemoveBg'),
    },
    {
      path: 'rembg/detail/:removeId',
      element: PermissionLazyLoad(RemoveBgDetail, 'Drawing.RemoveBgDetail'),
    },
    {
      path: 'rembg/list/:remBgType',
      element: PermissionLazyLoad(RemoveBgList, 'Drawing.RemoveBgList'),
    },
    {
      path: 'photoMaker',
      element: PermissionLazyLoad(PhotoMaker, 'Drawing.PhotoMaker'),
    },
  ],
}

export default routes

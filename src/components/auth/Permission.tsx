import { useAppSelector } from '@store/hooks'
import { FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
interface IPermissionProps {
  code?: string
}
/**
 * 用来鉴权
 * @param props
 * @returns
 */
const Permission: FC<PropsWithChildren<IPermissionProps>> = (props) => {
  const [visible, setVisible] = useState(false)
  const auth = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  let location = useLocation()
  useEffect(() => {
    if (auth.loginStatus !== undefined) {
      //进行页面鉴权
      let path = window.location.pathname.toLowerCase()

      if (
        auth.onlyAnonymousPaths.filter((m) => m.test(path)).length > 0 &&
        auth.loginStatus
      ) {
        //页面只允许匿名访问,直接跳转到首页
        navigate('/', { replace: true })
      } else if (
        auth.ignoreAuthPaths.filter((m) => m.test(path)).length === 0 &&
        !auth.loginStatus
      ) {
        //页面需要登录后才能访问
        navigate('/user/login', { replace: true })
      } else {
        setVisible(true)
      }
    }
  }, [location, auth.loginStatus])

  return <>{visible ? props.children : <></>}</>
}

export default Permission

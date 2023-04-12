import { useAppDispatch, useAppSelector } from '@store/hooks'
import {
  updateLoginStatusAsync,
  updateUserStatusAsync,
  updateUserInfoAsync,
} from '@store/modules/auth'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function CheckAuthTimer() {
  let navigate = useNavigate()
  let dispatch = useAppDispatch()
  let loginStatus = useAppSelector((state) => state.auth.loginStatus)
  let userInfo = useAppSelector((m) => m.auth.userInfo)
  let location = useLocation()
  let [queryLoginStatusInterval, setQeryLoginStatusInterval] = useState(-1)
  let [
    queryUnreadNotificationCountInterval,
    setQueryUnreadNotificationCountInterval,
  ] = useState(-1)
  useEffect(() => {
    let pathName = window.location.pathname.toLowerCase()
    if (userInfo && !userInfo.ChangedProfile && pathName !== '/user/edit') {
      //强制用户修改一次个人资料
      navigate('/user/edit')
    }
  }, [userInfo])
  useEffect(() => {
    if (loginStatus) {
      dispatch(updateUserInfoAsync(true))
      dispatch(updateUserStatusAsync(true))
      startQueryUserStatus()
    }
  }, [loginStatus])

  useEffect(() => {
    //每分钟更新一下登录状态
    dispatch(updateLoginStatusAsync(false))
    startQueryLoginStatus()
    return () => {
      window.clearInterval(queryLoginStatusInterval)
      window.clearInterval(queryUnreadNotificationCountInterval)
    }
  }, [])

  function startQueryLoginStatus() {
    setQeryLoginStatusInterval(
      window.setInterval(() => {
        dispatch(updateLoginStatusAsync(true))
      }, 1000 * 60)
    )
  }
  function startQueryUserStatus() {
    setQueryUnreadNotificationCountInterval(
      window.setInterval(() => {
        dispatch(updateUserStatusAsync(true))
      }, 3000)
    )
  }
  return <></>
}
export default CheckAuthTimer

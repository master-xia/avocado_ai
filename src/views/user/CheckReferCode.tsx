import { checkReferCode } from '@api/user'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function CheckReferCode() {
  let navigate = useNavigate()
  let location = useLocation()
  useEffect(() => {
    var code = window.location.pathname.replace('/', '')
    if (/^[A-Za-z0-9]{6,10}$/.test(code)) {
      checkReferCode(code)
        .then((res) => {
          if (res.IsSuccess) {
            localStorage.setItem('referCode', code)
            navigate('/', { replace: true })
          } else {
            navigate('/', { replace: true })
          }
        })
        .catch(() => {
          navigate('/', { replace: true })
        })
    }
  }, [location])
  return <></>
}

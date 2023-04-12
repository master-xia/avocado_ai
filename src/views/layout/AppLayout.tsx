import { useAppSelector } from '@store/hooks'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import CheckAuthTimer from '@components/auth/CheckAuthTimer'
import { useEffect, useState } from 'react'
import { isPC } from '@utils/common'
function IndexLayout() {
  const footerStatus = useAppSelector((state) => state.settings.footerStatus)
  const [height, setHeight] = useState(document.documentElement.clientHeight)
  let rate = 0.462
  const [maxWidth, setMaxWidth] = useState(document.documentElement.clientWidth)
  useEffect(() => {
    onSizeChange()
    window.addEventListener('resize', onSizeChange)
    return () => {
      window.removeEventListener('resize', onSizeChange)
    }
    return () => {}
  }, [])
  function onSizeChange() {
    setHeight(document.documentElement.clientHeight)
    if (isPC()) {
      setMaxWidth(document.documentElement.clientHeight * rate)
    }
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className="page-container">
          <div style={{ width: '100%', backgroundColor: 'white' }}>
            <div
              style={{
                background: 'rgb(245, 247, 250)',
                height: footerStatus.isShow
                  ? 'calc(' + height + 'px - 50px)'
                  : height + 'px',
                overflow: 'auto',
                width: '100%',
              }}
            >
              <Outlet />
            </div>
            <CheckAuthTimer />
            <div className="footer-container">
              <div style={{ width: '100%' }}>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
        .page-container{
          width:100vw;
          max-width:${maxWidth}px;
          display:flex;
          justify-content:center;
        }
        .footer-container{
          width:100vw;
          max-width:${maxWidth}px;
          display:flex;
          justify-content:center;
          position:fixed;
          bottom:0;
        }
        `}
      </style>
    </>
  )
}
export default IndexLayout

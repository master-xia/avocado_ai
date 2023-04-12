import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingBubble, TabBar } from 'antd-mobile'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateFooterStatus } from '@store/modules/settings'
import { MessageFill } from 'antd-mobile-icons'

interface FootInfo {
  Key: string
  Pathes: Set<string>
}
//展示footer的路由
const footerMap: FootInfo[] = [
  { Key: 'user', Pathes: new Set<string>(['/user']) },
  { Key: 'chat', Pathes: new Set<string>(['/chat']) },
  { Key: 'home', Pathes: new Set<string>(['/home']) },
  { Key: 'public', Pathes: new Set<string>(['/p']) },
  { Key: 'question', Pathes: new Set<string>(['/chat/question']) },
]
export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const footerStatus = useAppSelector((state) => state.settings.footerStatus)
  const dispatch = useAppDispatch()
  const hasUnreadNotification = useAppSelector(
    (state) => state.auth.status.HasUnreadNotification
  )
  const tabItemClick = (key: string) => {
    switch (key) {
      case 'home':
        navigate('/home')
        break
      case 'chat':
        navigate('/chat')
        break
      case 'public':
        navigate('/p')
        break
      case 'user':
        navigate('/user')
        break
    }
  }
  function updateFooter(isShow: boolean, activeKey: string) {
    if (
      footerStatus.isShow !== isShow ||
      footerStatus.activeKey !== activeKey
    ) {
      dispatch(updateFooterStatus({ isShow: isShow, activeKey: activeKey }))
    }
  }
  useEffect(() => {
    //更新是否需要展示footer
    const pathName = location.pathname
    for (let i = 0; i < footerMap.length; i++) {
      if (footerMap[i].Pathes.has(pathName)) {
        updateFooter(true, footerMap[i].Key)
        return
      }
    }
    for (let key in footerMap.keys) {
      console.log(key)
    }
    updateFooter(false, '')
  }, [location])

  let loginStatus = useAppSelector((state) => state.auth.loginStatus)
  return (
    <>
      {loginStatus && (
        <></>
        // <FloatingBubble
        //   style={{
        //     '--initial-position-bottom': '130px',
        //     '--initial-position-right': '24px',
        //     '--edge-distance': '24px',
        //     '--size': '70px',
        //     '--border-radius': '25px',
        //     '--background': 'var(--adm-color-primary)',
        //   }}
        //   onClick={() => {
        //     navigate('/user/invite')
        //   }}
        // >
        //   <div>
        //     <div style={{ textAlign: 'center' }}>
        //       <span
        //         className="iconfont icon-yaoqingyouli"
        //         style={{ fontSize: 28 }}
        //       ></span>
        //     </div>
        //     <div style={{ fontSize: 12 }}>邀请好友</div>
        //   </div>
        // </FloatingBubble>
      )}
      {footerStatus.isShow ? (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
          }}
        >
          <TabBar
            activeKey={footerStatus.activeKey}
            onChange={(key) => tabItemClick(key)}
          >
            {/* <TabBar.Item
              key={'chat'}
              icon={
                <span
                  className="iconfont icon-xiaoxi"
                  style={{ fontSize: 20 }}
                ></span>
              }
              title={'聊天'}
            /> */}
            <TabBar.Item
              key={'home'}
              icon={
                <span
                  className="iconfont icon-shouye"
                  style={{ fontSize: 20 }}
                ></span>
              }
              title={'首页'}
            />
            <TabBar.Item
              key={'public'}
              icon={
                <span
                  className="iconfont icon-shequhuodong"
                  style={{ fontSize: 20 }}
                ></span>
              }
              title={'社区'}
            />
            <TabBar.Item
              key={'user'}
              icon={
                <span className="iconfont icon-wode" style={{ fontSize: 20 }}>
                  {hasUnreadNotification ? (
                    <div
                      style={{
                        height: 8,
                        width: 8,
                        borderRadius: 4,
                        background: 'red',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                      }}
                    ></div>
                  ) : undefined}
                </span>
              }
              title={'我的'}
            />
          </TabBar>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

import { logintOut } from '@api/user'
import Avocado from '@components/common/Avocado'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateUserInfoAsync } from '@store/modules/auth'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'

import { logout } from '@utils/auth'
import { successMsg } from '@utils/common'
import { Avatar, Button, Dialog, Grid, List, Tag } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export default function UserIndex() {
  const navigate = useNavigate()
  const userInfo = useAppSelector((state) => state.auth.userInfo)
  const hasUnreadNotification = useAppSelector(
    (state) => state.auth.status.HasUnreadNotification
  )
  const loginStatus = useAppSelector((state) => state.auth.loginStatus)
  const dispatch = useAppDispatch()
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  let hasUnpaidOrder = useAppSelector((m) => m.auth.status.HasUnpaidOrder)
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  useEffect(() => {
    document.title = '我的信息'
  }, [])
  useEffect(() => {
    if (loginStatus) {
      dispatch(updateUserInfoAsync(true))
      if (avocadoInfo === undefined) {
        dispatch(updateAvocadoInfoAsyn())
      }
      //拉取未读消息数量
      if (hasUnreadNotification) {
        /*
        getUnreadNotificationCount(true).then((res) => {
          if (res.IsSuccess) {
            setUnreadNotificationCount(res.Result!)
          }
        })
        */
      }
    }
  }, [loginStatus, hasUnreadNotification])
  useEffect(() => {
    if (userInfo) {
      let key = 'showedAvocadoTips_' + userInfo!.UserName
      let flag = localStorage.getItem(key)
      if (!flag) {
        localStorage.setItem(key, '1')
        navigate('/system/avocadoTips')
      }
    }
  }, [userInfo])
  function logoutAction() {
    logintOut().then((res) => {
      if (res.IsSuccess) {
        successMsg('退出登录成功')
        window.setTimeout(() => {
          logout()
        }, 500)
      }
    })
  }
  return (
    <>
      <div style={{ background: 'gold', position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <Avatar
            src={userInfo?.Header ?? ''}
            style={{
              '--border-radius': '50%',
              '--size': '60px',
              padding: 10,
            }}
          />
          {userInfo && (
            <div>
              <div style={{ marginTop: 15 }}>
                <div style={{ display: 'flex' }}>
                  <span
                    style={{ color: 'var(--adm-color-text)', fontSize: 18 }}
                  >
                    <span
                      onClick={(e) => {
                        navigate('/user/info')
                      }}
                    >
                      {userInfo.Name}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ color: 'var(--adm-color-text-secondary)' }}>
                  {userInfo.UserName}
                </span>
              </div>
            </div>
          )}

          {userInfo && (
            <span style={{ marginLeft: 'auto', fontSize: 14, padding: 5 }}>
              <span
                onClick={() => {
                  navigate('/user/sign')
                }}
              >
                {!userInfo.IsSignToday && (
                  <div style={{ textAlign: 'center' }}>
                    <div>
                      <span
                        className="iconfont icon-qiandao"
                        style={{ fontSize: 25 }}
                      ></span>
                    </div>
                    <div style={{ fontSize: 12 }}>每日签到</div>
                  </div>
                )}
                {userInfo.IsSignToday && (
                  <div style={{ textAlign: 'center' }}>
                    <div>
                      <span
                        className="iconfont icon-yiqiandao"
                        style={{ fontSize: 25 }}
                      ></span>
                    </div>
                    <div style={{ fontSize: 12 }}>已签到</div>
                  </div>
                )}
              </span>
            </span>
          )}
          {!userInfo && (
            <div
              style={{ display: 'flex' }}
              onClick={() => {
                navigate('/user/login')
              }}
            >
              <span
                style={{
                  color: 'var(--adm-color-text-secondary)',
                  fontSize: 18,
                  lineHeight: '80px',
                }}
              >
                立即登录
              </span>
              <span style={{ marginLeft: 'auto' }}>
                <RightOutline height={80} fontSize={20} />
              </span>
            </div>
          )}
        </div>
        <div>
          {userInfo && (
            <>
              {' '}
              <div>
                <Grid columns={3} gap={8}>
                  <Grid.Item>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {userInfo
                            ? parseFloat(userInfo.RemainCount.toFixed(2))
                            : '-'}
                        </span>
                        <Avocado />
                      </div>
                      <div style={{ color: 'var(--adm-color-text-secondary)' }}>
                        剩余数量
                      </div>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: 18 }}>
                          {userInfo
                            ? parseFloat(userInfo.UsedCount.toFixed(2))
                            : '-'}
                        </span>
                        <Avocado />
                      </div>
                      <div style={{ color: 'var(--adm-color-text-secondary)' }}>
                        已使用
                      </div>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <span style={{ fontSize: 18 }}>
                          {userInfo ? userInfo.InviteCount : '-'}
                        </span>
                      </div>
                      <div style={{ color: 'var(--adm-color-text-secondary)' }}>
                        邀请人数
                      </div>
                    </div>
                  </Grid.Item>
                </Grid>
              </div>
            </>
          )}
        </div>
        <div
          style={{ position: 'absolute', width: '100%', bottom: '-100' }}
        ></div>
        <div style={{ height: 5 }}></div>
      </div>
      {userInfo && (
        <div style={{ padding: 10, paddingBottom: 0 }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 5,
            }}
          >
            <Grid columns={3}>
              <Grid.Item>
                <div style={{ textAlign: 'center' }}>
                  <span
                    onClick={() => {
                      navigate('/user/publicHistory')
                    }}
                  >
                    <span className="iconfont icon-huati"></span>
                    <span style={{ marginLeft: 5 }}>我的话题</span>
                  </span>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div style={{ textAlign: 'center' }}>
                  <span
                    onClick={() => {
                      navigate('/user/chatHistory')
                    }}
                  >
                    <span className="iconfont icon-xiaoxi"></span>
                    <span style={{ marginLeft: 5 }}>对话历史</span>
                  </span>
                </div>
              </Grid.Item>
              <Grid.Item>
                <div style={{ textAlign: 'center' }}>
                  <span
                    onClick={() => {
                      navigate('/user/drawingHistory')
                    }}
                  >
                    <span className="iconfont icon-huatu-xianxing3-0"></span>
                    <span style={{ marginLeft: 5 }}>绘画记录</span>
                  </span>
                </div>
              </Grid.Item>
            </Grid>
          </div>
        </div>
      )}
      <div style={{ marginTop: 0 }}>
        {userInfo && (
          <List header="我的">
            <List.Item
              prefix={<span className="iconfont icon-goumai" />}
              onClick={() => {
                navigate('/order/buy')
              }}
              extra={
                hasUnpaidOrder && (
                  <>
                    <span>订单待支付</span>
                  </>
                )
              }
            >
              购买牛油果
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-tongzhi" />}
              onClick={() => {
                if (!hasUnreadNotification) {
                  navigate('/user/notification/list/all')
                } else {
                  navigate('/user/notification/list/unread')
                }
              }}
            >
              <div style={{ display: 'flex' }}>
                消息通知
                {hasUnreadNotification && (
                  <Tag
                    style={{
                      marginLeft: 7,
                      display: 'flex',
                      alignSelf: 'center',
                    }}
                    color={'danger'}
                  >
                    未读消息
                  </Tag>
                )}
              </div>
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-edit" />}
              onClick={() => {
                navigate('/drawing/fix/list')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>AI图片修复纪录</span>
              </div>
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-huanbeijing" />}
              onClick={() => {
                navigate('/drawing/rembg/list/0')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>AI抠图纪录</span>
              </div>
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-zhengjianzhaopian" />}
              onClick={() => {
                navigate('/drawing/rembg/list/1')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>AI制作证件照纪录</span>
              </div>
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-yaoqingyouli" />}
              onClick={() => {
                navigate('/user/invite')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>邀请用户</span>
                {avocadoInfo && (
                  <>
                    <span
                      style={{
                        fontSize: 14,
                        marginLeft: 'auto',
                        color: '#999',
                      }}
                    >
                      <span>每个用户 </span>
                      {avocadoInfo?.InviteUserGet}
                    </span>
                    <Avocado />
                  </>
                )}
              </div>
            </List.Item>
            <List.Item
              prefix={
                <span className="iconfont icon-gerenzhongxin-gerenxinxi" />
              }
              onClick={() => {
                navigate('/user/info')
              }}
            >
              我的信息
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-banquan" />}
              onClick={() => {
                navigate('/user/ownership/list')
              }}
            >
              获得的授权
            </List.Item>
          </List>
        )}
        {userInfo && userInfo.UserType === 2 && (
          <List header="系统管理">
            <List.Item
              prefix={<span className="iconfont icon-shujukanban"></span>}
              onClick={() => {
                navigate('/admin/content/check')
              }}
            >
              平台数据
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-dingdan"></span>}
              onClick={() => {
                navigate('/admin/order/list')
              }}
            >
              订单列表
            </List.Item>
            <List.Item
              prefix={<span className="iconfont icon-zidianmokuai"></span>}
              onClick={() => {
                navigate('/admin/dic/list')
              }}
            >
              字典管理
            </List.Item>
          </List>
        )}
        <List header="其他">
          {loginStatus && (
            <List.Item
              prefix={<span className="iconfont icon-niuyouguo"></span>}
              onClick={() => {
                navigate('/system/avocadoTips')
              }}
            >
              牛油果帮助
            </List.Item>
          )}
          <List.Item
            prefix={<span className="iconfont icon-wentifankui"></span>}
            onClick={() => {
              navigate('/system/report')
            }}
          >
            反馈BUG/改进建议
          </List.Item>
          <List.Item
            prefix={<span className="iconfont icon-fuwutiaokuanjiyinsi"></span>}
            onClick={() => {
              navigate('/system/privacy')
            }}
          >
            服务条款与隐私协议
          </List.Item>
        </List>
      </div>
      {userInfo && (
        <div style={{ padding: 10, marginTop: 20 }}>
          <Button
            block
            color="danger"
            onClick={() =>
              Dialog.confirm({
                content: '是否退出登录？',
                onConfirm: () => {
                  logoutAction()
                },
              })
            }
          >
            退出登录
          </Button>
        </div>
      )}
    </>
  )
}

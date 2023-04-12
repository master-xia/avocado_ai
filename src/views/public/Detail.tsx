import {
  deleteConversation,
  disfavoriteConversationAction,
  dislikeConversationAction,
  doConversationAction,
  favoriteConversationAction,
  getConversationInfoVM,
  getConversationStatusVM,
  likeConversationAction,
  viewConversationAction,
} from '@api/chat'
import CustomerSkeleton from '@components/common/CustomerSkeleton'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import AiDrawingPictureList from '@components/conversation/AiDrawingPictureList'
import { CheckStatus } from '@components/conversation/CheckStatus'
import CommentList, {
  ICommentListRef,
} from '@components/conversation/CommentList'
import MessageList, {
  IMessageListRef,
} from '@components/conversation/MessageList'
import { useAppSelector } from '@store/hooks'
import converstaion from '@store/modules/converstaion'
import {
  copyText,
  errorMsg,
  hideLoading,
  isWxEnv,
  showLoading,
  successMsg,
} from '@utils/common'
import {
  ActionSheet,
  Avatar,
  Button,
  Dialog,
  Ellipsis,
  Grid,
  Loading,
  Popup,
  Tabs,
  Tag,
} from 'antd-mobile'
import { EyeOutline } from 'antd-mobile-icons'
import { Action } from 'antd-mobile/es/components/action-sheet'
import Form from 'antd-mobile/es/components/form'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Index() {
  let navigate = useNavigate()
  let converstaionId = useParams()['conversationId']
  let converstaion = useRef<ConversationInfoVM>()
  let statusInterval = useRef(-1)
  let [flag, setFlag] = useState(0)
  let messageListRef = useRef<IMessageListRef>(null)
  let commentListRef = useRef<ICommentListRef>(null)
  let [activeKey, setActiveKey] = useState('')
  let [conActionVisible, setConActionVisible] = useState(false)
  let [shareVisible, setShareVisible] = useState(false)
  const userInfo = useAppSelector((m) => m.auth.userInfo)
  var tags = useMemo(() => {
    let tagList: string[] = []
    if (converstaion.current) {
      if (
        converstaion.current.RoleDescription &&
        converstaion.current.ConversationType === 3
      ) {
        var tmp = converstaion.current.RoleDescription.split('|')
        tmp.forEach((item) => {
          if (item && item.length > 0) {
            tagList.push(item)
          }
        })
      }
    }
    return tagList
  }, [converstaion.current])
  const conversationActions1: Action[] = [
    {
      text: '分享',
      key: 'share',
      onClick() {
        setConActionVisible(false)
        setShareVisible(true)
      },
    },
  ]
  const conversationActions2: Action[] = [
    ...conversationActions1,
    {
      text: '删除',
      key: 'delete',
      danger: true,
      onClick() {
        setConActionVisible(false)
        Dialog.confirm({
          title: '提示',
          content: '是否确认删除？',
          onConfirm: () => {
            deleteConversation(converstaion.current?.ConversationId!).then(
              (res) => {
                if (res.IsSuccess) {
                  successMsg('删除成功')
                  navigate(-1)
                } else {
                  errorMsg(res.Message)
                }
              }
            )
          },
        })
      },
    },
  ]
  //开启对话状态的轮询，信息有更新就重新拉取对话信息
  function startQueryStatusInterval() {
    getStatusInfo()
  }
  function getStatusInfo() {
    setFlag(new Date().getTime())
    if (!converstaion.current) {
      statusInterval.current = window.setTimeout(() => {
        getStatusInfo()
      }, 200)
      return
    }
    getConversationStatusVM(converstaion.current.ConversationId, true)
      .then((res) => {
        if (res.IsSuccess) {
          const newStatus = res.Result
          if (newStatus?.Status !== converstaion.current?.Status) {
            getConversationInfo()
          }
        }
        statusInterval.current = window.setTimeout(() => {
          getStatusInfo()
        }, 3000)
      })
      .catch(() => {
        statusInterval.current = window.setTimeout(() => {
          getStatusInfo()
        }, 3000)
      })
  }

  //结束对话状态的轮询
  function stopQueryStatusInterval() {
    if (statusInterval.current !== -1) {
      window.clearTimeout(statusInterval.current)
      statusInterval.current = -1
    }
  }
  async function getConversationInfo() {
    return getConversationInfoVM(converstaionId as string, true).then((res) => {
      if (res.IsSuccess) {
        const info = res.Result!
        converstaion.current = info
        if (activeKey === '') {
          if (info.ConversationType === 2) {
            setActiveKey('messages')
          } else if (info.ConversationType === 3) {
            setActiveKey('drawings')
          }
        }
        setFlag(new Date().getTime())
      } else {
        errorMsg(res.Message)
      }
    })
  }

  useEffect(() => {
    if (converstaion.current?.ConversationId) {
      //记录浏览
      viewConversationAction(converstaion.current.ConversationId, true)
    }
  }, [converstaion.current?.ConversationId])

  useEffect(() => {
    startQueryStatusInterval()
    getConversationInfo()
    return stopQueryStatusInterval
  }, [])

  function copySahreUrl() {
    copyText(
      window.location.origin + '/p/' + converstaion.current?.ShortCode ?? ''
    )
  }

  async function refresh() {
    await getConversationInfo()
    if (activeKey === 'messages') {
      messageListRef.current?.refresh()
    }
  }
  return (
    <>
      <PageHeader
        title={converstaion.current?.CategoryName ?? '话题详情'}
        right={
          <>
            <span
              className="iconfont icon-cangpeitubiao_gengduocaozuo"
              onClick={() => {
                setConActionVisible(true)
              }}
            ></span>
          </>
        }
      />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 50px)`,
          overflow: 'auto',
        }}
      >
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ padding: 10, display: 'flex', fontSize: 14 }}>
            <div>
              <Avatar src={converstaion.current?.Header ?? ''} />
            </div>
            <div style={{ paddingLeft: 10, alignSelf: 'center' }}>
              <div style={{ display: 'flex', color: 'var(--adm-color-weak)' }}>
                <span>{converstaion.current?.Name}</span>
                {!converstaion.current && (
                  <div>
                    <CustomerSkeleton height={15} width={100} />
                    <div style={{ height: 10 }}></div>
                    <CustomerSkeleton height={18} width={150} />
                  </div>
                )}
                <span
                  style={{
                    marginLeft: 'auto',
                  }}
                ></span>
              </div>
              <div style={{ fontSize: 16 }}>
                <Ellipsis
                  content={converstaion.current?.Title ?? ''}
                  direction="end"
                  rows={2}
                  expandText="展开"
                  collapseText="收起"
                />
              </div>
            </div>
          </div>
          {tags && tags.length > 0 && (
            <div style={{ paddingLeft: 5 }}>
              {tags.map((item) => (
                <Tag
                  key={item}
                  color="primary"
                  fill="outline"
                  style={{ marginRight: 5, marginBottom: 5 }}
                >
                  {item}
                </Tag>
              ))}
            </div>
          )}
          <div style={{ padding: 10, fontSize: 12, paddingTop: 5 }}>
            <div style={{ display: 'flex', lineHeight: '18px' }}>
              <CheckStatus CheckStatus={converstaion.current?.CheckStatus} />
              <span
                style={{
                  lineHeight: '18px',
                  color: '#999',
                  marginLeft: 5,
                }}
              >
                {!converstaion.current && (
                  <CustomerSkeleton height={13} width={50} />
                )}
                {converstaion.current && (
                  <>
                    <EyeOutline style={{ fontSize: 14 }} />
                    <span style={{ marginLeft: 2 }}>
                      {converstaion.current?.Views}
                    </span>
                  </>
                )}
              </span>
              <span
                style={{ color: '#999', marginLeft: 'auto', display: 'flex' }}
              >
                {!converstaion.current && (
                  <CustomerSkeleton height={13} width={100} />
                )}
                {converstaion.current && (
                  <>
                    <span>发布于</span>
                    <Datetime
                      datetime={converstaion.current?.CreateTime}
                      format="yyyy-MM-dd hh:mm"
                      type="datetime"
                      default=""
                    />
                    <span style={{ padding: '0 3px' }}>|</span>
                    <span>{converstaion.current?.City ?? '未知'}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: 10,
            paddingTop: 0,
            paddingBottom: 0,
            display: 'flex',
            alignItems: 'center',
            lineHeight: '36px',
          }}
        >
          <div style={{ color: '#999', fontSize: 12 }}>
            {converstaion.current?.Comments ?? 0} 评论
            <span> | </span>
            {converstaion.current?.Likes ?? 0} 点赞
            <span> | </span>
            {converstaion.current?.Favorites ?? 0} 收藏
          </div>
          {converstaion.current && (
            <ConverstationStatus
              {...converstaion.current}
              onAskQuestionClick={() => {
                if (activeKey !== 'messages') {
                  setActiveKey('messages')
                  window.setTimeout(() => {
                    messageListRef.current?.openSendMsgPanel()
                  }, 500)
                } else {
                  messageListRef.current?.openSendMsgPanel()
                }
              }}
            />
          )}
        </div>
        <Tabs
          style={{
            '--title-font-size': '14px',
            '--content-padding': '0',
          }}
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key)
          }}
        >
          {converstaion.current?.ConversationType === 3 && (
            <Tabs.Tab
              title={
                <>
                  <span>Ai绘图</span>
                  <span>（{converstaion.current.ImageCount}张）</span>
                </>
              }
              key="drawings"
            >
              {converstaion.current && (
                <div style={{ paddingTop: 3 }}>
                  <AiDrawingPictureList {...converstaion.current} />
                </div>
              )}
            </Tabs.Tab>
          )}
          {converstaion.current?.ConversationType === 2 && (
            <Tabs.Tab
              title={
                <>
                  <span>问答</span>
                  <span>（{converstaion.current?.MessageCount ?? 0}个）</span>
                </>
              }
              key="messages"
            >
              {converstaion.current && (
                <div style={{ paddingTop: 10 }}>
                  <MessageList
                    ref={messageListRef}
                    {...converstaion.current}
                    shouldUpdate={refresh}
                  />
                </div>
              )}
            </Tabs.Tab>
          )}
          <Tabs.Tab
            title={
              <>
                <span>评论</span>
                <span>({converstaion.current?.Comments ?? 0}条)</span>
              </>
            }
            key="comments"
          >
            {converstaion.current && (
              <div style={{ paddingTop: 10 }}>
                <CommentList
                  {...converstaion.current}
                  ref={commentListRef}
                  shouldUpdate={getConversationInfo}
                />
              </div>
            )}
          </Tabs.Tab>
        </Tabs>
      </div>
      {converstaion.current && (
        <BottomBar
          shouldUpdate={getConversationInfo}
          {...converstaion.current}
          onClickComment={() => {
            if (activeKey === 'comments') {
              commentListRef.current?.openCommentPanel()
            } else {
              setActiveKey('comments')
              window.setTimeout(() => {
                commentListRef.current?.openCommentPanel()
              }, 500)
            }
          }}
        />
      )}
      <ActionSheet
        extra="更多"
        cancelText="取消"
        visible={conActionVisible}
        actions={
          userInfo?.UserName === converstaion.current?.UserName
            ? conversationActions2
            : conversationActions1
        }
        onClose={() => setConActionVisible(false)}
      />
      <Popup
        visible={shareVisible}
        onMaskClick={() => {
          setShareVisible(false)
        }}
      >
        <Form>
          <Form.Item
            name="msg"
            label="分享链接"
            extra={
              <>
                <span
                  className="iconfont icon-fuzhi"
                  style={{ color: 'var(--adm-color-primary)' }}
                  onClick={copySahreUrl}
                ></span>
              </>
            }
          >
            <span style={{ wordBreak: 'break-all' }}>
              {converstaion.current
                ? window.location.origin +
                  '/p/' +
                  converstaion.current?.ShortCode
                : ''}
            </span>
          </Form.Item>
        </Form>
      </Popup>
    </>
  )
}
interface IBottomBarProps {
  ConversationId: string
  UserName: string
  Likes: number
  Favorites: number
  //评论数量
  Comments: number
  Views: number
  MessageCount: number
  IsLike: boolean
  IsView: boolean
  IsComment: boolean
  IsFavorite: boolean
  IsAskQuestion: boolean
  onClickComment: () => void
  shouldUpdate: () => void
}
function BottomBar(props: IBottomBarProps) {
  function doAction(fun: (converstaionId: string) => Promise<CommonResult>) {
    showLoading()
    fun(props.ConversationId).then((res) => {
      if (res.IsSuccess) {
        window.setTimeout(() => {
          props.shouldUpdate()
          hideLoading()
        }, 1000)
      } else {
        errorMsg(res.Message)
      }
    })
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          backgroundColor: 'white',
          height: 40,
          width: '100%',
        }}
      >
        <div
          style={{
            borderRadius: 15,
            backgroundColor: '#eee',
            height: 30,
            lineHeight: '30px',
            padding: '0 10px',
            width: '100%',
            alignSelf: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}
          onClick={() => {
            props.onClickComment()
          }}
        >
          <span className="iconfont icon-bianjishuru"></span>
          <span style={{ marginLeft: 5 }}>评论点什么吧</span>
        </div>
        <Grid
          columns={3}
          gap={5}
          style={{
            lineHeight: '40px',
            fontSize: 20,
            marginLeft: 'auto',
            marginRight: 10,
            color: '#333',
            minWidth: 120,
          }}
        >
          <Grid.Item>
            <span>
              {props.IsLike ? (
                <span
                  onClick={() => {
                    doAction(dislikeConversationAction)
                  }}
                  className="iconfont icon-dianzan1"
                  style={{ color: 'var(--adm-color-primary)' }}
                ></span>
              ) : (
                <span
                  onClick={() => {
                    doAction(likeConversationAction)
                  }}
                  className="iconfont icon-dianzan"
                ></span>
              )}
              <span
                style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 5 }}
              >
                {props.Likes ?? 0}
              </span>
            </span>
          </Grid.Item>
          <Grid.Item>
            <span>
              {props.IsFavorite ? (
                <span
                  onClick={() => {
                    doAction(disfavoriteConversationAction)
                  }}
                  className="iconfont icon-aixin1"
                  style={{ color: 'var(--adm-color-danger)' }}
                ></span>
              ) : (
                <span
                  onClick={() => {
                    doAction(favoriteConversationAction)
                  }}
                  className="iconfont icon-aixin"
                ></span>
              )}
              <span
                style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 5 }}
              >
                {props.Favorites ?? 0}
              </span>
            </span>
          </Grid.Item>
          <Grid.Item>
            <span
              onClick={() => {
                props.onClickComment()
              }}
            >
              <span className="iconfont icon-comment"></span>
              <span
                style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 5 }}
              >
                {props.Comments ?? 0}
              </span>
            </span>
          </Grid.Item>
        </Grid>
      </div>
    </>
  )
}
interface IConversationStatus {
  Status: number
  CheckStatus: number
  ConversationType: number
  MessageCount: number
  onAskQuestionClick: () => void
}
function ConverstationStatus(props: IConversationStatus) {
  if (props.ConversationType === 3) {
    //AI绘图不展示
    return <></>
  }
  if (props.Status === 1) {
    return (
      <>
        <div
          style={{
            marginLeft: 'auto',
          }}
        >
          <div style={{ padding: 5, display: 'flex' }}>
            {props.Status === 1 &&
              props.CheckStatus === 2 &&
              props.MessageCount > 0 && (
                <Button
                  color="primary"
                  fill="outline"
                  size="mini"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => {}}
                >
                  我要提问
                </Button>
              )}
          </div>
        </div>
      </>
    )
  }
  if (props.Status === 2 || props.Status === 3) {
    return (
      <>
        <div
          style={{
            color: '#999',
            marginLeft: 'auto',
          }}
        >
          <Loading />
          <span>
            {props.Status === 2 ? '等待ChatGPT回答问题' : 'ChatGPT思考中'}
          </span>
        </div>
      </>
    )
  }
  return <></>
}

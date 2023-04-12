import {
  deleteConversation,
  getConversationInfoVM,
  getConversationStatusVM,
} from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import MessageList, {
  IMessageListRef,
} from '@components/conversation/MessageList'
import { errorMsg, isWxEnv, successMsg } from '@utils/common'
import { Button, Dialog, ErrorBlock, Loading, PullToRefresh } from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Index() {
  let conHeight = `calc(100vh - ${isWxEnv ? 0 : 50}px)`
  let converstaionId = useParams()['conversationId']
  let converstaion = useRef<ConversationInfoVM>()
  let statusInterval = useRef(-1)
  let [flag, setFlag] = useState(0)
  const navigate = useNavigate()
  let messageListRef = useRef<IMessageListRef>(null)
  let topPartRef = useRef<HTMLDivElement>(null)
  let messagesRef = useRef<HTMLDivElement>(null)
  let conRef = useRef<HTMLDivElement>(null)
  function delConversation() {
    if (!converstaion.current) {
      return
    }
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
  }

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
            refresh()
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
        setFlag(new Date().getTime())
      } else {
        errorMsg(res.Message)
      }
    })
  }

  useEffect(() => {
    startQueryStatusInterval()
    getConversationInfo()
    return stopQueryStatusInterval
  }, [])

  async function refresh() {
    await getConversationInfo()
    messageListRef.current?.refresh()
  }
  return (
    <>
      <PageHeader
        title={'对话详情'}
        right={
          <span
            style={{ color: 'var(--adm-color-danger)' }}
            onClick={delConversation}
          >
            删除
          </span>
        }
      />
      <div style={{ height: conHeight, overflow: 'auto' }} ref={conRef}>
        <div ref={topPartRef}>
          <div style={{ backgroundColor: 'white' }}>
            <div style={{ padding: 10, fontSize: 16 }}>
              <div>{converstaion.current?.Title ?? ''}</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                {converstaion.current?.RoleDescription ?? ''}
              </div>
            </div>
            <div style={{ padding: 10, fontSize: 12 }}>
              <div style={{ display: 'flex', lineHeight: '18px' }}>
                <span style={{ color: '#999', marginLeft: 'auto' }}>
                  发布于
                  <Datetime
                    datetime={converstaion.current?.CreateTime}
                    format="yyyy-MM-dd hh:mm"
                    type="datetime"
                  />
                </span>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                color: '#999',
                height: 36,
                fontSize: 14,
                marginTop: 5,
              }}
            >
              <span>问答{converstaion.current?.MessageCount}个</span>
              {converstaion.current?.Status === 1 &&
                converstaion.current?.CheckStatus === 2 && (
                  <div
                    style={{
                      marginLeft: 'auto',
                    }}
                  >
                    <div style={{ padding: 5, display: 'flex' }}>
                      {converstaion.current?.Status === 1 &&
                        converstaion.current?.CheckStatus === 2 && (
                          <Button
                            color="primary"
                            fill="outline"
                            size="mini"
                            style={{ marginLeft: 'auto' }}
                            onClick={() => {
                              messageListRef.current?.openSendMsgPanel()
                            }}
                          >
                            我要提问
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              {converstaion.current?.Status !== 1 &&
                converstaion.current?.CheckStatus === 2 && (
                  <>
                    <div
                      style={{
                        color: '#999',
                        marginLeft: 'auto',
                      }}
                    >
                      <Loading />
                      <span>
                        {converstaion.current?.Status === 2
                          ? '等待ChatGPT回答问题'
                          : 'ChatGPT思考中'}
                      </span>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
        <div
          style={{
            height: `${
              (conRef.current?.offsetHeight ?? 0) -
              (topPartRef.current?.offsetHeight ?? 0)
            }px`,
            overflow: 'auto',
          }}
          ref={messagesRef}
        >
          <div>
            {converstaion.current && (
              <div>
                <MessageList
                  {...converstaion.current}
                  shouldUpdate={refresh}
                  ref={messageListRef}
                  afterRefreshed={() => {
                    window.setTimeout(() => {
                      if (messagesRef.current) {
                        messagesRef.current.scrollTop =
                          messagesRef.current.scrollHeight + 100
                      }
                    }, 50)
                  }}
                />
              </div>
            )}
          </div>
          {(messageListRef.current &&
            messageListRef.current.messageCount &&
            converstaion.current?.MessageCount === 0) === 0 && (
            <>
              <div>
                <div
                  onClick={() => {
                    messageListRef.current?.openSendMsgPanel()
                  }}
                >
                  <ErrorBlock
                    image={
                      'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noMessage.png'
                    }
                    style={{
                      '--image-height': '150px',
                    }}
                    title="暂时没有提问"
                    description={<>想想该提些什么问题吧</>}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

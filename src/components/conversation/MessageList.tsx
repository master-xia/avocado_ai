import { getMessageInfoVMList, sendMessage } from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { useAppSelector } from '@store/hooks'
import { combineTwoList, copyText, errorMsg, successMsg } from '@utils/common'
import {
  Button,
  Dialog,
  ErrorBlock,
  Form,
  InfiniteScroll,
  List,
  Popup,
  Tag,
  TextArea,
  TextAreaRef,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import {
  ForwardRefRenderFunction,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
export interface IMessageListRef {
  openSendMsgPanel: () => void
  refresh: () => void
  messageCount: number
}
interface IQuestionListProps {
  ConversationId: string
  ConversationType: number
  UserName: string
  Status: number
  CheckStatus: number
  RemainTokenCount: number
  shouldUpdate: () => void
  //加载第一页数据后会调用
  afterRefreshed?: () => void
}
interface IMessageData {
  Result: MessageInfoVM[]
  Query: CommentInfoQuery
  HasMore: boolean
}
let MessageList: ForwardRefRenderFunction<
  IMessageListRef,
  IQuestionListProps
> = (props: IQuestionListProps, ref: Ref<IMessageListRef>) => {
  let [sendMsgVisible, setSendMsgVisible] = useState(false)
  let formRef = useRef<FormInstance>(null)
  let textRef = useRef<TextAreaRef>(null)
  let [msg, setMsg] = useState('')
  let initMessage: IMessageData = {
    Result: [],
    Query: {
      Page: 1,
      Limit: 20,
      ConversationId: props.ConversationId,
    },
    HasMore: true,
  }
  let [messages, setMessages] = useState<IMessageData>(
    JSON.parse(JSON.stringify(initMessage))
  )
  var dataRef = useRef<IMessageListRef>({
    openSendMsgPanel,
    refresh,
    messageCount: 0,
  })
  async function loadData() {
    let res = await getMessageInfoVMList(
      {
        ...messages.Query,
        ConversationId: props.ConversationId!,
      },
      true
    )
    if (res.IsSuccess) {
      if (messages.Query.Page === 1 && props.afterRefreshed) {
        props.afterRefreshed()
      }
      let newResult =
        messages.Query.Page === 1
          ? res.Result!
          : combineTwoList(messages!.Result!, res.Result!, 'MessageId')
      let newQueryParams = {
        ...messages.Query,
        Page: messages.Query.Page! + 1,
        ConversationId: props.ConversationId!,
      }
      dataRef.current.messageCount = (res as any).TotalCount
      setMessages({
        Result: newResult,
        HasMore: res.Result!.length >= messages.Query.Limit!,
        Query: newQueryParams,
      })
    } else {
      errorMsg(res.Message)
      throw new Error()
    }
  }
  function sendMsg() {
    let content = msg
    function send() {
      sendMessage({
        Content: content,
        ConversationId: props.ConversationId ?? null,
      }).then((res) => {
        if (!res.IsSuccess) {
          if (res.Code !== 40001) {
            errorMsg(res.Message)
          }
        } else {
          dataRef.current.messageCount++
          formRef.current?.resetFields()
          setMsg('')
          setSendMsgVisible(false)
          successMsg('提问成功')
          props.shouldUpdate()
        }
      })
    }
    if (remainCount < 50) {
      errorMsg('当前问题ChatGPT最大可回答小于100英文单词，或50汉字！')
    }
    if (remainCount < 100) {
      Dialog.confirm({
        title: '提示',
        content:
          '当前问题ChatGPT最大可回答小于100英文单词，或50汉字！是否继续提交？',
        onConfirm: () => {
          send()
        },
      })
    } else {
      send()
    }
  }
  let remainCount = useMemo(() => {
    return props.RemainTokenCount - msg.length * 2
  }, [props.RemainTokenCount, msg])
  function openSendMsgPanel() {
    setSendMsgVisible(true)
    window.setTimeout(() => {
      textRef.current?.focus()
    }, 500)
  }
  useEffect(() => {
    if (props.Status === 1) {
      refresh()
    }
  }, [props.Status])
  function refresh() {
    var tmp = JSON.parse(JSON.stringify(initMessage)) as IMessageData
    tmp.Result = messages.Result
    setMessages(tmp)
  }

  useImperativeHandle(ref, () => dataRef.current)
  return (
    <>
      <div>
        <List className="messageList">
          {messages.Result?.map((item, index) => (
            <MessageItem
              isChatGPT={item.IsChatGpt}
              key={item.MessageId}
              {...item}
              ConversationUserName={props.UserName}
            />
          ))}
        </List>
        {(messages.HasMore || messages.Result.length > 0) && (
          <>
            <InfiniteScroll
              loadMore={loadData}
              hasMore={messages.HasMore}
              style={{ padding: 0 }}
              children=""
            ></InfiniteScroll>
            <div style={{ height: 20 }}></div>
          </>
        )}
      </div>
      <Popup
        visible={sendMsgVisible}
        onMaskClick={() => {
          setSendMsgVisible(false)
        }}
      >
        <Form ref={formRef}>
          <Form.Item
            name="msg"
            label="我的提问"
            extra={
              msg ? (
                <span
                  className="iconfont icon-fasong"
                  style={{ fontSize: 20, color: 'var(--adm-color-primary)' }}
                  onClick={sendMsg}
                ></span>
              ) : (
                <span
                  className="iconfont icon-fasong"
                  style={{ fontSize: 20 }}
                ></span>
              )
            }
          >
            <TextArea
              style={{ fontSize: 12 }}
              maxLength={500}
              rows={3}
              placeholder="请输入问题描述"
              onChange={(val) => {
                setMsg(val.trim())
              }}
              showCount
              ref={textRef}
            />
          </Form.Item>
        </Form>
        <div
          style={{
            color: 'var(--adm-color-weak)',
            padding: 10,
          }}
        >
          <div>
            由于ChatGPT模型限制，每一个对话上下文最多支持大约4096个英文单词或2048个汉字
          </div>
          <div>
            当前问题ChatGPT最大可回答大约{remainCount}英文单词，或
            {remainCount / 2}
            汉字！
          </div>
        </div>
      </Popup>
      <style>
        {`
        .messageList{
          --border-inner:none;
          border:none;
          --border-bottom:none;
          --border-top:none;
          --adm-color-background:none;
        }
        .messageList .adm-list-item-content-main{
          padding:0;
          padding-bottom:10px;
        }
        `}
      </style>
    </>
  )
}

interface IEmptyMessageProps {
  onEmptyClick: () => void
}
function EmptyComment(props: IEmptyMessageProps) {
  return (
    <>
      <div>
        <div onClick={props.onEmptyClick}>
          <ErrorBlock
            image={
              'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            }
            style={{
              '--image-height': '150px',
            }}
            title="暂时没有人提问"
            description={<>待会再来看看</>}
          />
        </div>
      </div>
    </>
  )
}

interface IMessageItemProps {
  Content: string | JSX.Element
  isChatGPT: boolean
  showCopyBtn?: boolean
  Status: number
  UserName: string
  ConversationUserName: string
  Name?: string | undefined
  CreateTime: Date
  CheckStatus: number
}
function MessageItem(props: IMessageItemProps) {
  let userInfo = useAppSelector((state) => state.auth.userInfo)
  let chatGPTHeader =
    'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/chatgpt.png?x-oss-process=style/jmms'
  let copyEle =
    props.isChatGPT &&
    (props.showCopyBtn === undefined || props.showCopyBtn) &&
    props.CheckStatus !== 1 ? (
      <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 5 }}>
        <span
          className="iconfont icon-fuzhi"
          style={{
            color: 'var(--adm-color-primary)',
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={() => {
            copyText(props.Content as string)
          }}
        ></span>
      </div>
    ) : (
      <></>
    )
  let headerEle = (
    <div style={{ display: 'flex', width: 40, justifyContent: 'center' }}>
      <img
        style={{ height: 30, width: 30, borderRadius: '50%' }}
        src={props.isChatGPT ? chatGPTHeader : userInfo?.Header ?? ''}
        alt="header"
      />
    </div>
  )
  let messageEle = (
    <div
      style={{
        backgroundColor: props.isChatGPT
          ? 'rgba(255,255,255,0.7)'
          : 'rgba(153,232,105,0.7)',
        borderRadius: 10,
        display: 'flex',
      }}
    >
      <div
        style={{
          padding: 10,
          wordBreak: 'break-all',
          color: 'var(--adm-color-text)',
        }}
      >
        {props.CheckStatus !== 1 && props.Content}
        {props.CheckStatus === 1 && (
          <>
            <span style={{ color: '#999' }}>该条消息违反平台规则</span>
          </>
        )}
      </div>
      {copyEle}
    </div>
  )
  let nameEle = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 3,
        alignItems: 'center',
        height: 25,
      }}
    >
      <span
        style={{
          color: '#999',
          fontSize: 14,
          marginRight: 5,
        }}
      >
        <Datetime
          datetime={props.CreateTime}
          format="yyyy-MM-dd hh:mm"
          type="datetime"
          default=""
        />
      </span>
      <span
        style={{
          color: 'var(--adm-color-text)',
          fontSize: 14,
        }}
      >
        {props.Name}
      </span>
      {props.UserName === props.ConversationUserName && (
        <Tag color="danger" style={{ marginLeft: 10 }}>
          楼主
        </Tag>
      )}
    </div>
  )
  return (
    <>
      {props.isChatGPT ? (
        <List.Item style={{}} className="messageItem">
          <div style={{ display: 'flex' }}>
            <div>{headerEle}</div>
            <div>{messageEle}</div>
          </div>
        </List.Item>
      ) : (
        <>
          <List.Item
            style={{
              backgroundColor: 'transparent',
            }}
            className="messageItem"
          >
            {nameEle}
            <div style={{ display: 'flex' }}>
              <div style={{ marginLeft: 'auto' }}>
                <div>{messageEle}</div>
                {props.Status === 4 && (
                  <>
                    <div
                      style={{
                        fontSize: 14,
                        color: 'var(--adm-color-danger)',
                      }}
                    >
                      {props.UserName !== userInfo?.UserName
                        ? 'ChatGPT繁忙，回答该问题失败'
                        : '回答失败，请查看消息通知'}
                    </div>
                  </>
                )}
              </div>
              <div>{headerEle}</div>
            </div>
          </List.Item>
        </>
      )}
    </>
  )
}

export default forwardRef(MessageList)

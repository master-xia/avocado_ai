import {
  deleteComment,
  doConversationAction,
  getCommentBaseInfoVMList,
  postComment,
} from '@api/chat'
import { useAppSelector } from '@store/hooks'
import {
  combineTwoList,
  copyText,
  errorMsg,
  formatDate2,
  successMsg,
} from '@utils/common'
import {
  Avatar,
  Dialog,
  Divider,
  ErrorBlock,
  Grid,
  InfiniteScroll,
  Popup,
  Tag,
} from 'antd-mobile'
import ActionSheet, { Action } from 'antd-mobile/es/components/action-sheet'
import {
  ForwardRefRenderFunction,
  Ref,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
export interface ICommentListRef {
  openCommentPanel: () => void
}
interface ICommentListProps {
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
  shouldUpdate: () => void
}

interface ICommentData {
  Result: CommentBaseInfoVM[]
  Query: CommentInfoQuery
  HasMore: boolean
}
let CommentList: ForwardRefRenderFunction<
  ICommentListRef,
  ICommentListProps
> = (props: ICommentListProps, ref: Ref<ICommentListRef>) => {
  let initComment: ICommentData = {
    Result: [],
    Query: {
      Page: 1,
      Limit: 20,
      ConversationId: props.ConversationId ?? '',
    },
    HasMore: true,
  }
  const userInfo = useAppSelector((m) => m.auth.userInfo)
  let [clickomment, setClickComment] = useState<CommentBaseInfoVM>()
  let [commentActionVisible, setCommentActionVisible] = useState(false)
  let [comments, setComments] = useState<ICommentData>(initComment)
  let [sendCommentVisible, setSendCommentVisible] = useState(false)
  let textRef2 = useRef<HTMLInputElement>(null)
  let [comment, setComment] = useState('')

  let [replyToComment, setReplyToComment] = useState<CommentBaseInfoVM>()
  const commentActions1: Action[] = [
    {
      text: '回复',
      key: 'save',
      onClick() {
        setCommentActionVisible(false)
        replyTo(clickomment!)
      },
    },
    {
      text: '复制',
      key: 'copy',
      onClick() {
        copyText(clickomment?.Content ?? '')
        setCommentActionVisible(false)
        setReplyToComment(undefined)
      },
    },
  ]
  const commentActions2: Action[] = [
    ...commentActions1,
    {
      text: '删除',
      key: 'edit',
      danger: true,
      onClick() {
        let commentId = clickomment!.CommentId
        Dialog.confirm({
          title: '提示',
          content: '是否删除该条评论？',
          onConfirm: () => {
            deleteComment(commentId).then((res) => {
              if (res.IsSuccess) {
                successMsg('删除成功')
                let index = comments.Result.findIndex(
                  (m) => m.CommentId === commentId
                )
                comments.Result[index].Content = ''
                comments.Result[index].Status = 1
                setComments({
                  ...comments,
                })
              } else {
                errorMsg(res.Message)
              }
            })
          },
        })
        setCommentActionVisible(false)
      },
    },
  ]
  async function loadCommnet() {
    let res = await getCommentBaseInfoVMList(
      {
        ...comments.Query,
        ConversationId: props.ConversationId!,
      },
      true
    )
    if (res.IsSuccess) {
      let newQueryParams = {
        ...comments.Query,
        Page: comments.Query.Page! + 1,
        ConversationId: props.ConversationId!,
      }
      setComments({
        Result: combineTwoList(comments!.Result!, res.Result!, 'CommentId'),
        HasMore: res.Result!.length >= comments.Query.Limit!,
        Query: newQueryParams,
      })
    } else {
      errorMsg(res.Message)
      throw new Error()
    }
  }
  function sendComment() {
    let msg = ''
    let comment = textRef2.current?.value ?? ''
    if (comment!.trim().length === 0) {
      msg = '评论内容不能为空'
    } else if (comment!.length > 500) {
      msg = '评论最多500字'
    }
    if (msg) {
      errorMsg(msg)
    } else {
      let ReplyToCommentId = replyToComment?.CommentId ?? ''
      postComment({
        ReplyToCommentId: ReplyToCommentId,
        ConversationId: props.ConversationId,
        Content: comment,
      }).then((res) => {
        if (res.IsSuccess) {
          if (ReplyToCommentId) {
            successMsg('回复成功')
          } else {
            successMsg('评论成功')
          }
          props.shouldUpdate()
          refreshComment()
          setSendCommentVisible(false)
          textRef2.current!.value = ''
        } else {
          if (res.Code !== 40001) {
            errorMsg(res.Message)
          }
        }
      })
    }
  }
  function refreshComment() {
    setComments({
      ...initComment,
      HasMore: true,
    })
  }
  function replyTo(commentInfo: CommentBaseInfoVM) {
    setReplyToComment(commentInfo)
    setSendCommentVisible(true)
  }
  function openCommentPanel() {
    setSendCommentVisible(true)
  }
  useImperativeHandle(ref, () => ({
    openCommentPanel,
  }))
  return (
    <>
      <div style={{ padding: '0 10px' }}>
        {!comments.HasMore && comments.Result.length === 0 && (
          <EmptyComment
            onEmptyClick={() => {
              setSendCommentVisible(true)
            }}
          />
        )}
        {comments.Result.map((m) => (
          <div key={m.CommentId}>
            <CommentItem
              CommentInfo={m}
              ConversationUserName={props.UserName}
              onCommentClick={(commentInfo) => {
                setClickComment(m)
                setCommentActionVisible(true)
              }}
              onReplyClick={(commentInfo) => {
                replyTo(m)
              }}
            />
            <Divider />
          </div>
        ))}
        {(comments.HasMore || comments.Result.length > 0) && (
          <>
            <InfiniteScroll
              loadMore={loadCommnet}
              hasMore={comments.HasMore}
              style={{ padding: 0 }}
              children=""
            ></InfiniteScroll>
            <div style={{ height: 20 }}></div>
          </>
        )}
      </div>

      <ActionSheet
        afterClose={() => {
          setClickComment(undefined)
        }}
        extra="请选择你要进行的操作"
        cancelText="取消"
        visible={commentActionVisible}
        actions={
          userInfo?.UserName === replyToComment?.UserName
            ? commentActions1
            : commentActions2
        }
        onClose={() => setCommentActionVisible(false)}
      />
      <Popup
        visible={sendCommentVisible}
        onMaskClick={() => {
          setSendCommentVisible(false)
        }}
        afterClose={() => {
          setReplyToComment(undefined)
        }}
        afterShow={() => {
          textRef2.current?.focus()
        }}
      >
        {replyToComment && (
          <>
            <div
              style={{
                padding: 10,
                paddingBottom: 0,
                color: 'var(--adm-color-text)',
              }}
            >
              <div style={{ display: 'flex', lineHeight: '20px' }}>
                <span style={{ color: '#999' }}>回复 </span>
                <span style={{ marginLeft: 5, marginRight: 3 }}>
                  <Avatar
                    src={replyToComment.Header}
                    style={{ '--size': '20px' }}
                  />
                </span>
                <span>{replyToComment.Name}</span>
              </div>
              <div style={{ paddingTop: 5 }}>{replyToComment.Content}</div>
            </div>
          </>
        )}
        <div style={{ padding: '10px 0', display: 'flex', width: '100%' }}>
          <input
            style={{
              borderRadius: 15,
              backgroundColor: '#eee',
              height: 30,
              lineHeight: '30px',
              padding: '0 10px',
              border: 'none',
              width: '100%',
              marginLeft: 10,
            }}
            placeholder={replyToComment ? '请输入回复内容' : '请输入评论内容'}
            onChange={(val) => {
              setComment(val.target.value)
            }}
            ref={textRef2}
          ></input>
          <div
            style={{
              minWidth: 50,
              justifyContent: 'center',
              display: 'flex',
              lineHeight: '30px',
            }}
          >
            {comment ? (
              <span
                className="iconfont icon-fasong"
                style={{ fontSize: 20, color: 'var(--adm-color-primary)' }}
                onClick={sendComment}
              ></span>
            ) : (
              <span
                className="iconfont icon-fasong"
                style={{ fontSize: 20 }}
              ></span>
            )}
          </div>
        </div>
      </Popup>
    </>
  )
}
interface IEmptyCommentProps {
  onEmptyClick: () => void
}
function EmptyComment(props: IEmptyCommentProps) {
  return (
    <>
      <div>
        <div onClick={props.onEmptyClick}>
          <ErrorBlock
            image={
              'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noMessage.png'
            }
            style={{
              '--image-height': '170px',
            }}
            title="暂时没有评论"
            description={<>待会再来看看</>}
          />
        </div>
      </div>
    </>
  )
}

interface ICommentItemProps {
  CommentInfo: CommentBaseInfoVM
  ConversationUserName: string
  onReplyClick: (commentInfo: CommentBaseInfoVM) => void
  onCommentClick: (ommentInfo: CommentBaseInfoVM) => void
}
function CommentItem(props: ICommentItemProps) {
  const m = props.CommentInfo
  return (
    <div
      style={{
        fontSize: 14,
        color: '#999',
      }}
    >
      <div
        style={{
          alignSelf: 'center',
          fontWeight: 'normal',
          display: 'flex',
        }}
      >
        <div>
          <Avatar src={m.Header ?? ''} style={{ '--size': '20px' }} />
        </div>
        <div style={{ marginLeft: 5 }}>
          {m.Name}
          {m.UserName === props.ConversationUserName && (
            <Tag color="danger" style={{ marginLeft: 5 }}>
              楼主
            </Tag>
          )}
        </div>
      </div>
      <div
        style={{
          fontSize: 14,
          color: '#333',
          display: 'block',
          wordBreak: 'break-all',
          marginTop: 5,
        }}
      >
        {m.ReplyToUserName && (
          <>
            <span
              style={{
                color: 'var(--adm-color-weak)',
                margin: '0 2px',
              }}
            >
              @{m.ReplyToName}
            </span>
          </>
        )}
        <span
          onClick={() => {
            props.onCommentClick(m)
          }}
        >
          {m.Content}
        </span>
        {m.Status === 1 && (
          <span
            style={{
              color: '#999',
              backgroundColor: '#eee',
              padding: 2,
            }}
          >
            该条评论已被用户删除
          </span>
        )}
        {m.CheckStatus === 1 && (
          <span
            style={{
              color: '#999',
              backgroundColor: '#eee',
              padding: 2,
            }}
          >
            该条评论违反平台规则
          </span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span
          style={{
            color: '#999',
            fontSize: 12,
            marginLeft: 5,
          }}
        >
          {formatDate2(m.CreateTime)}
          <span> | </span>
          <span>{m.City ?? '未知'}</span>
        </span>
        {m.Status === 0 && (
          <span
            style={{
              color: 'var(--adm-color-text-secondary)',
              fontSize: 12,
              marginLeft: 5,
            }}
            onClick={() => {
              props.onReplyClick(m)
            }}
          >
            回复
          </span>
        )}
      </div>
    </div>
  )
}
export default forwardRef(CommentList)

interface CT_CommentInfo extends BaseModelWithIP {
  Id: number
  CommentId: string
  /** 用户名 */
  UserName: string
  /** 名称 */
  Name: string
  /** 头像 */
  Header: string
  /** 用户名 */
  ReplyToUserName: string
  /** 名称 */
  ReplyToName: string
  /** 头像 */
  ReplyToHeader: string
  ReplyToCommentId: string
  /** 评论内容 */
  Content: string
  /** 消耗的次数 */
  CountCost: number
  /** guid,唯一id */
  ConversationId: string
  /** 标题 */
  Title: string
  /** 对话类型 */
  ConversationType: ConversationType
  /** 评论状态 */
  Status: CommentStatus
  /** 审核状态 */
  CheckStatus: CommentCheckStatus
}
const enum CommentStatus {
  Normal = 0,
  Deleted = 1,
}
const enum CommentCheckStatus {
  Checking = 0,
  Failed = 1,
  Successful = 2,
}

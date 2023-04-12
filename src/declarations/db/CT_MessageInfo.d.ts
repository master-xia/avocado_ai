interface CT_MessageInfo extends BaseModelWithIP {
  Id: number
  /** 用户名 */
  UserName: string
  /** 名称 */
  Name: string
  /** 头像 */
  Header: string
  /** guid,唯一id */
  ConversationId: string
  /** guid,唯一id */
  MessageId: string
  /** 是否是chatGpt回复 */
  IsChatGpt: boolean
  /** 内容 */
  Content: string
  /** 消息序号 */
  Index: number
  /** 父消息id */
  ParentMessageId: string
  /** 状态 */
  Status: MessageStatus
  /** 备注 */
  Note: string
  /** 消耗的次数 */
  CountCost: number
  /** guid,唯一id */
  CategoryId: string
  /** 类目名称 */
  CategoryName: string
  /** 审核状态 */
  CheckStatus: MessageCheckStatus
}
const enum MessageCheckStatus {
  Checking = 0,
  Failed = 1,
  Successful = 2,
}
const enum MessageStatus {
  /** 队列中 */
  OnQueue = 1,
  /** 执行中 */
  Running = 2,
  /** 成功 */
  Success = 3,
  /** 失败 */
  Failure = 4,
}

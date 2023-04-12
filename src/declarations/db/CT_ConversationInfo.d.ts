interface CT_ConversationInfo extends BaseModelWithIP {
  Id: number
  /** 用户名 */
  UserName: string
  /** 名称 */
  Name: string
  /** 头像 */
  Header: string
  /** guid,唯一id */
  ConversationId: string
  /** 短id */
  ShortCode: string
  /** 标题 */
  Title: string
  /** 标题 */
  Keywords: string
  /** 最大字数 */
  MaxTokenCount: number
  /** 剩余字数 */
  RemainTokenCount: number
  /** 对话类型 */
  ConversationType: number
  /** 状态 */
  Status: number
  /** chatgpt的描述 */
  RoleDescription: string
  /** 消耗的次数 */
  CountCost: number
  /** 点赞数量 */
  Likes: number
  /** 评论数量 */
  Comments: number
  /** 收藏数量 */
  Favorites: number
  /** 浏览次数 */
  Views: number
  /** 提问数量，不包含回答 */
  MessageCount: number
  /** 审核状态 */
  CheckStatus: number
  /** guid,唯一id */
  CategoryId: string
  /** 类目名称 */
  CategoryName: string
  /** 图片数量 */
  ImageCount: number
  /** 隐私设置 */
  Privacy: ConverstationPrivacy
}
const enum ConverstationPrivacy {
  /** 仅自己可见 */
  Private = 0,
  /** 公共 */
  Public = 1,
}
const enum ConversationCheckStatus {
  Checking = 0,
  Failed = 1,
  Successful = 2,
}

const enum ConversationType {
  /** 聊天模式 */
  Chat = 1,
  /** 社区 */
  Public = 2,
  /** AI绘图 */
  AiDrawing = 3,
}
const enum ConversationStatus {
  /** 目前无执行中的任务，可以执行操作 */
  NoAction = 1,
  /** 等待执行 */
  Waiting = 2,
  /** 执行中 */
  Running = 3,
  /** 执行成功 */
  RunningSuccess = 4,
  /** 执行失败 */
  RunningFailed = 5,
}

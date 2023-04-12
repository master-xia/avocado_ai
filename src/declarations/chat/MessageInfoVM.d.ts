interface MessageInfoVM {
  Index: number
  UserName: string
  ConversationId: string
  MessageId: string
  IsChatGpt: boolean
  Content: string | JSX.Element
  CreateTime: Date
  Status: number
  Name?: string
  Header?: string
  CheckStatus: number
  /**
   * 下面是前端自己的字段
   */
  ErrorCode?: number
  ShowCopy?: boolean
  City: string
}

interface CheckConversationVM {
  ConversationId: string
  CheckStatus: boolean
  FailedImagesMD5?: string[]
  ExampleImagesMD5?: string[]
  Note?: string
}

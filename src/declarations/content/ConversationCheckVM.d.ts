interface ConversationCheckVM {
  Conversation: CT_ConversationInfo
  Images?: ConversationImageInfoVM[]
}
interface ConversationImageInfoVM {
  FileId: string
  MD5: string
  Url: string
}

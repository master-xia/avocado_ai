interface NotificationInfoVM {
  Id: number
  UserName: string
  NotificationId: string
  Content: string
  Title: string
  IsRead: boolean
  SourceType: number
  SourceCode?: string
  ReadTime?: Date
  CreateTime: Date
}

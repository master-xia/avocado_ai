interface ConversationInfoVM {
  ConversationId: string
  Title: string
  ConversationType: number
  Status: number
  CreateTime: Date
  UpdateTime: Date
  MaxTokenCount: number
  RemainTokenCount: number
  RoleDescription?: string

  UserName: string
  Name?: string
  Header?: string
  CheckStatus: number
  //guid,唯一id
  CategoryId: string
  //类目名称
  CategoryName: string
  //点赞数量
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

  ShortCode: string

  City: string
  Images: string[]
  ImageCount: number
}

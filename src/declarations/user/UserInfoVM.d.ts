interface UserInfoVM {
  UserName: string
  Name: string
  UsedCount: number
  RemainCount: number
  InviteCode: string
  InviteCount: number
  ReferCode: string
  PhoneStatus: boolean
  EmailStatus: boolean
  PhoneMask: string
  EmailMask: string
  LastLogin: Date
  Header: string
  UserType: number
  UserStatus: number
  IsSignToday: boolean
  ChangedProfile: boolean
  PublishedConversation: boolean
}
interface UI_UserInfo extends BaseModel {
  UserName: string
  Name: string
  UsedCount: number
  RemainCount: number
  InviteCode: string
  InviteCount: number
  ReferCode: string
  PhoneStatus: boolean
  EmailStatus: boolean
  PhoneNumber?: string
  Email?: string
  LastLogin: Date
  Header: string
  UserType: number
  UserStatus: number
}

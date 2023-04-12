interface FI_FileInfo extends BaseModelWithIP {
  Id: number
  /** 用户名 */
  UserName: string
  /** 文件的类型 */
  FileMimeType: string
  /** 绑定的编码 */
  TargetCode: string
  /** 文件绑定的类型 */
  TargetType: FileTargetType
  /** guid,唯一id */
  FileId: string
  /** oss的路径 */
  OssKey: string
  /** oss的bucket名称 */
  OssBucket: string
  /** oss的bucket域名 */
  OssBucketDomain: string
  /** oss的endpoint */
  OssEndpoint: string
  /** 本地上传文件的全名称，含路径 */
  FullFileName: string
  /** 本地路径 */
  LocalUrl: string
  /** md5 */
  MD5: string
  /** 文件大小 byte */
  FileSize: number
  /** 文件大小字符串 */
  FileSizeStr: string
  /** 权限 */
  Privacy: FilePrivacy
  /** 文件上传状态 */
  UploadStatus: FileUploadStatus
}
const enum FileUploadStatus {
  /** 不知道是否已经上传到oss */
  WaitingToCheck = 0,
  /** 已经上传到oss */
  UploadedToOss = 1,
  /** 检查失败 */
  CheckError = 2,
}
const enum FileTargetType {
  /** ai绘画 */
  AiDrawingPicture = 1,
  /** ai绘画,有水印 */
  AiDrawingWatermarkPicture = 2,
  /** 用户拥有的物品主图 */
  OwnershipPicture = 3,
  /** 用户头像 */
  UserProfilePicture = 4,
  /** 话题的图片 */
  ConversationPicture = 5,
  /** ai绘图上传的启发图 */
  AiDrawingSourcePicture = 6,
}
const enum FilePrivacy {
  /** 私有 */
  Private = 1,
  /** 公共读 */
  PublicRead = 2,
}

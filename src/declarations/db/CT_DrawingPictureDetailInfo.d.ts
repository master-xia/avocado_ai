interface CT_DrawingPictureDetailInfo extends BaseModel {
  Id: number
  /** 用户名 */
  UserName: string
  /** 名称 */
  Name: string
  /** 头像 */
  Header: string
  /** guid,唯一id */
  PictureId: string
  /** guid,唯一id */
  DrawingId: string
  /** guid,唯一id */
  ConversationId: string
  /** 比例id */
  RatioId: string
  /** 属性id */
  PropertyId: string
  /** 模型id */
  ModelId: string
  /** 画图类型 */
  DrawType: DrawType
  /** 风格 */
  Styles: string
  /** 艺术家 */
  Artists: string
  Tags: string
  NegativeTags: string
  NegativePrompt: string
  /** 生成的图片宽度 */
  Width: number
  /** 生成的图片高度 */
  Height: number
  /** oss的路径 */
  OssKey: string
  /** oss的路径 */
  WatermarkOssKey: string
  /** oss的bucket名称 */
  OssBucket: string
  /** oss的bucket域名 */
  OssBucketDomain: string
  /** oss的endpoint */
  OssEndpoint: string
  /** 本地路径 */
  LocalUrl: string
  /** md5 */
  MD5: string
  /** 文件大小 byte */
  FileSize: number
  /** 文件大小字符串 */
  FileSizeStr: string
  /** 购买了这个图片版权的人数量 */
  OwnerCount: number
  /** 模型名称 */
  ModelName: string
  /** 属性名称 */
  Property: string
  /** 比例名称 */
  Ratio: string
  /** 审核状态 */
  CheckStatus: DrawingPictureCheckStatus
  /** 点赞数量 */
  Likes: number
  /** 评论数量 */
  Comments: number
  /** 收藏数量 */
  Favorites: number
  /** 浏览次数 */
  Views: number
}
const enum DrawingPictureCheckStatus {
  Checking = 0,
  Failed = 1,
  Successful = 2,
}

interface DrawingPictureDetailInfoVM {
  Id: number
  /// <summary>
  /// 用户名
  /// </summary>
  UserName: string
  /// <summary>
  /// guid,唯一id
  /// </summary>
  PictureId: string
  /// <summary>
  /// 画图类型
  /// </summary>
  DrawType: number
  /** 风格 */
  Styles: string
  /** 艺术家 */
  Artists: string
  Tags: string
  NegativeTags: string
  NegativePrompt: string
  /// <summary>
  /// 生成的图片宽度
  /// </summary>
  Width: number
  /// <summary>
  /// 生成的图片高度
  /// </summary>
  Height: number

  FileSize: number

  /// <summary>
  /// 文件大小字符串
  /// </summary>
  FileSizeStr: string
  Header: string
  Name: string
  //是否有版权
  IsOwner: boolean
  //购买版权的用户数量
  OwnerCount: number
  /// <summary>
  /// 图片的链接，如果用户有所有权，他看到的就没水印
  /// </summary>
  Url: string
  //点赞数量
  Likes: number
  Favorites: number
  //评论数量
  Comments: number
  Views: number
  IsLike: boolean
  IsView: boolean
  IsComment: boolean
  IsFavorite: boolean
  CheckStatus: number
  CreateTime: Date

  /// <summary>
  /// guid,唯一id
  /// </summary>
  DrawingId: string
  /// <summary>
  /// guid,唯一id
  /// </summary>
  ConversationId: string
  /// <summary>
  /// 画图类型
  /// </summary>
  DrawType: number
  /// <summary>
  /// 文本
  /// </summary>
  Prompt: string
  /// <summary>
  /// 文本英文
  /// </summary>
  PromptEn: string
  /// <summary>
  /// 文本英文(消极)
  /// </summary>
  NegativePromptEn: string
  /// <summary>
  /// 种子
  /// </summary>
  Seed: number
  /// <summary>
  /// 1-30越大代表和训练原图越相似，随机度 默认7
  /// </summary>
  CFG: number
  /// <summary>
  /// 取样方法 默认Euler a
  /// </summary>
  SamplingMethod: number
  /// <summary>
  /// 取样步数量，一般越大细节越多，1-150，推荐20-30
  /// </summary>
  Steps: number
  /// <summary>
  /// 是否重建脸部，突出脸部细节
  /// </summary>
  RestoreFaces: boolean

  /// <summary>
  /// img2img的参数 图片裁剪模式
  /// </summary>
  ResizeMode: string

  /// <summary>
  /// img2img的参数和原图的相识程度
  /// </summary>
  DenoisingStrength: number
  /// <summary>
  /// 图片数量
  /// </summary>
  ImageCount: number

  /// <summary>
  /// 状态
  /// </summary>
  DrawingStatus: number
  /// <summary>
  /// 尺寸放大倍数
  /// </summary>
  Resize: number
  /// <summary>
  /// 模型是否支持中文
  /// </summary>
  SupportChinese: boolean
  /// <summary>
  /// 模型名称
  /// </summary>
  ModelName: string
  /// <summary>
  /// 属性名称
  /// </summary>
  Property: string
  /// <summary>
  /// 比例名称
  /// </summary>
  Ratio: string
  ConversationId: string
}

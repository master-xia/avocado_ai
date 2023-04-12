interface CT_DrawingInfo extends BaseModelWithIP {
  Id: number
  /** 用户名 */
  UserName: string
  /** 名称 */
  Name: string
  /** 头像 */
  Header: string
  /** guid,唯一id */
  DrawingId: string
  /** 比例id */
  RatioId: string
  /** 属性id */
  PropertyId: string
  /** guid,唯一id */
  ConversationId: string
  /** 模型id */
  ModelId: string
  /** 画图类型 */
  DrawType: DrawType
  /** 文本 */
  Prompt: string
  /** 文本英文 */
  PromptEn: string
  /** 文本消极 */
  NegativePrompt: string
  /** 文本英文(消极) */
  NegativePromptEn: string
  /** 每步的花费 */
  StepCost: number
  /** 次数消耗 */
  CountCost: number
  /** 风格 */
  Styles: string
  /** 艺术家 */
  Artists: string
  Tags: string
  TagsEn: string
  NegativeTags: string
  NegativeTags: string
  /** 生成的图片宽度 */
  Width: number
  /** 生成的图片高度 */
  Height: number
  /** 种子 */
  Seed?: number
  /** 1-30越大代表和训练原图越相似，随机度 默认7 */
  CFG: number
  /** 取样方法 默认Euler a */
  SamplingMethod: string
  /** 取样步数量，一般越大细节越多，1-150，推荐20-30 */
  Steps: number
  /** 是否重建脸部，突出脸部细节 */
  RestoreFaces: boolean
  /** img2img的参数 图片裁剪模式 */
  ResizeMode: string
  /** 原图路径 img2img的参数 */
  SourceFileId: string
  /** img2img的参数和原图的相识程度 */
  DenoisingStrength?: number
  /** 图片数量 */
  ImageCount: number
  /** 绘图所耗时ms */
  Duration?: number
  /** 备注 */
  Note: string
  /** 状态 */
  DrawingStatus: DrawingStatus
  /** 绘制开始时间 */
  StartTime?: Date
  /** 附加的额外prompt */
  ExtraPromptEn: string
  /** 尺寸放大倍数 */
  Resize: number
  /** 模型是否支持中文 */
  SupportChinese: boolean
  /** 模型名称 */
  ModelName: string
  /** 属性名称 */
  Property: string
  /** 比例名称 */
  Ratio: string
  /** 点赞数量 */
  Likes: number
  /** 评论数量 */
  Comments: number
  /** 收藏数量 */
  Favorites: number
  /** 浏览次数 */
  Views: number
  /** 审核状态 */
  CheckStatus: DrawingCheckStatus
}
const enum DrawingStatus {
  Waiting = 0,
  Drawing = 1,
  Success = 2,
  Failure = 3,
}
const enum DrawingCheckStatus {
  Checking = 0,
  Failed = 1,
  Successful = 2,
}
const enum DrawType {
  Text2Img = 0,
  Img2Img = 1,
}
interface AiDrawingResizeMode {}

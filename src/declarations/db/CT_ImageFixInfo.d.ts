interface CT_ImageFixInfo extends BaseModelWithIP {
  Id: number
  FixId: string
  UserName: string
  /** 质量 */
  Quality: number
  /** 消耗的次数 */
  CountCost: number
  /** 放大多少倍 */
  ScaleBy: number
  /** 放大到多少宽度 */
  ScaleToWidth: number
  /** 放大到多少高度 */
  ScaleToHeight: number
  /** 是否裁剪到合适大小 */
  CropToFit: boolean
  /** upscaler1 */
  Upsacler1: string
  /** upscaler2 */
  Upsacler2: string
  /** upscaler2 */
  Upsacler2Visibility: number
  /** GFPGAN Visibility */
  GFPGANVisibility: number
  /** CodeFormer Visibility */
  CodeFormerVisibility: number
  /** CodeFormer Weight */
  CodeFormerWeight: number
  /** 缩放模式， 0是scale siez 1是缩放成指定大小 */
  ResizeMode: number
  /** 备注信息 */
  Note: string
  /** 审核状态 */
  CheckStatus: number
  /** 状态 */
  Status: number
  /** 原图文件id */
  SourceFileId: string
  /** 处理后文件id */
  FixedFileId: string
  /** 原图文件宽度 */
  SourceImageWidth: number
  /** 原图文件高度 */
  SourceImageHeight: number
  /** 修复后文件宽度 */
  FixedImageWidth: number
  /** 修复后文件高度 */
  FixedImageHeight: number
  /** 绘图所耗时ms */
  Duration?: number
  /** 绘制开始时间 */
  StartTime?: Date
  /** 绘制开始时间 */
  FinishedTime?: Date
}

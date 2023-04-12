interface ImageFixInfoVM {
  Id: number
  FixId: string
  CheckStatus: number
  /** 图片前的图片路径 */
  SourceImageUrl: string
  /** 状态 */
  Status: number
  /** 质量 */
  Quality: number
  /** 修复后的图片路径 */
  FixedImageUrl: string
  /** 原图文件宽度 */
  SourceImageWidth: number
  /** 原图文件高度 */
  SourceImageHeight: number
  /** 修复后文件宽度 */
  FixedImageWidth: number
  /** 修复后文件高度 */
  FixedImageHeight: number
  SourceImageSizeStr?: string
  FixedImageSizeStr?: string
  SourceImageSize?: number
  FixedImageSize?: number
  CreateTime: Date
  UserName: string
  UpdateTime: Date
  CountCost: number
}

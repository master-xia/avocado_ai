interface CreateRemoveBgVM {
  /** 原图片id */
  SourceFileId: string
  /** 模型名称 */
  ModelType: number
  /** Enable Alpha Matting */
  A?: boolean
  /** Alpha Matting (Foreground Threshold) */
  AF?: number
  /** Alpha Matting (Background Threshold) */
  AB?: number
  /** Alpha Matting (Erode Structure Size) */
  AE?: number
  /** Only Mask */
  OM?: boolean
  /** Post Process Mask */
  PPM?: boolean
  /** 背景颜色 */
  BgColor?: string
  RemoveBgType: number
}

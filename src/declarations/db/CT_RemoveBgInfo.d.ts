interface CT_RemoveBgInfo extends BaseModelWithIP {
  Id: number
  RemoveId: string
  UserName: string
  /** 消耗的次数 */
  CountCost: number
  /** 模型名称 */
  Model: string
  /** Enable Alpha Matting */
  A: boolean
  /** Alpha Matting (Foreground Threshold) */
  AF: number
  /** Alpha Matting (Background Threshold) */
  AB: number
  /** Alpha Matting (Erode Structure Size) */
  AE: number
  /** Only Mask */
  OM: boolean
  /** Post Process Mask */
  PPM: boolean
  /** 背景颜色 */
  BgColor: string
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
  RemovedImageWidth?: number
  /** 修复后文件高度 */
  RemovedImageHeight?: number
  /** 绘图所耗时ms */
  Duration?: number
  /** 绘制开始时间 */
  StartTime?: Date
  /** 绘制开始时间 */
  FinishedTime?: Date
}

interface RemoveBgInfoVM {
  UserName: string
  Id: number
  RemoveId: string
  /** 图片前的图片路径 */
  SourceImageUrl: string
  /** 状态 */
  Status: number
  /** 修复后的图片路径 */
  RemovedBgImageUrl: string
  /** 原图文件宽度 */
  SourceImageWidth: number
  /** 原图文件高度 */
  SourceImageHeight: number
  /** 修复后文件宽度 */
  RemovedImageWidth?: number
  SourceImageSizeStr: string
  RemovedImageSizeStr: string
  SourceImageSize?: number
  RemovedImageSize?: number
  /** 修复后文件高度 */
  RemovedImageHeight?: number
  CheckStatus: number
  CreateTime: Date
  UpdateTime: Date
  RemoveBgType: number
  EditInfo?: RemBgEditInfoVM
  CountCost: number
}

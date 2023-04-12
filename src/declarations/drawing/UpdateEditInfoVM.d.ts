interface UpdateEditInfoVM {
  RemoveId: string
  EditInfo: RemBgEditInfoVM
}
interface RemBgEditInfoVM {
  /** 图片高度 */
  Height: number
  /** 图片旋转角度 */
  Rotate: number
  /** 图片宽度 */
  Width: number
  /** 水平翻转 */
  ScaleX: number
  /** 垂直翻转 */
  ScaleY: number
  /** 图片坐标 */
  X: number
  /** 图片坐标 */
  Y: number
  /** 裁剪框坐标 */
  CropLeft: number
  /** 裁剪框坐标 */
  CropTop: number
  /** 裁剪框高度 */
  CropHeight: number
  /** 裁剪框宽度 */
  CropWidth: number
  /** 图片背景 */
  BgColor: string
  /** 证件类型 */
  PhotoType: string
  /** 裁剪比例 */
  Ratio: string
  /// <summary>
  /// Canvas坐标
  /// </summary>
  CanvasLeft: number
  /// <summary>
  /// Canvas坐标
  /// </summary>
  CanvasTop: number
  /// <summary>
  /// Canvas高度
  /// </summary>
  CanvasHeight: number
  /// <summary>
  /// Canvas宽度
  /// </summary>
  CanvasNatureWidth: number
  /// <summary>
  /// Canvas高度
  /// </summary>
  CanvasNatureHeight: number
  /// <summary>
  /// Canvas宽度
  /// </summary>
  CanvasWidth: number
}

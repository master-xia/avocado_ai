interface DrawingParamsVM {
  Artists: string[]
  Styles: string[]
  SamplingMethods: string[]
  Models: DrawingModelInfoVM[]
  ResizeModes: string[]
  Tags: string[]
  NegativeTags: string[]
}
interface DrawingModelInfoVM {
  Id: number
  ModelId: string
  /// <summary>
  /// 模型名称
  /// </summary>
  ModelName: string
  /// <summary>
  /// 1-30越大代表和训练原图越相似，随机度 默认7
  /// </summary>
  CFG: string
  /// <summary>
  /// 取样方法 默认Euler a
  /// </summary>
  SamplingMethod: string
  /// <summary>
  /// 取样步数量，一般越大细节越多，1-150，推荐20-30
  /// </summary>
  Steps: number
  /// <summary>
  /// 是否重建脸部，突出脸部细节
  /// </summary>
  RestoreFaces: string
  /// <summary>
  /// img2img的参数 图片裁剪模式
  /// </summary>
  ResizeMode: string
  /// <summary>
  /// img2img的参数和原图的相识程度
  /// </summary>
  DenoisingStrength: number
  /// <summary>
  /// 宽度
  /// </summary>
  Width: number
  /// <summary>
  /// 高度
  /// </summary>
  Height: number
  Description?: string
  Description: string
  PropertyList: DrawingModelPropertyInfoVM[]
  UsedCount: number
}
interface DrawingModelPropertyInfoVM {
  Id: number
  /// <summary>
  /// guid,唯一id
  /// </summary>
  PropertyId: string
  /// <summary>
  /// 模型id
  /// </summary>
  ModelId: string
  /// <summary>
  /// 属性label
  /// </summary>
  Label: string
  /// <summary>
  /// 比例列表
  /// </summary>
  RatioList: DrawingModelPropertyRatioInfoVM[]
  /// <summary>
  /// 最大的图片数量
  /// </summary>
  MaxImageCount: number
  /// <summary>
  /// 每一步的Cost
  /// </summary>
  StepCost: number
  ///
  Resize: number
}
interface DrawingModelPropertyRatioInfoVM {
  Id: number
  /// <summary>
  /// 比例id
  /// </summary>
  RatioId: string
  /// <summary>
  /// 属性id
  /// </summary>
  PropertyId: string
  /// <summary>
  /// 模型id
  /// </summary>
  ModelId: string
  /// <summary>
  /// 属性label
  /// </summary>
  Label: string

  Width: number
  Height: number
}

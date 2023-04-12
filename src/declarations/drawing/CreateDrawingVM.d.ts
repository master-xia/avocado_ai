interface CreateDrawingVM {
  /// <summary>
  /// 模型id
  /// </summary>
  ModelId: string
  /// <summary>
  /// 画图类型
  /// </summary>
  DrawType: string
  /// <summary>
  /// 文本
  /// </summary>
  Prompt: string
  /// <summary>
  /// 风格
  /// </summary>
  Styles?: string[]
  /// <summary>
  /// 艺术家
  /// </summary>
  Artists?: string[]
  //提示词
  Tags?: string[]
  //消极提示词
  NegativeTags?: []
  /// <summary>
  /// 图片比例，默认1
  /// </summary>
  Ratio?: number
  /// <summary>
  /// 生成图片质量
  /// </summary>
  Quality?: number
  /// <summary>
  /// 1-30越大代表和训练原图越相似，随机度 默认7
  /// </summary>
  CFG?: number
  /// <summary>
  /// 取样方法 默认Euler a
  /// </summary>
  SamplingMethod: string
  /// <summary>
  /// 取样步数量，一般越大细节越多，1-150，推荐20-30
  /// </summary>
  Steps?: number
  /// <summary>
  /// 是否重建脸部，突出脸部细节
  /// </summary>
  RestoreFaces?: boolean
  /// <summary>
  /// img2img的参数 图片裁剪模式
  /// </summary>
  ResizeMode?: number
  /// <summary>
  /// 原图路径 img2img的参数
  /// </summary>
  SourceImgSrc?: string
  /// <summary>
  /// img2img的参数和原图的相识程度
  /// </summary>
  DenoisingStrength?: number
  /// <summary>
  /// 图片数量
  /// </summary>
  ImageCount: int
  //是否发布到话题
  IsPublic?: boolean
}

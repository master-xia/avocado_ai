interface CommonResult<T = any | undefined> {
  IsSuccess: boolean
  Data?: any
  Result?: T
  Message: string
  Code: number
}
enum CommonResultCode {
  None = 0,
  //鉴权失败
  AuthFail = 10001,
  /// <summary>
  /// 请求拒绝
  /// </summary>
  ActionDeny = 10002,
  /// <summary>
  /// 请求参数不合法
  /// </summary>
  ArgumentsInvalid = 20001,
  /// <summary>
  /// 后台执行操作出现异常
  /// </summary>
  Exception = 20002,
  /// <summary>
  /// 未知错误
  /// </summary>
  UnknownErr = 20003,
  /// <summary>
  /// 出现并发问题，请求失败，稍后重试
  /// </summary>
  ConcurrencyError = 20004,

  /// <summary>
  /// 数据不存在
  /// </summary>
  InfoNotExist = 30001,
}

interface AvocadoInfoVM {
  /// <summary>
  /// 话题获得一个点赞的奖励次数
  /// </summary>
  ConversationLikeGet: number
  RegisterGet: number
  /// <summary>
  /// 每日签到的奖励次数
  /// </summary>
  SignGet: number
  /// <summary>
  /// 邀请用户获得的次数
  /// </summary>
  InviteUserGet: number
  /// <summary>
  /// 对话提问的消耗次数
  /// </summary>
  ChatMessageCost: number
  /// <summary>
  /// 创建话题消耗的次数
  /// </summary>
  CreateConversationCost: number
  /// <summary>
  /// 话题提问消耗的次数
  /// </summary>
  ConversationQuestionCost: number
  /// <summary>
  /// 话题评论消耗的次数
  /// </summary>
  ConversationCommentCost: number
  //首次发布话题的奖励
  FisrtPublicConversationGet: number
  //购买ai绘图原图
  BuyAiDrawingPicture: number
  //获取无水印内容
  GetContentWithoutWatermark: number
  //修改照片
  RepairPicture: number
  //去除图片背景
  RemoveBg: number
  //关注微信公众号
  FollowWxOfficialAccount: number
}

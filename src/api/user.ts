import { GET, POST, PUT } from './axios'

/**
 * 登录
 * @param userLoginVM
 * @returns
 */
export function login(model: LoginVM) {
  return POST('/api/User/Login', model)
}
/**
 * 登录
 * @param model
 * @returns
 */
export function register(model: RegisterVM) {
  return POST('/api/user/register', model)
}
/**
 * 退出登录
 * @returns
 */
export function logintOut() {
  return POST('/api/User/logout')
}
/**
 * 获取用户信息
 * @param hideLoading
 * @returns
 */
export function getUserInfo(hideLoading = false) {
  return GET<UserInfoVM>('/api/User/userInfo', {}, hideLoading)
}
/**
 * 修改密码
 * @param model
 * @returns
 */
export function changePwd(model: ChangePwdVM) {
  return PUT('/api/User/changePwd', model)
}
/**
 * 获取验证手机号的验证码
 * @param model
 * @returns
 */
export function getVerifyPhoneCode(model: SendSmsCodeVM) {
  return POST('/api/User/sendVerifyPhoneSmsCode', model)
}
/**
 * 获取修改密码手机号的验证码
 * @param model
 * @returns
 */
export function getForgotPwdSmsCode(model: SendSmsCodeVM) {
  return POST('/api/User/SendForgotPwdSmsCode', model)
}
export function forgotPwd(model: ForgotPwdVM) {
  return PUT('/api/User/forgotPwd', model)
}
/**
 * 验证手机号
 * @param model
 * @returns
 */
export function verifyPhone(model: BindPhoneVM) {
  return POST('/api/User/verifyPhone', model)
}
/**
 * 获取用户的登录状态
 * @returns
 */
export async function getLoginStatus(hideLoading = false) {
  return GET('/api/User/loginStatus', {}, hideLoading)
}
/**
 * 检查推荐码是否有效
 * @param referCode
 * @returns
 */
export async function checkReferCode(referCode: string) {
  return POST('/api/User/referCode/' + referCode, {})
}
/**
 * 获取登录验证码
 * @param model
 * @returns
 */
export function getLoginCode(model: SendSmsCodeVM) {
  return POST('/api/User/LoginCode', model)
}
/**
 * 手机号登录或者注册
 * @param model
 * @returns
 */
export function phoneLogin(model: PhoneLoginVM) {
  return POST('/api/User/loginByPhone', model)
}
/**
 * 获取未读消息数量
 * @param isHideLoading
 * @returns
 */
export function getUnreadNotificationCount(isHideLoading: boolean) {
  return GET<number>('/api/user/notification/unreadCount', {}, isHideLoading)
}
/**
 * 获取消息列表
 * @param query
 * @returns
 */
export function getNotificationList(
  query: NotificationQuery,
  isHideLoading: boolean
) {
  return GET<NotificationInfoVM[]>(
    '/api/user/notification/list',
    query,
    isHideLoading
  )
}
/**
 * 通知已读
 * @param notificationId
 * @returns
 */
export function readNotification(notificationId: string) {
  return PUT<number>('/api/user/notification/read/' + notificationId, {})
}
/**
 * 获取用户状态信息
 * @param isHideLoading
 * @returns
 */
export function getUserStatus(isHideLoading: boolean) {
  return GET<UserStatusVM>('/api/user/status', {}, isHideLoading)
}
/**
 * 每日签到
 * @param signInfo
 * @returns
 */
export function signToday(signInfo: SignVM) {
  return POST('/api/user/sign', signInfo)
}
/**
 * 修改账号信息
 * @param userInfo
 * @returns
 */
export function updateProfile(userInfo: UpdateProfileVM) {
  return POST('/api/user/userInfo', userInfo)
}
/**
 * 获取授权列表
 * @param query
 * @returns
 */
export function getOwnershipList(query: OwnershipQuery, hideLoading: boolean) {
  return GET<OwnershipInfoVM[]>('/api/user/ownership/list', query, hideLoading)
}
/**
 * 获取绑定微信公众号的code
 * @param model
 * @returns
 */
export function getBindWxOfficialAccountCode(model: SendSmsCodeVM) {
  return POST('/api/User/bindWxOfficialAccountCode', model)
}
/**
 * 绑定微信公众号
 * @param model
 * @returns
 */
export function bindWxOfficialAccount(model: BindWxOfficialAccountVM) {
  return POST('/api/User/bindWxOfficialAccount', model)
}

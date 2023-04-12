import { getLoginStatus } from '@api/user'
import { clearCookie, getCookie, setCookie } from './common'
import store from '@store'
import { updateLoginStatus } from '@store/modules/auth'
export const tokenKey = 'chatGPT_pToken'
/**
 * 获取登录的token
 */
export function getToken() {
  return getCookie(tokenKey) || ''
}
/**重定向到登录 */
export function redirectToLogin() {
  window.location.href = '/user/login'
}
/**
 * 鉴权
 * @returns
 */
export function checkAuth() {
  return store.getState().auth.loginStatus
}
/**检测页面是否能访问 */
export async function checkPageAuth(path: string) {}
/**
 * 清除本地token
 */
export function logout() {
  clearCookie()
  store.dispatch(updateLoginStatus(false))
  redirectToLogin()
}
/**
 * 设置本地token
 */
export function login() {
  store.dispatch(updateLoginStatus(true))
}

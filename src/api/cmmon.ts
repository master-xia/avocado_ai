import { DELETE, GET, POST, PUT } from './axios'
/**
 * 获取图像验证码
 * @param hideLoading
 * @returns
 */
export function getGraphicValidate(hideLoading = false) {
  return GET<ValidateGraphic>('/api/common/graphicCode', {}, hideLoading)
}
/**
 * 验证图像验证码
 * @param model
 * @param hideLoading
 * @returns
 */
export function validateGraphicCode(model: any, hideLoading = false) {
  return POST<string>('/api/common/graphicCode', model, hideLoading)
}
/**
 * 获取牛油果的信息
 * @returns
 */
export function getAvocadaInfoVM() {
  return GET<AvocadoInfoVM>('/api/common/avocadoInfo', {})
}
/**
 * 获取验证手机的奖励次数
 * @returns
 */
export function getVerifyPhoneRewardCount() {
  return GET<string>('/api/common/verifyPhoneRewardCount', {})
}
/**
 * 每条消息需要扣除的次数
 * @returns
 */
export function getMessageCost() {
  return GET<string>('/api/common/messageCost', {})
}
/**
 * 获取套餐
 * @returns
 */
export function getOrderPackages() {
  return GET<string[][]>('/api/common/orderPackages', {})
}

/**
 * 获取字典列表
 * @param query
 * @param loading
 * @returns
 */
export async function getDicInfoList(query: DicInfoQuery, loading = true) {
  return GET<CI_DicInfo[]>('/api/admin/common/dic/list2', query, loading)
}
/**
 * 获取字典的domain列表
 * @returns
 */
export async function getDicDomainList() {
  return GET<string[]>('/api/admin/common/dic/domains')
}
/**
 * 新增字典信息
 * @param model
 * @returns
 */
export async function addDicInfo(model: AddDicInfoVM) {
  return POST('/api/admin/common/dic', model)
}
/**
 * 编辑字典信息
 * @param model
 * @returns
 */
export async function updateDicInfo(model: UpdateDicInfoVM) {
  return PUT('/api/admin/common/dic', model)
}
/**
 * 删除字典信息
 * @param id
 * @returns
 */
export async function deleteDicInfo(id: number) {
  return DELETE('/api/admin/common/dic/' + id)
}
/**
 * 获取字典信息
 * @param id
 * @returns
 */
export async function getDicInfo(id: number) {
  return GET<CI_DicInfo>('/api/admin/common/dic/' + id)
}
export async function uploadFileToAliyunOss(data: AliyunOSSUploadFileVM) {
  return POST<AliyunOSSUploadFileVM>(data.host, data, false)
}
/**
 * 获取无水印内容
 * @param model
 * @returns
 */
export async function getContentWithoutWatermark(
  model: GetContentWithoutWatermarkVM
) {
  return POST<string>('/api/common/noWatermark', model)
}
/**
 * 获取无水印内容提取纪录
 * @param contentId
 * @returns
 */
export async function getNoWatermarkContentInfoVM(contentId: string) {
  return GET<NoWatermarkContentInfoVM>(
    '/api/common/noWatermark/detail/' + contentId
  )
}

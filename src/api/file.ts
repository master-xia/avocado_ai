import { DELETE, GET, POST, PUT } from './axios'

/**
 * 上传完需要调用这个方法
 * @param fileId
 * @returns
 */
export function checkFile(fileId: string) {
  return POST<CheckFileResultVM>('/api/file/check/' + fileId, {})
}
/**
 * 获取ai绘图的上传token
 * @returns
 */
export function getAiDrawingUplodaToAliyunOSSPolicyToken(
  model: GetUplodaToAliyunOSSPolicyTokenBaseVM
) {
  return GET<AliyunOssPolicyTokenVM>('/api/file/aidrawing/token', model)
}

export function getImageFixUplodaToAliyunOSSPolicyToken(
  model: GetUplodaToAliyunOSSPolicyTokenBaseVM
) {
  return GET<AliyunOssPolicyTokenVM>('/api/file/imageFix/token', model)
}
/**
 * 获取图片抠图的上传token
 * @returns
 */
export function getRemoveBgUplodaToAliyunOSSPolicyToken(
  model: GetUplodaToAliyunOSSPolicyTokenBaseVM
) {
  return GET<AliyunOssPolicyTokenVM>('/api/file/rembg/token', model)
}

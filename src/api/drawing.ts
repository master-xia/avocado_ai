import { DELETE, GET, POST, PUT } from './axios'

/**
 * 获取绘图参数
 * @returns
 */
export function getDrawingParamsVM() {
  return GET<DrawingParamsVM>('/api/drawing/params', {})
}
export function createDrawing(model: CreateDrawingVM) {
  return POST<string>('/api/drawing/create', model)
}
/**
 * 通过conversationId获取绘图细节
 * @param converesationId
 * @returns
 */
export function getAiDrawingDetailsByConversationId(converesationId: string) {
  return GET<DrawingPictureDetailInfoVM[]>(
    '/api/drawing/conversation/' + converesationId,
    {}
  )
}
export function getDrawingDetail(pictureId: string) {
  return GET<DrawingPictureDetailInfoVM>('/api/drawing/detail/' + pictureId, {})
}
/**
 * 标记浏览过
 * @param pictureId
 * @param hideLoading
 * @returns
 */
export function viewPictureAction(pictureId: string, hideLoading = true) {
  return POST('/api/drawing/picture/view/' + pictureId, {}, false, hideLoading)
}
/**
 * 点赞
 * @param pictureId
 * @param hideLoading
 * @returns
 */
export function likePictureAction(pictureId: string, hideLoading = true) {
  return POST('/api/drawing/picture/like/' + pictureId, {}, false, hideLoading)
}
/**
 * 取消点赞
 * @param pictureId
 * @param hideLoading
 * @returns
 */
export function dislikePictureAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/drawing/picture/dislike/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 收藏
 * @param pictureId
 * @param hideLoading
 * @returns
 */
export function favoritePictureAction(pictureId: string, hideLoading = true) {
  return POST(
    '/api/drawing/picture/favorite/' + pictureId,
    {},
    false,
    hideLoading
  )
}
/**
 * 取消收藏
 * @param pictureId
 * @param hideLoading
 * @returns
 */
export function disfavoritePictureAction(
  pictureId: string,
  hideLoading = true
) {
  return POST(
    '/api/drawing/picture/disfavorite/' + pictureId,
    {},
    false,
    hideLoading
  )
}
/**
 * 购买图片授权
 * @param pictureId
 * @returns
 */
export function buyPictureAction(pictureId: string) {
  return POST('/api/drawing/picture/buy/' + pictureId, {})
}
/**
 * 获取模型案例
 * @param query
 * @returns
 */
export function getModelExamples(
  query: DrawingPictureQuery,
  hideLoading: boolean = false
) {
  return GET<DrawingPictureDetailInfoVM[]>(
    '/api/drawing/model/example/' + query.ModelId,
    query,
    hideLoading
  )
}
/**
 * 创建修复图片
 * @param model
 * @returns
 */
export function createImageFix(model: CreateImageFixVM) {
  return POST('/api/drawing/fix', model)
}
/**
 * 获取ai图片修改信息
 * @param fixId
 * @param hideLoading
 * @returns
 */
export function getImageFixInfoVM(fixId: string, hideLoading: boolean = false) {
  return GET<ImageFixInfoVM>(
    '/api/drawing/fix/detail/' + fixId,
    {},
    hideLoading
  )
}
/**
 * 获取ai图片修改状态
 * @param fixId
 * @param hideLoading
 * @returns
 */
export function getImageFixStatus(fixId: string, hideLoading: boolean = false) {
  return GET<number>('/api/drawing/fix/status/' + fixId, {}, hideLoading)
}
/**
 * 删除ai图片修改
 * @param fixId
 * @returns
 */
export function deleteImageFixInfo(fixId: string) {
  return DELETE('/api/drawing/fix/' + fixId, {})
}
/**
 * 获取ai修图列表
 * @param query
 * @param hideLoading
 * @returns
 */
export function getImageFixInfoVMPageList(
  query: ImageFixInfoQuery,
  hideLoading: boolean = false
) {
  return GET<ImageFixInfoVM[]>('/api/drawing/fix/list', query, hideLoading)
}

/**
 * 创建ai抠图
 * @param model
 * @returns
 */
export function createRemoveBg(model: CreateRemoveBgVM) {
  return POST('/api/drawing/rembg', model)
}
/**
 * 获取ai抠图信息
 * @param fixId
 * @param hideLoading
 * @returns
 */
export function getRemoveBgInfoVM(
  removeId: string,
  hideLoading: boolean = false
) {
  return GET<RemoveBgInfoVM>(
    '/api/drawing/rembg/detail/' + removeId,
    {},
    hideLoading
  )
}
/**
 * 获取ai抠图状态
 * @param fixId
 * @param hideLoading
 * @returns
 */
export function getRemoveBgStatus(
  removeId: string,
  hideLoading: boolean = false
) {
  return GET<number>('/api/drawing/rembg/status/' + removeId, {}, hideLoading)
}
/**
 * 删除ai抠图
 * @param fixId
 * @returns
 */
export function deleteRemoveBgInfo(removeId: string) {
  return DELETE('/api/drawing/rembg/' + removeId, {})
}
/**
 * 获取ai抠图列表
 * @param query
 * @param hideLoading
 * @returns
 */
export function getRemoveBgInfoVMPageList(
  query: RemoveBgInfoQuery,
  hideLoading: boolean = false
) {
  return GET<RemoveBgInfoVM[]>('/api/drawing/rembg/list', query, hideLoading)
}
/**
 * 修改照片的编辑
 * @param model
 * @param hideLoading
 * @returns
 */
export function updateEditInfo(model: UpdateEditInfoVM, hideLoading = true) {
  return PUT('/api/drawing/rembg/editInfo', model, false, hideLoading)
}

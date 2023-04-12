import { DELETE, GET, POST, PUT } from './axios'
/**
 * 获取平台数据
 * @returns
 */
export function getStatictic() {
  return GET<StatisticOverviewVM>('/api/admin/content/statistic')
}
/**
 * 获取下一个需要审核的对话
 * @returns
 */
export function getNextUncheckConversation() {
  return GET<ConversationCheckVM>('/api/admin/content/conversation/nextUncheck')
}
/**
 * 审核对话
 * @param model
 * @returns
 */
export function checkConversation(model: CheckConversationVM) {
  return POST('/api/admin/content/conversation/check', model)
}
/**
 * 获取下一个需要审核的评论
 * @returns
 */
export function getNextUncheckCommnetInfo() {
  return GET<CT_CommentInfo>('/api/admin/content/comment/nextUncheck')
}
/**
 * 审核评论
 * @param model
 * @returns
 */
export function checkComment(model: CheckCommentVM) {
  return POST('/api/admin/content/comment/check', model)
}
/**
 * 获取下一个需要审核的消息
 * @returns
 */
export function getNextUncheckMessageInfo() {
  return GET<CT_MessageInfo>('/api/admin/content/message/nextUncheck')
}
/**
 * 审核消息
 * @param model
 * @returns
 */
export function checkMessage(model: CheckMessageVM) {
  return POST('/api/admin/content/message/check', model)
}
/**
 * 获取下一个需要审核的去除背景
 * @returns
 */
export function getNextUncheckRemBgInfo() {
  return GET<RemoveBgInfoVM>('/api/admin/content/rembg/nextUncheck')
}
/**
 * 审核
 * @param model
 * @returns
 */
export function checkRemoveBgInfo(model: CheckRemoveBgInfoVM) {
  return POST('/api/admin/content/rembg/check', model)
}
/**
 * 获取下一个需要审核的去除背景
 * @returns
 */
export function getNextUncheckImageFixInfo() {
  return GET<ImageFixInfoVM>('/api/admin/content/imageFix/nextUncheck')
}
/**
 * 审核
 * @param model
 * @returns
 */
export function checkImageFixInfo(model: CheckImageFixInfoVM) {
  return POST('/api/admin/content/imageFix/check', model)
}

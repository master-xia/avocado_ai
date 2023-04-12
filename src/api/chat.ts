import { hideLoading } from '@utils/common'
import { DELETE, GET, POST, PUT } from './axios'
/**
 * 创建对话
 * @returns
 */
export async function createConversation(
  model: CreateConversationVM,
  hideLoading = false
) {
  return POST<string>('/api/chat/conversation', model, false, hideLoading)
}
/**
 * 获取对话信息
 * @param coversationId
 * @returns
 */
export function getConversationInfoVM(
  coversationId: string,
  hideLoading = true
) {
  return GET<ConversationInfoVM>(
    '/api/chat/conversation/' + coversationId,
    {},
    hideLoading
  )
}
/**
 * 获取对话状态
 * @param coversationId
 * @returns
 */
export function getConversationStatusVM(
  coversationId: string,
  hideLoading: boolean = false
) {
  return GET<ConversationStatusVM>(
    '/api/chat/conversation/status/' + coversationId,
    {},
    hideLoading
  )
}
/**
 * 获取对话信息
 * @returns
 */
export async function getLastConversationInfoVM() {
  return GET<ConversationInfoVM>('/api/chat/conversation/last', {}, true)
}
/**
 * 删除对话信息
 * @param coversationId
 * @returns
 */
export function deleteConversation(coversationId: string) {
  return DELETE('/api/chat/conversation/' + coversationId, {})
}
/**
 * 发送对话
 * @param model
 * @returns
 */
export function sendMessage(model: SendMessageVM, hideLoading = false) {
  return POST<MessageInfoVM>(
    '/api/chat/conversation/message',
    model,
    false,
    hideLoading
  )
}
/**
 * 获取所有类目信息
 * @returns
 */
export function getAllCategoryInfoVM(hideLoading = true) {
  return GET<CategoryInfoVM[]>('/api/chat/categoryList', {}, hideLoading)
}
/**
 * 发送请求
 * @param model
 * @param hideLoading
 * @returns
 */
export function doConversationAction(
  model: DoConversationActionVM,
  hideLoading = true
) {
  return POST('/api/chat/conversation/action', model, false, hideLoading)
}
/**
 * 标记浏览过
 * @param conversationId
 * @param hideLoading
 * @returns
 */
export function viewConversationAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/chat/conversation/view/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 点赞
 * @param conversationId
 * @param hideLoading
 * @returns
 */
export function likeConversationAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/chat/conversation/like/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 取消点赞
 * @param conversationId
 * @param hideLoading
 * @returns
 */
export function dislikeConversationAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/chat/conversation/dislike/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 收藏
 * @param conversationId
 * @param hideLoading
 * @returns
 */
export function favoriteConversationAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/chat/conversation/favorite/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 取消收藏
 * @param conversationId
 * @param hideLoading
 * @returns
 */
export function disfavoriteConversationAction(
  conversationId: string,
  hideLoading = true
) {
  return POST(
    '/api/chat/conversation/disfavorite/' + conversationId,
    {},
    false,
    hideLoading
  )
}
/**
 * 获取评论列表
 * @param query
 * @param isHideLoading
 * @returns
 */
export function getCommentBaseInfoVMList(
  query: CommentInfoQuery,
  isHideLoading = true
) {
  return GET<CommentBaseInfoVM[]>(
    '/api/chat/conversation/comment/list',
    query,
    isHideLoading
  )
}
/**
 * 获取评论列表
 * @param query
 * @param isHideLoading
 * @returns
 */
export function getMessageInfoVMList(
  query: MessageInfoQuery,
  isHideLoading = true
) {
  return GET<MessageInfoVM[]>(
    '/api/chat/conversation/message/list',
    query,
    isHideLoading
  )
}
/**
 * 发表评论
 * @param model
 * @param isHideLoading
 * @returns
 */
export function postComment(model: AddCommentVM, isHideLoading = false) {
  return POST('/api/chat/conversation/comment', model, false, isHideLoading)
}
/**
 * 删除评论
 * @param commentId
 * @returns
 */
export function deleteComment(commentId: string) {
  return DELETE('/api/chat/conversation/comment/' + commentId)
}
/**
 * 获取对话和话题列表
 * @param query
 * @param isHideLoading
 * @returns
 */
export function getConversationInfoVMList(
  query: ConversationQuery,
  isHideLoading = false
) {
  return GET<ConversationInfoVM[]>(
    '/api/chat/conversation/list',
    query,
    isHideLoading
  )
}
export function getPublicConversationInfoVMList(
  query: ConversationQuery,
  isHideLoading = false
) {
  return GET<ConversationInfoVM[]>('/api/chat/p/list', query, isHideLoading)
}
export function getConversationInfoVMPageListByActionTypes(
  query: ActionInfoQuery,
  isHideLoading = false
) {
  return GET<ConversationInfoVM[]>(
    '/api/chat/p/action/history',
    query,
    isHideLoading
  )
}
/**
 * 搜索话题
 * @param query
 * @param isHideLoading
 * @returns
 */
export function searchConversation(
  query: SearchConversationVM,
  isHideLoading = false
) {
  return POST<ConversationInfoVM[]>(
    '/api/chat/p/search',
    query,
    false,
    isHideLoading
  )
}

import { DELETE, GET, POST, PUT } from './axios'
/**
 * 创建订单
 * @returns
 */
export function createOrder(model: CreateOrderVM) {
  return POST<OrderInfoVM>('/api/order', model)
}
/**
 * 订单支付
 * @param model
 * @returns
 */
export function orderPaid(model: OrderPaidVM) {
  return POST('/api/order/pay', model)
}
/**
 * 取消订单
 * @param orderCode
 * @returns
 */
export function cancelOrder(orderCode: string) {
  return PUT('/api/order/cancel/' + orderCode)
}
/**
 * 获取用户未支付订单
 * @returns
 */
export function getLatestOrderInfoVM() {
  return GET<OrderInfoVM>('/api/order/unpaid')
}
/**
 * 获取订单列表
 * @param query
 * @param isHideLoading
 * @returns
 */
export function getOrderInfoList(
  query: OrderInfoPageQuery,
  isHideLoading = false
) {
  return GET<OI_OrderInfo[]>('/api/admin/order/list', query, isHideLoading)
}
/**
 * 审核订单
 * @param query
 * @returns
 */
export function checkOrder(query: CheckOrderVM) {
  return PUT('/api/admin/order/check', query)
}

import { checkOrder, getOrderInfoList } from '@api/order'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { OrderCountStatus } from '@components/order/OrderCountStatus'
import { OrderStatus } from '@components/order/OrderStatus'
import { combineTwoList, errorMsg, isWxEnv, successMsg } from '@utils/common'
import {
  Button,
  Dialog,
  Form,
  InfiniteScroll,
  List,
  Popup,
  Tabs,
  Tag,
} from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IQueryResult {
  dataList: OI_OrderInfo[]
  hasMore: boolean
}

export default function CheckOrder() {
  var navigate = useNavigate()
  var tabName = useParams()['tab']
  let [orderInfo, setOrderInfo] = useState<OI_OrderInfo>()
  let initQuery: any = {
    Page: 1,
    Limit: 20,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<OrderInfoPageQuery>(initQuery)
  function setQueryByTabName(key: string) {
    if (key === 'uncheck') {
      setQueryParams({
        ...initQuery,
        Status: 2,
        CountStatus: 1,
      })
    } else if (key === 'unpaid') {
      setQueryParams({
        ...initQuery,
        Status: 1,
      })
    } else if (key === 'canceled') {
      setQueryParams({
        ...initQuery,
        Status: 10,
      })
    }
    setQueryResult({ dataList: [], hasMore: true })
  }
  async function loadData() {
    let res = await getOrderInfoList(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(
          queryResult!.dataList!,
          res.Result!,
          'OrderCode'
        ),
        hasMore: res.Result!.length >= queryParams.Limit!,
      })
      let newQueryParams = { ...queryParams, Page: queryParams.Page! + 1 }
      setQueryParams(newQueryParams)
    } else {
      errorMsg(res.Message)
    }
  }
  useEffect(() => {
    if (!tabName) {
      navigate('/admin/order/list/uncheck', { replace: true })
      return
    }
    setQueryByTabName(tabName!)
  }, [tabName])
  function check(status: boolean) {
    Dialog.confirm({
      title: '提示',
      content: status ? '是否审核通过该订单？' : '是否审核失败该订单？',
      onConfirm: () => {
        checkOrder({
          Status: status,
          OrderCode: orderInfo!.OrderCode,
          Note: '',
        }).then((res) => {
          if (res.IsSuccess) {
            successMsg('审核成功')
            setQueryByTabName(tabName!)
            setOrderInfo(undefined)
          } else {
            errorMsg(res.Message)
          }
        })
      },
    })
  }
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="订单列表" />
        <Tabs
          activeKey={tabName}
          onChange={(key) => {
            navigate('/admin/order/list/' + key, { replace: true })
          }}
        >
          <Tabs.Tab title="待审核" key="uncheck"></Tabs.Tab>
          <Tabs.Tab title="未支付" key="unpaid"></Tabs.Tab>
          <Tabs.Tab title="已取消" key="canceled"></Tabs.Tab>
        </Tabs>
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 50px)`,
            overflow: 'auto',
          }}
        >
          <List>
            {queryResult.dataList.map((item) => (
              <List.Item
                onClick={() => {
                  setOrderInfo(item)
                }}
                key={item.OrderCode}
                title={item.UserName}
                description={
                  <Datetime type="datetime" datetime={item.CreateTime} />
                }
                extra={
                  <div>
                    <div>
                      <span
                        style={{
                          color: 'var(--adm-color-warning)',
                          fontSize: 20,
                        }}
                      >
                        {item.Amt.toFixed(2)}
                      </span>
                      <span
                        style={{
                          color: 'var(--adm-color-text)',
                          fontSize: 14,
                        }}
                      >
                        元
                      </span>
                    </div>
                  </div>
                }
                prefix={
                  <>
                    <div>
                      {item.Status === 2 ? (
                        <OrderCountStatus value={item.CountStatus} />
                      ) : (
                        <OrderStatus value={item.Status} />
                      )}
                    </div>
                  </>
                }
              ></List.Item>
            ))}
          </List>
          <InfiniteScroll loadMore={loadData} hasMore={queryResult.hasMore} />
        </div>
        <Popup
          visible={orderInfo !== undefined}
          onMaskClick={() => {
            setOrderInfo(undefined)
          }}
        >
          <div>
            <Form layout="horizontal">
              <Form.Header>订单详情</Form.Header>
              <Form.Item label="订单号">{orderInfo?.OrderCode}</Form.Item>
              <Form.Item label="订单状态">
                {' '}
                <div>
                  {orderInfo?.Status === 2 ? (
                    <OrderCountStatus value={orderInfo?.CountStatus} />
                  ) : (
                    <OrderStatus value={orderInfo?.Status} />
                  )}
                </div>
              </Form.Item>
              <Form.Item label="套餐类型">{orderInfo?.PackageName}</Form.Item>
              <Form.Item label="价格" extra="元">
                {orderInfo?.Amt.toFixed(2) + ' '}
              </Form.Item>
              <Form.Item label="次数" extra="次">
                {orderInfo?.Count + ' '}
              </Form.Item>
              <Form.Item label="下单时间">
                <Datetime datetime={orderInfo?.CreateTime} type="datetime" />
              </Form.Item>
              <Form.Item label="更新时间">
                <Datetime datetime={orderInfo?.UpdateTime} type="datetime" />
              </Form.Item>
              {orderInfo?.Status === 2 && (
                <>
                  <Form.Header>支付信息</Form.Header>
                  <Form.Item label="支付方式">
                    {orderInfo?.PayType === 1 ? '微信支付' : '支付宝支付'}
                  </Form.Item>
                  <Form.Item label="支付信息">{orderInfo?.PayInfo}</Form.Item>
                  <Form.Item label="支付时间">
                    <Datetime datetime={orderInfo?.PayTime} type="datetime" />
                  </Form.Item>
                </>
              )}
              {orderInfo?.Status === 2 && orderInfo.CountStatus === 1 && (
                <div style={{ padding: 10, display: 'flex' }}>
                  <Button
                    block
                    type="submit"
                    color="danger"
                    onClick={() => {
                      check(false)
                    }}
                  >
                    审核失败
                  </Button>
                  <Button
                    block
                    type="submit"
                    color="primary"
                    onClick={() => {
                      check(true)
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    审核通过
                  </Button>
                </div>
              )}
            </Form>
          </div>
        </Popup>
      </div>
    </>
  )
}

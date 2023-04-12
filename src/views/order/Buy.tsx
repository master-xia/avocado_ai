import { getOrderPackages } from '@api/cmmon'
import {
  cancelOrder,
  createOrder,
  getLatestOrderInfoVM,
  orderPaid,
} from '@api/order'
import Avocado from '@components/common/Avocado'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv, showLoading, successMsg } from '@utils/common'
import {
  Button,
  Dialog,
  Form,
  Grid,
  List,
  Popup,
  Selector,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useRef, useState } from 'react'

interface OrderPackage {
  Title: string
  Price: number
  Count: number
  WxPay?: string
  AliPay?: string
}
export default function Buy() {
  let [orderPackages, setOrderPackages] = useState<OrderPackage[]>([])
  let [selectOrderPackages, setSelectOrderPackages] = useState<OrderPackage>()
  let [orderInfo, setOrderInfo] = useState<OrderInfoVM>()
  let [payInfoVisible, setPayInfoVisible] = useState(false)
  let payFormRef = useRef<FormInstance>(null)
  useEffect(() => {
    getLatestOrderInfoVM().then((res) => {
      if (res.IsSuccess) {
        setOrderInfo(res.Result!)
      }
    })
    getOrderPackages().then((res) => {
      if (res.IsSuccess) {
        const tmp = res.Result!.map((item) => {
          let tmp = item[1].split('|')
          return {
            Title: item[0],
            Price: parseFloat(tmp[0]),
            Count: parseInt(tmp[1]),
            WxPay: tmp[2],
            AliPay: tmp[3],
          } as OrderPackage
        })
        setOrderPackages(tmp)
      } else {
        errorMsg(res.Message)
      }
    })
  }, [])
  function createOrderAndPay() {
    createOrder({
      PackageName: selectOrderPackages!.Title,
    }).then((res) => {
      if (res.IsSuccess) {
        setOrderInfo(res.Result)
        setSelectOrderPackages(undefined)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  function cancel() {
    Dialog.confirm({
      title: '提示',
      content: '是否取消订单？',
      onConfirm: () => {
        cancelOrder(orderInfo!.OrderCode).then((res) => {
          if (res.IsSuccess) {
            successMsg('取消订单成功')
            setOrderInfo(undefined)
          }
        })
      },
    })
  }
  function payOrder(values: any) {
    if (!values.PayInfo) {
      errorMsg('请填写支付平台的转账单号或者名称')
      return
    }
    Dialog.confirm({
      title: '提示',
      content: '是否提交订单支付信息？',
      onConfirm: () => {
        orderPaid({
          PayInfo: values.PayInfo,
          PayType: values.PayType[0],
          OrderCode: orderInfo!.OrderCode,
        }).then((res) => {
          if (res.IsSuccess) {
            successMsg('提交成功')
            setOrderInfo(undefined)
            setPayInfoVisible(false)
          } else {
            errorMsg(res.Message)
          }
        })
      },
    })
  }
  const wxPayEle = (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/Images/PayTypes/1.gif?x-oss-process=style/jmms"
        style={{
          height: 20,
          display: 'flex',
          alignSelf: 'center',
        }}
        alt=""
      />
      <span style={{ lineHeight: '20px', marginLeft: 5 }}>微信支付</span>
    </div>
  )
  const alipayEle = (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/Images/PayTypes/0.gif?x-oss-process=style/jmms"
        style={{
          height: 20,
          display: 'flex',
          alignSelf: 'center',
        }}
        alt=""
      />
      <span style={{ lineHeight: '20px', marginLeft: 5 }}>支付宝支付</span>
    </div>
  )
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="购买牛油果" />
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 50}px)`,
            overflow: 'auto',
          }}
        >
          <List header="请选择套餐">
            {orderPackages.map((item) => (
              <List.Item
                key={item.Title}
                title={item.Title}
                onClick={() => {
                  setSelectOrderPackages(item)
                }}
                description={
                  <>
                    <div style={{ fontSize: 12 }}>
                      单价 <span>{(item.Price / item.Count).toFixed(3)}</span>
                    </div>
                  </>
                }
                extra={
                  <>
                    <span
                      style={{
                        color: 'var(--adm-color-warning)',
                        fontSize: 20,
                      }}
                    >
                      {item.Price.toFixed(2) + ' '}
                    </span>
                    <span
                      style={{
                        color: 'var(--adm-color-text-secondary)',
                        fontSize: 16,
                      }}
                    >
                      元
                    </span>
                  </>
                }
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      color: 'var(--adm-color-text-secondary)',
                      fontSize: 20,
                    }}
                  >
                    {item.Count + ' '}
                  </span>
                  <Avocado />
                </div>
              </List.Item>
            ))}
          </List>
        </div>
        <Popup
          visible={selectOrderPackages !== undefined}
          onMaskClick={() => {
            setSelectOrderPackages(undefined)
          }}
        >
          <div>
            <Form>
              <Form.Header>套餐详情</Form.Header>
              <Form.Item label="套餐类型">
                {selectOrderPackages?.Title}
              </Form.Item>
              <Form.Item label="价格">
                <span
                  style={{
                    color: 'var(--adm-color-text)',
                    fontSize: 20,
                  }}
                >
                  {selectOrderPackages?.Price.toFixed(2) + ' '}
                </span>
                <span
                  style={{
                    color: 'var(--adm-color-text-secondary)',
                    fontSize: 16,
                  }}
                >
                  元
                </span>
              </Form.Item>
              <Form.Item label="数量">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      color: 'var(--adm-color-text)',
                      fontSize: 20,
                    }}
                  >
                    {selectOrderPackages?.Count + ' '}
                  </span>
                  <Avocado />
                </div>
              </Form.Item>
              <div
                style={{
                  color: 'var(--adm-color-text-secondary)',
                  fontSize: 14,
                  textAlign: 'right',
                }}
              ></div>
              <div style={{ padding: 10 }}>
                <Button
                  block
                  type="submit"
                  color="primary"
                  onClick={createOrderAndPay}
                >
                  立即下单
                </Button>
              </div>
            </Form>
          </div>
        </Popup>

        <Popup visible={orderInfo !== undefined} onMaskClick={() => {}}>
          <div>
            <Form layout="horizontal">
              <Form.Header>订单详情</Form.Header>
              <Form.Item label="订单号">{orderInfo?.OrderCode}</Form.Item>
              <Form.Item label="套餐类型">{orderInfo?.PackageName}</Form.Item>
              <Form.Item label="价格" extra="元">
                {orderInfo?.Amt.toFixed(2) + ' '}
              </Form.Item>
              <Form.Item
                label="数量"
                extra={
                  <>
                    <Avocado />
                  </>
                }
              >
                {orderInfo?.Count + ' '}
              </Form.Item>
              <Form.Item label="下单时间">
                <Datetime datetime={orderInfo?.CreateTime} type="datetime" />
              </Form.Item>
              <div style={{ padding: '0 15px' }}>
                <Grid columns={2} gap={15}>
                  <Grid.Item>
                    <div style={{ textAlign: 'center' }}>{wxPayEle}</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={
                          'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/recMoney/wx' +
                          orderInfo?.Amt +
                          '.jpeg?x-oss-process=style/jmms'
                        }
                        style={{ width: 150, height: 150 }}
                        alt="微信收款"
                      />
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <div style={{ textAlign: 'center' }}>{alipayEle}</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={
                          'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/recMoney/zfb' +
                          orderInfo?.Amt +
                          '.jpeg?x-oss-process=style/jmms'
                        }
                        style={{ width: 150, height: 150 }}
                        alt="支付宝收款"
                      />
                    </div>
                  </Grid.Item>
                </Grid>
                <div
                  style={{
                    color: 'var(--adm-color-text-secondary)',
                    fontSize: 14,
                  }}
                >
                  <div>1.长按二维码保存</div>
                  <div>2.支付完成后返回该页面</div>
                </div>
              </div>

              <div style={{ padding: 10, display: 'flex' }}>
                <Button block type="submit" color="danger" onClick={cancel}>
                  取消订单
                </Button>
                <Button
                  block
                  type="submit"
                  color="primary"
                  onClick={() => {
                    setPayInfoVisible(true)
                    payFormRef.current?.resetFields()
                  }}
                  style={{ marginLeft: 10 }}
                >
                  我已支付
                </Button>
              </div>
            </Form>
          </div>
        </Popup>

        <Popup
          visible={payInfoVisible}
          onMaskClick={() => {
            setPayInfoVisible(false)
          }}
        >
          <div>
            <Form ref={payFormRef} onFinish={payOrder}>
              <Form.Header>提交虚假订单支付信息，可能会被封号哦！</Form.Header>
              <Form.Item name="PayType" label="支付类型" initialValue={[1]}>
                <Selector
                  columns={2}
                  options={[
                    {
                      label: wxPayEle,
                      value: 1,
                    },
                    {
                      label: alipayEle,
                      value: 2,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="PayInfo" label="转账单号/名称">
                <TextArea
                  maxLength={200}
                  rows={2}
                  showCount
                  placeholder="请输入支付平台的转账单号或者名称"
                ></TextArea>
              </Form.Item>

              <div
                style={{
                  color: 'var(--adm-color-text-secondary)',
                  fontSize: 14,
                  textAlign: 'right',
                }}
              ></div>
              <div style={{ padding: 10 }}>
                <Button block type="submit" color="primary">
                  提交支付信息
                </Button>
              </div>
            </Form>
          </div>
        </Popup>
      </div>
    </>
  )
}

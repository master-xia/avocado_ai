interface OrderInfoVM {
  UserName: string
  OrderCode: string
  PackageName: string
  Amt: number
  Count: number
  Status: number
  CountStatus: number
  PayType?: number
  PayInfo?: string
  Note?: string
  CreateTime: Date
  PayTime?: Date
}
interface OI_OrderInfo extends BaseModel {
  UserName: string
  OrderCode: string
  PackageName: string
  Amt: number
  Count: number
  Status: number
  CountStatus: number
  PayType?: number
  PayInfo?: string
  Note?: string
  PayTime?: Date
}

import { Empty } from 'antd-mobile'

export default function NoData() {
  return (
    <Empty
      description="暂无数据"
      style={{ height: 'calc(80%)' }}
      imageStyle={{ width: 128 }}
    />
  )
}

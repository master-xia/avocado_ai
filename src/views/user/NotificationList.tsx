import { getNotificationList, readNotification } from '@api/user'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { combineTwoList, errorMsg, isWxEnv } from '@utils/common'
import {
  Button,
  Ellipsis,
  ErrorBlock,
  InfiniteScroll,
  List,
  Tabs,
  Tag,
} from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IQueryResult {
  dataList: NotificationInfoVM[]
  hasMore: boolean
}

export default function NotificationList() {
  var navigate = useNavigate()
  var tabName = useParams()['tabName']
  let initQuery: any = {
    Page: 1,
    Limit: 20,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<NotificationQuery>(initQuery)
  function setQueryByTabName(key: string) {
    if (key === 'all') {
      setQueryParams({
        ...initQuery,
      })
    } else if (key === 'unread') {
      setQueryParams({
        ...initQuery,
        IsRead: false,
      })
    }
    setQueryResult({ dataList: [], hasMore: true })
  }
  async function loadData() {
    let res = await getNotificationList(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(
          queryResult!.dataList!,
          res.Result!,
          'NotificationId'
        ),
        hasMore: res.Result!.length >= queryParams.Limit!,
      })
      let newQueryParams = { ...queryParams, Page: queryParams.Page! + 1 }
      setQueryParams(newQueryParams)
    } else {
      errorMsg(res.Message)
      throw new Error()
    }
  }
  useEffect(() => {
    if (!tabName) {
      navigate('/user/notification/list/unread', { replace: true })
      return
    }
    setQueryByTabName(tabName!)
  }, [tabName])
  function getSourceTypeText(sourceType: number) {
    if (sourceType >= 1 && sourceType <= 10) {
      return '对话提醒'
    }
    if (sourceType >= 20 && sourceType <= 30) {
      return '订单提醒'
    }
    if (sourceType >= 61 && sourceType <= 80) {
      return '话题提醒'
    }
    if (sourceType === 41) {
      return '登录提醒'
    }
    return '通用提醒'
  }
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="消息列表" />
        <Tabs
          activeKey={tabName}
          onChange={(key) => {
            navigate('/user/notification/list/' + key, { replace: true })
          }}
        >
          <Tabs.Tab title="全部" key="all"></Tabs.Tab>
          <Tabs.Tab title="未读" key="unread"></Tabs.Tab>
        </Tabs>
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 50px)`,
            overflow: 'auto',
          }}
        >
          <List>
            {queryResult.dataList.map((item, index) => (
              <List.Item
                key={item.Id}
                title={
                  <>
                    <div style={{ display: 'flex' }}>
                      <Tag color="danger">
                        {getSourceTypeText(item.SourceType)}
                      </Tag>
                      <Datetime
                        style={{ marginLeft: 'auto' }}
                        type="datetime"
                        datetime={item.CreateTime}
                      />
                    </div>
                    <div style={{ color: 'var(--adm-color-text)' }}>
                      {item.Title}
                    </div>
                  </>
                }
                description={
                  <>
                    <div>
                      <div
                        style={{ color: '#999' }}
                        dangerouslySetInnerHTML={{ __html: item.Content }}
                      ></div>
                    </div>
                    {!item.IsRead && (
                      <div style={{ display: 'flex' }}>
                        <Button
                          style={{ marginLeft: 'auto' }}
                          size="mini"
                          onClick={() => {
                            readNotification(item.NotificationId).then(
                              (res) => {
                                if (res.IsSuccess) {
                                  if (tabName === 'unread') {
                                    queryResult.dataList.splice(index, 1)
                                    setQueryResult({
                                      hasMore: queryResult.hasMore,
                                      dataList: [...queryResult.dataList],
                                    })
                                  }
                                } else {
                                  errorMsg(res.Message)
                                }
                              }
                            )
                          }}
                        >
                          已读
                        </Button>
                      </div>
                    )}
                  </>
                }
                prefix={<></>}
              ></List.Item>
            ))}
          </List>
          {!queryResult.hasMore && queryResult.dataList.length == 0 && (
            <ErrorBlock
              image={
                'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noNotification.png'
              }
              style={{
                '--image-height': '150px',
                marginTop: 50,
              }}
              title="这里什么都没有"
              description={''}
            />
          )}
          {(queryResult.hasMore || queryResult.dataList.length > 0) && (
            <InfiniteScroll loadMore={loadData} hasMore={queryResult.hasMore} />
          )}
          <style>
            {`
            .n_outer_con{
              display:flex;
            }
              .n_label{
                min-width:70px;
                text-align:left;
              }
              .n_value{
                color:#666;
              }
              `}
          </style>
        </div>
      </div>
    </>
  )
}

import { deleteConversation, getConversationInfoVMList } from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { getPageCache, setPageCache } from '@utils/cache'
import {
  combineTwoList,
  errorMsg,
  formatDate,
  isWxEnv,
  successMsg,
} from '@utils/common'
import {
  Button,
  Dialog,
  Divider,
  Ellipsis,
  Form,
  Grid,
  InfiniteScroll,
  Input,
  List,
  Tabs,
  Tag,
  TextArea,
} from 'antd-mobile'
import { FormInstance } from 'antd-mobile/es/components/form'
import { GridItem } from 'antd-mobile/es/components/grid/grid'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IQueryResult {
  dataList: ConversationInfoVM[]
  hasMore: boolean
}
export default function CheckOrder() {
  var navigate = useNavigate()
  var tabName = useParams()['tab']
  let conRef = useRef<HTMLDivElement>(null)
  let initQuery: any = {
    Page: 1,
    Limit: 20,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<ConversationQuery>(initQuery)
  function setQueryByTabName(key: string) {
    if (key === 'all') {
      setQueryParams({
        ...initQuery,
        ConversationType: null,
      })
    } else if (key === 'chat') {
      setQueryParams({
        ...initQuery,
        ConversationType: 1,
      })
    } else if (key === 'public') {
      setQueryParams({
        ...initQuery,
        ConversationType: 2,
      })
    }
    setQueryResult({ dataList: [], hasMore: true })
  }
  function delConversation(conversationId: string, index: number) {
    Dialog.confirm({
      title: '提示',
      content: '是否确认删除？',
      onConfirm: () => {
        deleteConversation(conversationId).then((res) => {
          if (res.IsSuccess) {
            successMsg('删除成功')
            queryResult.dataList[index].Status = 1
            setQueryResult({
              ...queryResult,
              dataList: queryResult.dataList,
            })
          } else {
            errorMsg(res.Message)
          }
        })
      },
    })
  }
  function goToDetailPage(conversationInfo: ConversationInfoVM) {
    // setPageCache({
    //   queryParams,
    //   queryResult,
    //   scrollTop: conRef.current?.scrollTop,
    // })
    let id =
      !conversationInfo.ShortCode || conversationInfo.ShortCode === ''
        ? conversationInfo.ConversationId
        : conversationInfo.ShortCode
    if (conversationInfo.ConversationType === 1) {
      navigate('/chat/' + id)
    } else {
      navigate('/p/' + id)
    }
  }
  async function loadData() {
    let res = await getConversationInfoVMList(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(
          queryResult!.dataList!,
          res.Result!,
          'ConversationId'
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
      navigate('/chat/list/public', { replace: true })
      return
    }
    let pageData = getPageCache()
    if (pageData) {
      setQueryParams(pageData.queryParams)
      setQueryResult(pageData.queryResult)
      window.setTimeout(() => {
        conRef.current!.scrollTop = pageData.scrollTop
      }, 50)
      return
    }
    setQueryByTabName(tabName!)
  }, [tabName])

  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader title="话题&对话列表" />
        <Tabs
          activeKey={tabName}
          onChange={(key) => {
            navigate('/chat/list/' + key, { replace: true })
          }}
        >
          {/* <Tabs.Tab title="全部" key="all"></Tabs.Tab> */}
          <Tabs.Tab title="我的话题" key="public"></Tabs.Tab>
          <Tabs.Tab title="对话记录" key="chat"></Tabs.Tab>
        </Tabs>
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 50px)`,
            overflow: 'auto',
          }}
          ref={conRef}
        >
          {queryResult.dataList.map((m, index) => (
            <div
              style={{ borderBottom: '1px solid #eee' }}
              key={m.ConversationId}
              onClick={() => {
                goToDetailPage(m)
              }}
            >
              <div style={{ padding: 10 }}>
                <div>
                  <div style={{ fontSize: 14 }}>
                    <Ellipsis rows={2} content={m.Title} />
                  </div>
                </div>
                {m.ConversationType === 1 && (
                  <div
                    style={{ margin: '5px 0', marginTop: 3, display: 'flex' }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#999',
                        textAlign: 'right',
                        marginLeft: 'auto',
                      }}
                    >
                      <span>发布于</span>
                      {
                        <Datetime
                          type="datetime"
                          datetime={m.CreateTime}
                          format="yyyy-MM-dd hh:mm"
                        />
                      }
                    </div>
                  </div>
                )}
                {m.ConversationType === 2 && (
                  <>
                    <div
                      style={{ margin: '5px 0', marginTop: 3, display: 'flex' }}
                    >
                      <Tag color="primary">{m.CategoryName}</Tag>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#999',
                          textAlign: 'right',
                          marginLeft: 'auto',
                        }}
                      >
                        <span>发布于</span>
                        <Datetime
                          type="datetime"
                          datetime={m.CreateTime}
                          format="yyyy-MM-dd hh:mm"
                        />
                        <span> | </span>
                        <span>{m.City}</span>
                      </div>
                    </div>
                    <div>
                      <Grid columns={4} style={{ textAlign: 'left' }}>
                        <Grid.Item>
                          <span style={{ color: '#999' }}>
                            <span>点赞 </span>
                            <span>{m.Likes}</span>
                          </span>
                        </Grid.Item>
                        <Grid.Item>
                          <span style={{ color: '#999' }}>
                            <span>收藏 </span>
                            <span>{m.Favorites}</span>
                          </span>
                        </Grid.Item>
                        <Grid.Item>
                          <span style={{ color: '#999' }}>
                            <span>评论 </span>
                            <span>{m.Comments}</span>
                          </span>
                        </Grid.Item>
                        <Grid.Item>
                          <span style={{ color: '#999' }}>
                            <span>浏览 </span>
                            <span>{m.Views}</span>
                          </span>
                        </Grid.Item>
                      </Grid>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <InfiniteScroll loadMore={loadData} hasMore={queryResult.hasMore} />
        </div>
      </div>
    </>
  )
}

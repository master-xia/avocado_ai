import {
  createConversation,
  deleteConversation,
  getConversationInfoVMList,
} from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { CheckStatus } from '@components/conversation/CheckStatus'
import { getPageCache, setPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, formatDate, isWxEnv, successMsg } from '@utils/common'
import {
  Button,
  Dialog,
  Ellipsis,
  ErrorBlock,
  Form,
  Grid,
  InfiniteScroll,
  Input,
  PullToRefresh,
  Tabs,
  Tag,
  TextArea,
} from 'antd-mobile'
import { AddOutline } from 'antd-mobile-icons'
import { FormInstance } from 'antd-mobile/es/components/form'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IQueryResult {
  dataList: ConversationInfoVM[]
  hasMore: boolean
}
export default function CheckOrder() {
  var navigate = useNavigate()
  let conRef = useRef<HTMLDivElement>(null)
  let initQuery: any = {
    Page: 1,
    Limit: 20,
    ConversationType: 2,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<ConversationQuery>(initQuery)

  function goToDetailPage(conversationInfo: ConversationInfoVM) {
    let id =
      !conversationInfo.ShortCode || conversationInfo.ShortCode === ''
        ? conversationInfo.ConversationId
        : conversationInfo.ShortCode
    navigate('/p/' + id)
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
    }
  }
  useEffect(() => {
    let pageData = getPageCache()
    if (pageData) {
      setQueryParams(pageData.queryParams)
      setQueryResult(pageData.queryResult)
      window.setTimeout(() => {
        conRef.current!.scrollTop = pageData.scrollTop
      }, 50)
      return
    }
    refresh()
  }, [])

  async function refresh() {
    setQueryParams({
      ...initQuery,
    })
    setQueryResult({ dataList: [], hasMore: true })
  }
  return (
    <>
      <div style={{ height: '100vh', backgroundColor: 'white' }}>
        <PageHeader
          title="我的话题"
          right={
            <>
              <span
                onClick={() => {
                  navigate('/p/create')
                }}
              >
                发布话题
              </span>
            </>
          }
        />
        <PullToRefresh onRefresh={refresh}>
          <div
            style={{
              height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
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
                    <div style={{ textAlign: 'right' }}>
                      <CheckStatus CheckStatus={m.CheckStatus} />
                    </div>
                  </div>
                  <div
                    style={{
                      margin: '5px 0',
                      marginTop: 3,
                      display: 'flex',
                    }}
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
                    <Grid columns={5} style={{ textAlign: 'left' }}>
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
                      <Grid.Item>
                        <span style={{ color: '#999' }}>
                          <span>提问 </span>
                          <span>{m.MessageCount}</span>
                        </span>
                      </Grid.Item>
                    </Grid>
                  </div>
                </div>
              </div>
            ))}
            {(queryResult.hasMore || queryResult.dataList.length > 0) && (
              <>
                <InfiniteScroll
                  loadMore={loadData}
                  hasMore={queryResult.hasMore}
                />
              </>
            )}
            {!queryResult.hasMore && queryResult.dataList.length === 0 && (
              <>
                <ErrorBlock
                  image={
                    'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noMessage.png'
                  }
                  style={{
                    '--image-height': '150px',
                    marginTop: 40,
                  }}
                  title="暂时没有任何记录"
                  description={
                    <>
                      <Button
                        size="mini"
                        color="primary"
                        onClick={() => {
                          navigate('/p/create')
                        }}
                      >
                        发布第一个话题
                      </Button>
                    </>
                  }
                />
              </>
            )}
          </div>
        </PullToRefresh>
      </div>
    </>
  )
}

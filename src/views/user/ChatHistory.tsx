import { getConversationInfoVMList } from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { getPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, isWxEnv } from '@utils/common'
import {
  Button,
  Ellipsis,
  ErrorBlock,
  InfiniteScroll,
  PullToRefresh,
  Tag,
} from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    ConversationType: 1,
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
    navigate('/chat/' + id)
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

  function newChat() {
    navigate('/chat/create')
  }
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
          title="对话历史"
          right={
            <>
              <span
                onClick={() => {
                  newChat()
                }}
              >
                新的对话
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
                  </div>
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
                  <div
                    style={{
                      fontSize: 12,
                      color: '#999',
                      textAlign: 'right',
                      marginLeft: 'auto',
                    }}
                  >
                    {m.Status === 2 && (
                      <Tag style={{ marginRight: 5 }} color="danger">
                        问题处于回答队列中
                      </Tag>
                    )}
                    {m.Status === 3 && (
                      <Tag style={{ marginRight: 5 }} color="danger">
                        ChatGPT思考问题中
                      </Tag>
                    )}
                    剩余{Math.floor(m.RemainTokenCount / 2)}字数
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
                          newChat()
                        }}
                      >
                        立刻开启对话
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

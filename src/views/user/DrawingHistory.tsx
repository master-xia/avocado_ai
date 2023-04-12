import { getConversationInfoVMList } from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { CheckStatus } from '@components/conversation/CheckStatus'
import { ConversationImages } from '@components/conversation/ConversationImages'
import { getPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, isWxEnv } from '@utils/common'
import {
  Button,
  Ellipsis,
  ErrorBlock,
  Grid,
  InfiniteScroll,
  Loading,
  PullToRefresh,
  Tag,
} from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
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
    ConversationType: 3,
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
          title="Ai绘图记录"
          right={
            <>
              <span
                onClick={() => {
                  navigate('/drawing/create')
                }}
              >
                新的绘画
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
              <Item
                key={m.ConversationId}
                converstaionInfo={m}
                onItemClick={() => {
                  goToDetailPage(m)
                }}
              />
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
                          navigate('/drawing/create')
                        }}
                      >
                        创建第一个作品
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
interface IItem {
  converstaionInfo: ConversationInfoVM
  onItemClick: () => void
}
function Item(props: IItem) {
  let m = props.converstaionInfo
  var tags = useMemo(() => {
    let tagList: string[] = []
    if (m.RoleDescription && m.ConversationType === 3) {
      var tmp = m.RoleDescription.split('|')
      tmp.forEach((item) => {
        if (item && item.length > 0) {
          tagList.push(item)
        }
      })
    }
    return tagList
  }, [m])
  return (
    <div
      style={{ borderBottom: '1px solid #eee' }}
      key={m.ConversationId}
      onClick={() => {
        props.onItemClick()
      }}
    >
      <div style={{ padding: 10 }}>
        <div>
          <div style={{ fontSize: 14 }}>
            <Ellipsis rows={2} content={m.Title} />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          <span>
            {tags.map((item) => (
              <Tag
                key={item}
                color={'primary'}
                fill="outline"
                style={{ marginRight: 5, marginBottom: 5 }}
              >
                {item}
              </Tag>
            ))}
          </span>
        </div>
        <div
          style={{
            margin: '5px 0',
            marginTop: 0,
            display: 'flex',
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <CheckStatus CheckStatus={m.CheckStatus} />
          </div>
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
          <ConversationImages Images={m.Images} />
          {m.Status !== 4 && (
            <div>
              <div>
                <ErrorBlock
                  style={{
                    '--image-height': '20px',
                  }}
                  image={
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '50px',
                        }}
                      >
                        {m.Status !== 5 && <Loading></Loading>}
                      </div>
                    </>
                  }
                  title={(() => {
                    if (m.Status === 1) {
                      return '无操作'
                    } else if (m.Status === 2) {
                      return (
                        <>
                          <span>AI马上开始绘制</span>
                        </>
                      )
                    } else if (m.Status === 3) {
                      return (
                        <>
                          <span>AI正在绘制</span>
                        </>
                      )
                    } else if (m.Status === 4) {
                      return '绘制成功'
                    } else if (m.Status === 5) {
                      return '当前人数过多，Ai绘图失败。'
                    }
                    return ''
                  })()}
                  description={<></>}
                />
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
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
      </div>
    </div>
  )
}

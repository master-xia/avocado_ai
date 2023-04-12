import { getOwnershipList } from '@api/user'
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
  dataList: OwnershipInfoVM[]
  hasMore: boolean
}
export default function OwnershipList() {
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
  let [queryParams, setQueryParams] = useState<OwnershipQuery>(initQuery)

  function goToDetailPage(ownership: OwnershipInfoVM) {
    if (ownership.SourceType === 1) {
      navigate('/drawing/picture/' + ownership.SourceCode)
    }
  }

  async function loadData() {
    let res = await getOwnershipList(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(
          queryResult!.dataList!,
          res.Result!,
          'OwnershipId'
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
        <PageHeader title="授权记录" />
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
                key={m.OwnershipId}
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
                    'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noOrder.png'
                  }
                  style={{
                    '--image-height': '150px',
                    marginTop: 40,
                  }}
                  description=""
                  title="暂时没有授权记录"
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
  converstaionInfo: OwnershipInfoVM
  onItemClick: () => void
}
function Item(props: IItem) {
  let m = props.converstaionInfo

  return (
    <div
      style={{ borderBottom: '1px solid #eee' }}
      key={m.OwnershipId}
      onClick={() => {
        props.onItemClick()
      }}
    >
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex' }}>
          <div>
            <img
              alt=""
              src={m.Image + '?x-oss-process=style/img_thumb_square'}
              style={{ height: 50, width: 50 }}
            />
          </div>
          <div style={{ fontSize: 14, marginLeft: 10 }}>
            <Ellipsis rows={2} content={m.Title} />
          </div>
        </div>
        <div
          style={{
            margin: '5px 0',
            marginTop: 3,
            display: 'flex',
          }}
        >
          {m.SourceType === 1 && <Tag color="primary">Ai绘图</Tag>}
          <div
            style={{
              fontSize: 12,
              color: '#999',
              textAlign: 'right',
              marginLeft: 'auto',
            }}
          >
            <span>授权于</span>
            <Datetime
              type="datetime"
              datetime={m.OwnershipTime}
              format="yyyy-MM-dd hh:mm"
            />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

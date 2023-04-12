import {
  deleteConversation,
  getConversationInfoVMPageListByActionTypes,
} from '@api/chat'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { ConversationItem } from '@components/conversation/ConversationItem'
import { getPageCache, setPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, isWxEnv, successMsg } from '@utils/common'
import {
  Button,
  Ellipsis,
  ErrorBlock,
  Grid,
  InfiniteScroll,
  List,
  Tag,
} from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface IQueryResult {
  dataList: ConversationInfoVM[]
  hasMore: boolean
}
export default function CheckOrder() {
  var navigate = useNavigate()
  var tabName = useParams()['tab']
  var [title, setTitle] = useState('')
  let conRef = useRef<HTMLDivElement>(null)
  let initQuery: any = {
    Page: 1,
    Limit: 20,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<ActionInfoQuery>(initQuery)
  function setQueryByTabName(key: string) {
    if (key === 'likes') {
      setQueryParams({
        ...initQuery,
        ActionTypesStr: '0',
      })
      setTitle('点赞的话题')
    } else if (key === 'favorites') {
      setQueryParams({
        ...initQuery,
        ActionTypesStr: '2',
      })
      setTitle('收藏的话题')
    } else if (key === 'messages') {
      setQueryParams({
        ...initQuery,
        ActionTypesStr: '3,5',
      })
      setTitle('评论过&提问过的话题')
    }
    setQueryResult({ dataList: [], hasMore: true })
  }
  function goToDetailPage(conversationInfo: ConversationInfoVM) {
    setPageCache({
      queryParams,
      queryResult,
      scrollTop: conRef.current?.scrollTop,
      title: title,
    })
    if (conversationInfo.ConversationType === 1) {
      navigate(
        '/chat/' + conversationInfo.ShortCode ?? conversationInfo.ConversationId
      )
    } else {
      navigate(
        '/p/' + conversationInfo.ShortCode ?? conversationInfo.ConversationId
      )
    }
  }
  async function loadData() {
    let res = await getConversationInfoVMPageListByActionTypes(
      queryParams!,
      true
    )
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList<ConversationInfoVM>(
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
      navigate('/p/actions/history/likes', { replace: true })
      return
    }
    let pageData = getPageCache()
    if (pageData) {
      setQueryParams(pageData.queryParams)
      setQueryResult(pageData.queryResult)
      setTitle(pageData.title)
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
        <PageHeader title={title} />
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px)`,
            overflow: 'auto',
          }}
          ref={conRef}
        >
          <List>
            {queryResult.dataList.map((m, index) => (
              <ConversationItem
                key={m.ConversationId}
                item={m}
                onClick={() => {
                  goToDetailPage(m)
                }}
              />
            ))}
          </List>
          {!queryResult.hasMore && queryResult.dataList.length === 0 && (
            <>
              <ErrorBlock
                image={
                  'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noFavorite.png'
                }
                style={{
                  '--image-height': '150px',
                  marginTop: 50,
                }}
                title="这里什么都没有"
                description=""
              />
            </>
          )}
          {(queryResult.hasMore || queryResult.dataList.length > 0) && (
            <InfiniteScroll loadMore={loadData} hasMore={queryResult.hasMore} />
          )}
        </div>
      </div>
    </>
  )
}

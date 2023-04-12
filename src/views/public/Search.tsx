import { searchConversation } from '@api/chat'
import { PageHeader } from '@components/common/PageHeader'
import { ConversationItem } from '@components/conversation/ConversationItem'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateCategoryListVMAsync } from '@store/modules/converstaion'
import { getPageCache, setPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, getQueryString } from '@utils/common'
import {
  ErrorBlock,
  InfiniteScroll,
  List,
  PullToRefresh,
  SearchBar,
} from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

interface IPublicIndexPageData {
  query: SearchConversationVM
  hasMore?: boolean
  conversations: ConversationInfoVM[]
}

export default function Index() {
  const categoryList = useAppSelector((m) => m.chat.categoryList)
  const categoryId = useParams()['categoryId']
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [searchId, setSearchId] = useState('')
  const categoryInfo = useMemo(() => {
    if (categoryId && categoryList) {
      return categoryList.filter((m) => m.CategoryId === categoryId)[0]
    }
    return undefined
  }, [categoryId, categoryList])
  const questionStr = useMemo(() => {
    return decodeURI(getQueryString('q') ?? '')
  }, [location])
  //这个参数给搜索框用的
  const [tmpQuestionStr, setTmpQuestionStr] = useState(questionStr ?? '')
  const initPageData: IPublicIndexPageData = {
    query: {
      Page: 1,
      Limit: 10,
      Question: questionStr,
      CategoryId: categoryId ?? '',
    },
    hasMore: false,
    conversations: [],
  }
  const conRef = useRef<HTMLDivElement>(null)
  const [pageData, setPageData] = useState<IPublicIndexPageData>(initPageData)
  const navigate = useNavigate()
  useEffect(() => {
    if (categoryList === undefined && categoryId) {
      dispatch(updateCategoryListVMAsync())
    }
  }, [])
  useEffect(() => {
    let tmp = getPageCache()
    if (tmp) {
      setPageData(tmp)
      window.setTimeout(() => {
        conRef.current!.scrollTop = tmp.scrollTop
      }, 50)
    } else if (questionStr) {
      setPageData({ ...initPageData, hasMore: true })
    }
  }, [questionStr])
  async function loadData() {
    let res = await searchConversation(
      {
        ...pageData.query,
        SearchId: searchId,
      },
      true
    )
    if (res.IsSuccess) {
      setSearchId(res.Data.SearchId)
      setPageData({
        ...pageData,
        hasMore: res.Result!.length >= pageData.query.Limit!,
        conversations: combineTwoList(
          pageData!.conversations!,
          res.Result!,
          'ConversationId'
        ),
        query: {
          ...pageData.query,
          Page: pageData.query.Page! + 1,
        },
      })
    } else {
      errorMsg(res.Message)
      throw new Error()
    }
  }

  function goToDetailPage(item: ConversationInfoVM) {
    cacheAllPageData()
    navigate('/p/' + item.ShortCode)
  }
  function cacheAllPageData() {
    setPageCache({
      ...pageData,
      scrollTop: conRef.current?.scrollTop,
    })
  }
  async function refresh() {
    setPageData({
      ...initPageData,
      hasMore: true,
    })
  }
  function search(q: string) {
    setSearchId('')
    if (q === questionStr) {
      setPageData({ ...initPageData, hasMore: true })
    } else {
      setPageData({
        ...initPageData,
      })
      if (categoryId) {
        navigate('/p/search/' + categoryId + '?q=' + encodeURI(q), {
          replace: true,
        })
      } else {
        navigate('/p/search?q=' + encodeURI(q), { replace: true })
      }
    }
  }
  return (
    <>
      <div style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 60,
            color: 'var(--adm-color-text)',
          }}
          onClick={() => {
            navigate(-1)
          }}
        >
          <LeftOutline style={{ fontSize: 24 }} />
          <span style={{ lineHeight: '32px', fontSize: 15 }}>返回</span>
        </div>
        <SearchBar
          value={tmpQuestionStr}
          onChange={(val) => {
            setTmpQuestionStr(val)
          }}
          onClear={() => {}}
          onCancel={() => {
            search('')
          }}
          placeholder={
            categoryInfo
              ? `搜索${categoryInfo.CategoryName}板块`
              : '搜索所有板块'
          }
          style={{ '--background': '#ffffff', marginLeft: 8, width: '100%' }}
          onSearch={(val) => {
            if (!val || val.trim().length === 0) {
              search('')
              errorMsg('搜索内容不能为空')
            } else if (val.length > 500) {
              errorMsg('搜索内容不能超过500字')
            } else {
              search(val)
            }
          }}
        />
      </div>
      <div
        style={{ height: 'calc(100% - 60px)', overflow: 'auto' }}
        ref={conRef}
      >
        {!questionStr && (
          <div style={{ marginTop: 60 }}>
            <ErrorBlock
              style={{ '--image-height': '50px' }}
              image={
                'https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/chatgpt.png?x-oss-process=style/jmms'
              }
              title="你想要的我全都有"
              description="搜索算法基于ChatGPT进行检索"
            />
          </div>
        )}
        {questionStr && (
          <PullToRefresh onRefresh={refresh}>
            <div style={{ padding: 7, paddingTop: 0 }}>
              <div>
                <List>
                  {pageData.conversations.map((m) => (
                    <ConversationItem
                      key={m.ConversationId}
                      item={m}
                      onClick={() => {
                        goToDetailPage(m)
                      }}
                    />
                  ))}
                </List>
              </div>
              {!pageData.hasMore && pageData.conversations.length === 0 && (
                <ErrorBlock
                  status="empty"
                  image={
                    'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/noSearchResult.png'
                  }
                  style={{ marginTop: 40, '--image-height': '150px' }}
                />
              )}
              {(pageData.hasMore || pageData.conversations.length > 0) && (
                <InfiniteScroll
                  loadMore={loadData}
                  hasMore={pageData.hasMore ?? false}
                />
              )}
            </div>
          </PullToRefresh>
        )}
      </div>
    </>
  )
}

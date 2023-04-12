import { getPublicConversationInfoVMList } from '@api/chat'
import { PageHeader } from '@components/common/PageHeader'
import { ConversationItem } from '@components/conversation/ConversationItem'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateCategoryListVMAsync } from '@store/modules/converstaion'
import { getPageCache, setPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, formatDate2, isWxEnv } from '@utils/common'
import {
  Avatar,
  Button,
  Ellipsis,
  ErrorBlock,
  Grid,
  InfiniteScroll,
  List,
  PullToRefresh,
  SearchBar,
  Tabs,
  Tag,
} from 'antd-mobile'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

interface IPublicIndexPageData {
  activeTabKey: string
  newestQuery: ConversationQuery
  hasMoreNewest?: boolean
  newestConversations: ConversationInfoVM[]
  hotestQuery: ConversationQuery
  hasMoreHotest?: boolean
  hotestConversations: ConversationInfoVM[]
}

export default function Index() {
  const categoryList = useAppSelector((m) => m.chat.categoryList)
  const dispatch = useAppDispatch()
  const categoryId = useParams()['categoryId']
  const categoryInfo = useMemo(() => {
    if (categoryId && categoryList) {
      return categoryList.filter((m) => m.CategoryId.trim() === categoryId)[0]
    }
    return undefined
  }, [categoryId, categoryList])
  const initPageData: IPublicIndexPageData = {
    activeTabKey: '',
    newestQuery: {
      Page: 1,
      Limit: 10,
      CategoryId: categoryId,
    },
    hasMoreNewest: undefined,
    newestConversations: [],
    hotestQuery: {
      Page: 1,
      Limit: 10,
      IsHotest: true,
      CategoryId: categoryId,
    },
    hasMoreHotest: undefined,
    hotestConversations: [],
  }
  const conRef = useRef<HTMLDivElement>(null)
  const [pageData, setPageData] = useState<IPublicIndexPageData>(initPageData)
  const navigate = useNavigate()
  useEffect(() => {
    if (!categoryList) {
      dispatch(updateCategoryListVMAsync())
    }
  }, [])
  function goToCreatePage() {
    cacheAllPageData()
    navigate('/p/create')
  }
  async function loadNewestData() {
    let res = await getPublicConversationInfoVMList(pageData.newestQuery!, true)
    if (res.IsSuccess) {
      setPageData({
        ...pageData,
        hasMoreNewest: res.Result!.length >= pageData.newestQuery.Limit!,
        newestConversations: combineTwoList<ConversationInfoVM>(
          pageData.newestConversations,
          res.Result!,
          'ConversationId'
        ),
        newestQuery: {
          ...pageData.newestQuery,
          Page: pageData.newestQuery.Page! + 1,
        },
      })
    } else {
      errorMsg(res.Message)
    }
  }
  async function loadHotestData() {
    let res = await getPublicConversationInfoVMList(pageData.hotestQuery!, true)
    if (res.IsSuccess) {
      setPageData({
        ...pageData,
        hasMoreHotest: res.Result!.length >= pageData.hotestQuery.Limit!,
        hotestConversations: combineTwoList<ConversationInfoVM>(
          pageData.hotestConversations,
          res.Result!,
          'ConversationId'
        ),
        hotestQuery: {
          ...pageData.hotestQuery,
          Page: pageData.hotestQuery.Page! + 1,
        },
      })
    } else {
      errorMsg(res.Message)
    }
  }
  function setTab(key: string) {
    if (key === 'latest' && pageData.hasMoreNewest === undefined) {
      setPageData({
        ...pageData,
        activeTabKey: key,
        hasMoreNewest: true,
      })
    } else if (key === 'hotest' && pageData.hasMoreHotest === undefined) {
      setPageData({
        ...pageData,
        activeTabKey: key,
        hasMoreHotest: true,
      })
    } else {
      setPageData({
        ...pageData,
        activeTabKey: key,
      })
    }
  }
  useEffect(() => {
    let tmp = getPageCache()
    if (tmp) {
      setPageData(tmp)
      window.setTimeout(() => {
        conRef.current!.scrollTop = tmp.scrollTop
      }, 50)
    } else {
      setTab('latest')
    }
  }, [])
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
    let curTab = pageData.activeTabKey
    dispatch(updateCategoryListVMAsync())
    setPageData({
      ...initPageData,
      activeTabKey: curTab,
      hasMoreNewest: curTab === 'latest' ? true : undefined,
      hasMoreHotest: curTab === 'hotest' ? true : undefined,
    })
  }
  return (
    <>
      <PageHeader title={categoryInfo ? categoryInfo.CategoryName : ''} />
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <div style={{ padding: 10, width: '100%' }}>
            <SearchBar
              placeholder={
                categoryInfo ? `搜索${categoryInfo.CategoryName}板块` : ''
              }
              style={{
                '--background': '#ffffff',
                '--height': '20px',
              }}
              onFocus={() => {
                if (categoryInfo) {
                  cacheAllPageData()
                  navigate('/p/search/' + categoryInfo.CategoryId)
                }
              }}
            />
          </div>
        </div>
      </div>

      {categoryInfo && (
        <div
          style={{
            height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 50px)`,
            overflow: 'auto',
          }}
          ref={conRef}
        >
          <PullToRefresh onRefresh={refresh}>
            <div style={{ padding: 7, paddingTop: 0 }}>
              <div>
                <Tabs
                  style={{
                    '--title-font-size': '14px',
                    '--content-padding': '0',
                  }}
                  activeKey={pageData.activeTabKey}
                  onChange={setTab}
                >
                  <Tabs.Tab title="最新发布" key="latest">
                    <div>
                      <List>
                        {pageData.newestConversations.map((m) => (
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
                    {!pageData.hasMoreNewest &&
                      pageData.newestConversations.length === 0 && (
                        <EmptyContent
                          onClick={() => {
                            cacheAllPageData()
                          }}
                        />
                      )}
                    {(pageData.hasMoreNewest ||
                      pageData.newestConversations.length > 0) && (
                      <InfiniteScroll
                        loadMore={loadNewestData}
                        hasMore={pageData.hasMoreNewest ?? false}
                      />
                    )}
                  </Tabs.Tab>
                  <Tabs.Tab title="热门话题" key="hotest">
                    <div>
                      <List>
                        {pageData.hotestConversations.map((m) => (
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
                    {!pageData.hasMoreHotest &&
                      pageData.hotestConversations.length === 0 && (
                        <EmptyContent
                          onClick={() => {
                            cacheAllPageData()
                          }}
                        />
                      )}
                    {(pageData.hasMoreHotest ||
                      pageData.hotestConversations.length > 0) && (
                      <InfiniteScroll
                        loadMore={loadHotestData}
                        hasMore={pageData.hasMoreHotest ?? false}
                      />
                    )}
                  </Tabs.Tab>
                </Tabs>
              </div>
            </div>
          </PullToRefresh>
        </div>
      )}
    </>
  )
}
interface IEmptyContent {
  onClick?: () => void
}
function EmptyContent(props: IEmptyContent) {
  const categoryId = useParams()['categoryId']
  const navigate = useNavigate()
  return (
    <>
      <ErrorBlock
        style={{ '--image-height': '150px', marginTop: 60 }}
        image={
          'https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/empty.png'
        }
        title="暂时没有相关的话题"
        description={
          <>
            <Button
              size="mini"
              onClick={() => {
                if (props.onClick) {
                  props.onClick()
                }
                navigate('/p/create/' + categoryId)
              }}
            >
              我要发布相关话题
            </Button>
          </>
        }
      />
    </>
  )
}

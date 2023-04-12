import { getPublicConversationInfoVMList } from '@api/chat'
import CustomerSkeleton from '@components/common/CustomerSkeleton'
import { PageHeader } from '@components/common/PageHeader'
import { ConversationItem } from '@components/conversation/ConversationItem'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateCategoryListVMAsync } from '@store/modules/converstaion'
import { getPageCache, setPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, formatDate2 } from '@utils/common'
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
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

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
  const initPageData: IPublicIndexPageData = {
    activeTabKey: '',
    newestQuery: {
      Page: 1,
      Limit: 10,
    },
    hasMoreNewest: undefined,
    newestConversations: [],
    hotestQuery: {
      Page: 1,
      Limit: 10,
      IsHotest: true,
    },
    hasMoreHotest: undefined,
    hotestConversations: [],
  }
  const conRef = useRef<HTMLDivElement>(null)
  const [pageData, setPageData] = useState<IPublicIndexPageData>(initPageData)
  const navigate = useNavigate()
  useEffect(() => {
    if (categoryList === undefined) {
      dispatch(updateCategoryListVMAsync())
    }
    document.title = '社区'
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
      throw new Error()
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
      throw new Error()
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
  function goToHistoryPage(key: string) {
    cacheAllPageData()
    navigate('/p/actions/history/' + key)
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
              placeholder="全站搜索"
              style={{
                '--background': '#ffffff',
                '--height': '20px',
              }}
              onFocus={() => {
                cacheAllPageData()
                navigate('/p/search')
              }}
            />
          </div>
          <span
            onClick={goToCreatePage}
            style={{
              marginLeft: 'auto',
              marginRight: 10,
              lineHeight: '40px',
              color: '#333',
              textAlign: 'right',
              minWidth: '75px',
            }}
          >
            <span className="iconfont icon-fabu"></span>
            <span style={{ marginLeft: 4 }}>发布话题</span>
          </span>
        </div>
      </div>
      <div
        style={{ height: 'calc(100% - 45px)', overflow: 'auto' }}
        ref={conRef}
      >
        <PullToRefresh onRefresh={refresh}>
          <div>
            <Grid
              columns={4}
              style={{
                marginLeft: 'auto',
                color: '#333',
                textAlign: 'center',
                marginTop: 5,
              }}
            >
              <Grid.Item>
                <TabItem
                  icon="icon-dianzan1"
                  iconColor="var(--adm-color-primary)"
                  text="点赞过"
                  bg="rgba(22,119,255,0.2)"
                  onClick={() => {
                    goToHistoryPage('likes')
                  }}
                />
              </Grid.Item>
              <Grid.Item>
                <TabItem
                  icon="icon-aixin1"
                  iconColor="var(--adm-color-danger)"
                  text="我的收藏"
                  bg="rgba(255,0,0,0.2)"
                  onClick={() => {
                    goToHistoryPage('favorites')
                  }}
                />
              </Grid.Item>
              <Grid.Item>
                <TabItem
                  icon="icon-pinglun"
                  iconColor="var(--adm-color-success)"
                  text="评论过&提问过"
                  bg="rgba(0,255,0,0.2)"
                  onClick={() => {
                    goToHistoryPage('messages')
                  }}
                />
              </Grid.Item>
            </Grid>
          </div>
          <div style={{ padding: 7, marginTop: 10 }}>
            {!categoryList && (
              <div
                style={{ background: 'white', borderRadius: 10, padding: 5 }}
              >
                <CustomerSkeleton width={'90%'} height={18} />
                <div style={{ height: 5 }}></div>
                <CustomerSkeleton width={'100%'} height={13} />
                <div style={{ height: 5 }}></div>
                <CustomerSkeleton width={'90%'} height={18} />
                <div style={{ height: 5 }}></div>
                <CustomerSkeleton width={'100%'} height={13} />
              </div>
            )}
            {categoryList && (
              <div
                style={{ background: 'white', borderRadius: 10, padding: 5 }}
              >
                <Grid columns={5} gap={10}>
                  {categoryList?.map((m) => (
                    <Grid.Item
                      key={m.CategoryId}
                      onClick={() => {
                        cacheAllPageData()
                        navigate('/p/category/' + m.CategoryId)
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            color: 'var(--adm-color-text-secondary)',
                            fontSize: 18,
                          }}
                        >
                          {m.ContentNums}
                        </div>
                        <div
                          style={{
                            color: 'var(--adm-color-weak)',
                            fontSize: 12,
                          }}
                        >
                          {m.CategoryName}
                        </div>
                      </div>
                    </Grid.Item>
                  ))}
                </Grid>
              </div>
            )}
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
    </>
  )
}
interface ITabItem {
  bg: string
  text: string
  icon: string
  iconColor: string
  onClick?: () => void
}
function TabItem(props: ITabItem) {
  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              height: 40,
              width: 40,
              backgroundColor: props.bg,
              borderRadius: 15,
              lineHeight: '40px',
            }}
            onClick={() => {
              if (props.onClick) props.onClick()
            }}
          >
            <span
              className={'iconfont ' + props.icon}
              style={{ color: props.iconColor, fontSize: 25 }}
            ></span>
          </div>
        </div>
        <span
          style={{ color: 'var(--adm-color-text-secondary)', fontSize: 12 }}
          onClick={() => {
            if (props.onClick) props.onClick()
          }}
        >
          {props.text}
        </span>
      </div>
    </>
  )
}
interface IEmptyContent {
  onClick?: () => void
}
function EmptyContent(props: IEmptyContent) {
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
                navigate('/p/create/')
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

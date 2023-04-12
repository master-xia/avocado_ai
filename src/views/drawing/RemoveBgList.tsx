import {
  getImageFixInfoVMPageList,
  getRemoveBgInfoVMPageList,
} from '@api/drawing'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import { getPageCache } from '@utils/cache'
import { combineTwoList, errorMsg, isWxEnv } from '@utils/common'
import {
  Button,
  ErrorBlock,
  Grid,
  InfiniteScroll,
  Loading,
  PullToRefresh,
} from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { noColorBgImg } from '@components/common/SelectColor'
interface IQueryResult {
  dataList: RemoveBgInfoVM[]
  hasMore: boolean
}
export default function RemoveBgList() {
  var navigate = useNavigate()
  let conRef = useRef<HTMLDivElement>(null)
  let remBgType = useParams()['remBgType']
  let initQuery: any = {
    Page: 1,
    Limit: 20,
    RemoveBgType: remBgType,
  }
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
    hasMore: false,
  })
  let [queryParams, setQueryParams] = useState<RemoveBgInfoQuery>(initQuery)

  function goToDetailPage(fixInfo: RemoveBgInfoVM) {
    navigate('/drawing/rembg/detail/' + fixInfo.RemoveId)
  }
  async function loadData() {
    let res = await getRemoveBgInfoVMPageList(queryParams!, true)
    if (res.IsSuccess) {
      setQueryResult({
        dataList: combineTwoList(queryResult!.dataList!, res.Result!, 'Id'),
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
          title={remBgType === '0' ? 'AI抠图纪录' : 'AI制作证件照纪录'}
          right={
            <>
              {remBgType === '0' ? (
                <span
                  onClick={() => {
                    navigate('/drawing/rembg')
                  }}
                >
                  新的抠图
                </span>
              ) : (
                <span
                  onClick={() => {
                    navigate('/drawing/photoMaker')
                  }}
                >
                  新的证件照
                </span>
              )}
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
                key={m.Id}
                removeBgInfo={m}
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
                          navigate('/drawing/rembg')
                        }}
                      >
                        {remBgType === '0' ? '我要抠图' : '制作证件照'}
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
  removeBgInfo: RemoveBgInfoVM
  onItemClick: () => void
}
function Item(props: IItem) {
  let m = props.removeBgInfo
  let [imageData, setImageData] = useState('')
  let [bgColor, setBgColor] = useState('')
  useEffect(() => {
    if (m.RemovedBgImageUrl) {
      setImageData(m.RemovedBgImageUrl)
    }
  }, [])
  return (
    <div
      style={{ borderBottom: '1px solid #eee' }}
      key={m.Id}
      onClick={() => {
        props.onItemClick()
      }}
    >
      <div style={{ padding: 10, paddingBottom: 0 }}>
        <Grid columns={1} gap={0}>
          <Grid.Item>
            {(m.Status !== 3 || m.CheckStatus === 1) && (
              <>
                <div
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 100,
                    display: 'flex',
                    color: '#999',
                  }}
                >
                  {m.Status === 0 && m.CheckStatus !== 1 && (
                    <span>
                      <Loading />
                      等待AI对图片进行操作
                    </span>
                  )}
                  {m.Status === 1 && m.CheckStatus !== 1 && (
                    <span>
                      <Loading />
                      AI正在操作该图片
                    </span>
                  )}
                  {m.Status === 2 && m.CheckStatus !== 1 && (
                    <span>AI抠图该图片失败</span>
                  )}
                  {m.CheckStatus === 1 && <span>图片违规</span>}
                </div>
              </>
            )}
            {m.Status === 3 && m.CheckStatus !== 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={m.RemovedBgImageUrl}
                  style={{
                    height: '100px',
                    backgroundImage: bgColor ? '' : noColorBgImg,
                  }}
                  alt=""
                />
              </div>
            )}
          </Grid.Item>
        </Grid>
      </div>
      <div style={{ padding: 10, paddingTop: 0, paddingBottom: 0 }}>
        <div
          style={{
            margin: '5px 0',
            marginTop: 3,
            display: 'flex',
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: '#999',
              textAlign: 'right',
              marginLeft: 'auto',
            }}
          >
            <span>创建于</span>
            <Datetime
              type="datetime"
              datetime={m.CreateTime}
              format="yyyy-MM-dd hh:mm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

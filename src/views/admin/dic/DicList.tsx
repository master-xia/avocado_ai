import { getDicDomainList, getDicInfoList } from '@api/cmmon'
import NoData from '@components/common/NoData'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg, isWxEnv } from '@utils/common'
import { Tabs, InfiniteScroll, List, SideBar, Button } from 'antd-mobile'
import { RightOutline } from 'antd-mobile-icons'
import { ListItem } from 'antd-mobile/es/components/list/list-item'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
interface IQueryResult {
  dataList: CI_DicInfo[]
}

function DicInfoList() {
  const curDomain = useParams()['domain']
  const defaultQuery: DicInfoQuery = {}
  const [queryParams, setQueryParams] = useState<DicInfoQuery>(defaultQuery)
  const [queryResult, setQueryResult] = useState<IQueryResult>({
    dataList: [],
  })
  const [domains, setDomains] = useState<string[]>([])
  useEffect(() => {
    loadDomains()
  }, [])
  useEffect(() => {
    if (curDomain) {
      loadData()
    }
  }, [curDomain])
  const navigate = useNavigate()
  function refresh() {
    setQueryParams({ ...defaultQuery })
    setQueryResult({
      dataList: [],
    })
  }
  useEffect(() => {
    if (!curDomain && domains.length > 0) {
      navigate('/admin/dic/list/' + domains[0], { replace: true })
      return
    }
  }, [domains])
  function loadDomains() {
    getDicDomainList().then((res) => {
      if (res.IsSuccess) {
        setDomains(res.Result!)
      } else {
        errorMsg(res.Message)
      }
    })
  }
  async function loadData() {
    let res = await getDicInfoList({
      DomainType: curDomain,
    })
    if (res.IsSuccess) {
      setQueryResult({
        dataList: res.Result!,
      })
    } else {
      errorMsg(res.Message)
    }
  }
  /**缓存页面数据 */
  const listConRef = useRef(null)

  return (
    <>
      <PageHeader
        title="字典列表"
        right={
          <span
            style={{ color: 'dodgerblue' }}
            onClick={() => navigate('/admin/dic/add')}
          >
            新增
          </span>
        }
      />
      <div>
        <div className="container">
          <div className="side">
            <SideBar
              defaultActiveKey={curDomain}
              onChange={(key) => {
                navigate('/admin/dic/list/' + key, { replace: true })
              }}
            >
              {domains.map((item) => (
                <SideBar.Item key={item} title={item} />
              ))}
            </SideBar>
          </div>
          <div className="main">
            <List>
              {domains.length === 0 && <NoData />}
              {queryResult.dataList.map((item) => (
                <DicItem
                  dicInfo={item}
                  key={item.Id}
                  onClick={() => {
                    navigate(`/admin/dic/${item.Id}`)
                  }}
                />
              ))}
              {domains.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <Button
                    block
                    color="primary"
                    onClick={() => navigate('/admin/dic/add/' + curDomain)}
                  >
                    新增一条新数据
                  </Button>
                </div>
              )}
            </List>
          </div>
        </div>
      </div>
      <style>
        {`
          .container {
            height:calc(100vh - ${isWxEnv ? 0 : 45}px );
            background-color: #ffffff;
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
          }
          .side {
            flex: none;
          }
          
          .main {
            flex: auto;
            padding: 0 24px 32px;
            overflow-y: scroll;
          }
          `}
      </style>
    </>
  )
}
interface IDicItemProps {
  dicInfo: CI_DicInfo
  onClick: () => void
}
function DicItem(props: IDicItemProps) {
  const navigate = useNavigate()
  const cusInfo = props.dicInfo
  return (
    <>
      <ListItem
        clickable
        title={cusInfo.Key}
        // description={cusInfo.Note ?? '无备注信息'}
        onClick={props.onClick}
      >
        <div>{cusInfo.Value}</div>
      </ListItem>
    </>
  )
}
export default DicInfoList

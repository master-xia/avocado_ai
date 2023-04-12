import {
  buyPictureAction,
  dislikePictureAction,
  getDrawingDetail,
  likePictureAction,
  viewPictureAction,
} from '@api/drawing'
import CustomerSkeleton from '@components/common/CustomerSkeleton'
import { Datetime } from '@components/common/Datetime'
import { PageHeader } from '@components/common/PageHeader'
import {
  errorMsg,
  hideLoading,
  isWxEnv,
  showLoading,
  successMsg,
} from '@utils/common'
import { Avatar, Button, Dialog, Ellipsis, Grid, List, Tag } from 'antd-mobile'
import { EyeOutline } from 'antd-mobile-icons'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import Avocado from '@components/common/Avocado'
export default function PictureDetail() {
  let pictureId = useParams()['pictureId']
  let [pictureInfo, setPictureInfo] = useState<DrawingPictureDetailInfoVM>()
  function loadData() {
    if (pictureId) {
      getDrawingDetail(pictureId)
        .then((res) => {
          if (res.IsSuccess) {
            setPictureInfo(res.Result!)
          } else {
            errorMsg(res.Message)
          }
        })
        .catch(() => {
          errorMsg('网络异常')
        })
    }
  }
  useEffect(() => {
    if (pictureInfo?.PictureId) {
      viewPictureAction(pictureInfo.PictureId)
    }
  }, [pictureInfo?.PictureId])
  useEffect(() => {
    loadData()
  }, [])
  return (
    <>
      <PageHeader title={'图片详情'} />
      <div
        style={{
          height: `calc(100vh - ${isWxEnv ? 0 : 45}px - 60px)`,
          overflow: 'auto',
        }}
      >
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ padding: 10, display: 'flex', fontSize: 14 }}>
            <div>
              <Avatar src={pictureInfo?.Header ?? ''} />
            </div>
            <div
              style={{ paddingLeft: 10, alignSelf: 'center', width: '100%' }}
            >
              <div style={{ display: 'flex', color: 'var(--adm-color-weak)' }}>
                <span>{pictureInfo?.Name}</span>
                {!pictureInfo && (
                  <div>
                    <CustomerSkeleton height={15} width={100} />
                    <div style={{ height: 10 }}></div>
                    <CustomerSkeleton height={18} width={150} />
                  </div>
                )}
                <span
                  style={{
                    marginLeft: 'auto',
                  }}
                ></span>
              </div>
              <div
                style={{ fontSize: 12, display: 'flex', lineHeight: '18px' }}
              >
                {pictureInfo?.CheckStatus === 0 && (
                  <span style={{ color: 'var(--adm-color-weak)' }}>
                    审核中，仅自己可见
                  </span>
                )}
                {pictureInfo?.CheckStatus === 1 && (
                  <span style={{ color: 'var(--adm-color-danger)' }}>
                    审核失败，仅自己可见
                  </span>
                )}
                {pictureInfo?.CheckStatus === 2 && (
                  <span style={{ color: 'var(--adm-color-weak)' }}>已审核</span>
                )}
                <span
                  style={{
                    lineHeight: '18px',
                    color: '#999',
                    marginLeft: 5,
                  }}
                >
                  {!pictureInfo && <CustomerSkeleton height={13} width={50} />}
                </span>
                <span
                  style={{
                    color: '#999',
                    marginLeft: 'auto',
                    display: 'flex',
                  }}
                >
                  {!pictureInfo && <CustomerSkeleton height={13} width={100} />}
                  {pictureInfo && (
                    <>
                      <span>绘图于</span>
                      <Datetime
                        datetime={pictureInfo?.CreateTime}
                        format="yyyy-MM-dd hh:mm"
                        type="datetime"
                        default=""
                      />
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div style={{ padding: 10 }}>
            <div style={{ color: '#999' }}>提示词</div>
            <div style={{ fontSize: 16 }}>
              <Ellipsis
                content={pictureInfo?.Prompt ?? '无'}
                direction="end"
                rows={2}
                expandText="展开"
                collapseText="收起"
              />
            </div>
            <div style={{ color: '#999' }}>消极提示词</div>
            <div style={{ fontSize: 16 }}>
              <Ellipsis
                content={pictureInfo?.NegativePrompt ?? '无'}
                direction="end"
                rows={2}
                expandText="展开"
                collapseText="收起"
              />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          {pictureInfo && (
            <PhotoProvider photoClosable>
              <PhotoView src={pictureInfo.Url}>
                <img src={pictureInfo.Url} style={{ width: '100%' }} alt="" />
              </PhotoView>
            </PhotoProvider>
          )}
        </div>
        <List className="pictureInfo" style={{ marginTop: 5 }}>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>模型</span>}
            extra={<>{pictureInfo?.ModelName}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>尺寸</span>}
            extra={
              pictureInfo && (
                <>
                  {pictureInfo.Width} X {pictureInfo.Height} (
                  {pictureInfo.Ratio})
                </>
              )
            }
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>属性</span>}
            extra={<>{pictureInfo?.Property}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>大小</span>}
            extra={<>{pictureInfo?.FileSizeStr}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>步数</span>}
            extra={<>{pictureInfo?.Steps}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>艺术家</span>}
            extra={
              <>
                <div style={{ textAlign: 'right' }}>
                  {pictureInfo?.Artists
                    ? pictureInfo.Artists.split('|').map((m) => (
                        <Tag
                          fill="outline"
                          color="primary"
                          style={{ marginLeft: 5 }}
                          key={m}
                        >
                          {m}
                        </Tag>
                      ))
                    : '无'}
                </div>
              </>
            }
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>风格</span>}
            extra={
              <>
                <div style={{ textAlign: 'right' }}>
                  {pictureInfo?.Styles
                    ? pictureInfo.Styles.split('|').map((m) => (
                        <Tag
                          fill="outline"
                          color="primary"
                          style={{ marginLeft: 5 }}
                          key={m}
                        >
                          {m}
                        </Tag>
                      ))
                    : '无'}
                </div>
              </>
            }
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>提示词</span>}
            extra={
              <>
                <div style={{ textAlign: 'right' }}>
                  {pictureInfo?.Tags
                    ? pictureInfo.Tags.split('|').map((m) => (
                        <Tag
                          fill="outline"
                          color="success"
                          style={{ marginLeft: 5 }}
                          key={m}
                        >
                          {m}
                        </Tag>
                      ))
                    : '无'}
                </div>
              </>
            }
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>消极提示词</span>}
            extra={
              <>
                <div style={{ textAlign: 'right' }}>
                  {pictureInfo?.NegativeTags
                    ? pictureInfo.NegativeTags.split('|').map((m) => (
                        <Tag
                          fill="outline"
                          color="danger"
                          style={{ marginLeft: 5 }}
                          key={m}
                        >
                          {m}
                        </Tag>
                      ))
                    : '无'}
                </div>
              </>
            }
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>种子</span>}
            extra={<>{pictureInfo?.Seed}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>脸部操作</span>}
            extra={<>{pictureInfo?.RestoreFaces ? '细致化脸部' : '默认'}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>采样方法</span>}
            extra={<>{pictureInfo?.SamplingMethod}</>}
          ></List.Item>
          <List.Item
            prefix={<span style={{ fontSize: 14 }}>CFG</span>}
            extra={<>{pictureInfo?.CFG}</>}
          ></List.Item>
        </List>
      </div>
      {pictureInfo && (
        <BottomBar
          {...pictureInfo}
          shouldUpdate={() => {
            loadData()
          }}
          onClickComment={() => {}}
        />
      )}
      <style>
        {`
        .pictureInfo{
          --border-inner:none;
          border:none;
        }
        .pictureInfo .adm-list-item-content-main{
          padding:0;
          padding-bottom:10px;
        }
        `}
      </style>
    </>
  )
}
interface IBottomBarProps {
  PictureId: string
  UserName: string
  Likes: number
  //不喜欢数量
  Favorites: number
  //评论数量
  Comments: number
  Views: number
  IsLike: boolean
  IsView: boolean
  IsComment: boolean
  IsFavorite: boolean
  IsOwner: boolean
  OwnerCount: number
  onClickComment: () => void
  shouldUpdate: () => void
}
function BottomBar(props: IBottomBarProps) {
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  function doAction(fun: (converstaionId: string) => Promise<CommonResult>) {
    fun(props.PictureId)
      .then((res) => {
        if (res.IsSuccess) {
          showLoading()
          window.setTimeout(() => {
            props.shouldUpdate()
            hideLoading()
          }, 1000)
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }
  function buy() {
    Dialog.confirm({
      title: '提示',
      content: (
        <>
          <div>
            获取授权后可查看无水印高清原图，并可用于商用。是否花费
            {avocadoInfo?.BuyAiDrawingPicture}个牛油果获取授权？
          </div>
        </>
      ),
      confirmText: '获取授权',
      onConfirm: () => {
        buyPictureAction(props.PictureId)
          .then((res) => {
            if (res.IsSuccess) {
              successMsg('获取授权成功')
              window.setTimeout(() => {
                props.shouldUpdate()
              }, 1000)
            } else {
              if (res.Code !== 40001) {
                errorMsg(res.Message)
              }
            }
          })
          .catch(() => {
            errorMsg('网络异常')
          })
      },
    })
  }
  return (
    <>
      <div
        style={{
          width: '100%',
          position: 'fixed',
          bottom: 0,
        }}
      >
        <div style={{ padding: 5, textAlign: 'right', color: '#999' }}>
          {props.IsOwner ? (
            <>
              <div>
                <span>已获取该图片授权，可进行 </span>
                <Tag color="gold" style={{ marginRight: 3 }}>
                  查看原图
                </Tag>
                <Tag color="gold" style={{ marginLeft: 3, marginRight: 3 }}>
                  商业用途
                </Tag>
              </div>
            </>
          ) : (
            <>
              <div>
                <span>图片版权属于牛油果AI，</span>
                <Tag color="gold" style={{ marginRight: 3 }}>
                  查看原图
                </Tag>
                <Tag color="gold" style={{ marginLeft: 3, marginRight: 3 }}>
                  商业用途
                </Tag>
                需获取授权
              </div>
            </>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            height: 35,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Grid
            columns={2}
            gap={5}
            style={{
              lineHeight: '40px',
              fontSize: 20,
              marginLeft: 10,
              color: '#333',
              minWidth: 80,
            }}
          >
            <Grid.Item>
              <span>
                {props.IsLike ? (
                  <span
                    onClick={() => {
                      doAction(dislikePictureAction)
                    }}
                    className="iconfont icon-dianzan1"
                    style={{ color: 'var(--adm-color-primary)' }}
                  ></span>
                ) : (
                  <span
                    onClick={() => {
                      doAction(likePictureAction)
                    }}
                    className="iconfont icon-dianzan"
                  ></span>
                )}
                <span
                  style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 5 }}
                >
                  {props.Likes ?? 0}
                </span>
              </span>
            </Grid.Item>
            <Grid.Item>
              <span style={{ color: 'var(--adm-color-text)' }}>
                <EyeOutline style={{ fontSize: 18 }} />
              </span>
              <span
                style={{ fontWeight: 'normal', fontSize: 16, marginLeft: 5 }}
              >
                {props.Views ?? 0}
              </span>
            </Grid.Item>
          </Grid>
          <span style={{ marginLeft: 10, color: '#999' }}>
            已授权{props.OwnerCount}用户
          </span>
          <div
            style={{ alignItems: 'center', marginLeft: 'auto', marginRight: 5 }}
          >
            {props.IsOwner ? (
              <>
                <span style={{ color: '#999' }}>已有授权</span>
              </>
            ) : (
              <>
                <Button
                  shape="rounded"
                  size="mini"
                  color="warning"
                  onClick={buy}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ marginRight: 3 }}>获取授权</span>(
                    <span style={{ marginLeft: 3 }}>
                      {avocadoInfo?.BuyAiDrawingPicture}
                    </span>
                    <Avocado height={15} width={15} />)
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

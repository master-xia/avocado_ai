import Avocado from '@components/common/Avocado'
import { PageHeader } from '@components/common/PageHeader'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import { updateAvocadoInfoAsyn } from '@store/modules/settings'
import { isWxEnv } from '@utils/common'
import { NoticeBar } from 'antd-mobile'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const userInfo = useAppSelector((m) => m.auth.userInfo)
  const avocadoInfo = useAppSelector((m) => m.settings.avocadoInfo)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (avocadoInfo === undefined) {
      dispatch(updateAvocadoInfoAsyn())
    }
  }, [])
  return (
    <>
      <PageHeader title={'小提示'} />
      <div
        style={{
          overflow: 'auto',
          height: `calc(100vh - ${isWxEnv ? 0 : 50}px)`,
        }}
      >
        {userInfo?.RemainCount === 0 && (
          <NoticeBar
            content={`当前牛油果剩余${userInfo?.RemainCount}个`}
            color="alert"
            closeable
          />
        )}
        <div
          style={{
            padding: 10,
            lineHeight: '25px',
            fontSize: 15,
          }}
        >
          <div style={{ fontSize: 18 }}>如何获取牛油果？</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            新用户注册赠送 {avocadoInfo?.RegisterGet}
            <Avocado />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              关注微信公众号赠送 {avocadoInfo?.FollowWxOfficialAccount}{' '}
              <Avocado />
              <span
                style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
                onClick={() => {
                  navigate('/system/bindWxOfficialAccount')
                }}
              >
                查看详情
              </span>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              邀请新用户注册奖励 {avocadoInfo?.InviteUserGet} <Avocado />
              （推荐）
              <span
                style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
                onClick={() => {
                  navigate('/user/invite')
                }}
              >
                立即邀请
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            购买
            <Avocado />
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/order/buy')
              }}
            >
              点击购买
            </span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              每日签到奖励 {avocadoInfo?.SignGet} <Avocado />
              <span
                style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
                onClick={() => {
                  navigate('/user/sign')
                }}
              >
                立即签到
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            发布话题，获取（{avocadoInfo?.ConversationLikeGet}
            <Avocado />
            /赞）
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/p/create')
              }}
            >
              前往发布
            </span>
          </div>
          {userInfo &&
            !userInfo.PublishedConversation &&
            avocadoInfo &&
            avocadoInfo!.FisrtPublicConversationGet > 0 && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                首次发布话题奖励 {avocadoInfo?.FisrtPublicConversationGet}{' '}
                <Avocado />
                <span
                  style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
                  onClick={() => {
                    navigate('/p/create')
                  }}
                >
                  前往发布
                </span>
              </div>
            )}
          <div style={{ fontSize: 18, marginTop: 18 }}>
            什么情况下消耗牛油果？
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            向ChatGPT提问，消耗 {avocadoInfo?.ChatMessageCost}
            <Avocado />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            发布话题，消耗 {avocadoInfo?.CreateConversationCost}个<Avocado />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            在话题中发布问题，消耗 {avocadoInfo?.ConversationQuestionCost}个
            <Avocado />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            在话题下评论，消耗 {avocadoInfo?.ConversationCommentCost}个
            <Avocado />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            AI绘图，根据图片参数动态计算消耗
            <Avocado />
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/drawing/create')
              }}
            >
              我要绘图
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            获取AI绘图图片授权，消耗 {avocadoInfo?.BuyAiDrawingPicture}
            <Avocado />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            AI修复照片，根据参数动态计算消耗
            <Avocado />
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/drawing/fix')
              }}
            >
              修复照片
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            获取各大平台无水印内容，消耗{' '}
            {avocadoInfo?.GetContentWithoutWatermark}
            <Avocado />
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/noWatermark')
              }}
            >
              前往使用
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            AI智能抠图，去背景，消耗 {avocadoInfo?.RemoveBg}
            <Avocado />
            <span
              style={{ color: 'var(--adm-color-primary)', marginLeft: 5 }}
              onClick={() => {
                navigate('/drawing/rembg')
              }}
            >
              前往使用
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

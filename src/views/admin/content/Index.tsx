import { getStatictic } from '@api/content'
import { PageHeader } from '@components/common/PageHeader'
import { errorMsg } from '@utils/common'
import { Grid } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Check() {
  var navigate = useNavigate()
  const [statistic, setStatistic] = useState<StatisticOverviewVM>()
  useEffect(() => {
    getStatictic()
      .then((res) => {
        if (res.IsSuccess) {
          setStatistic(res.Result)
        } else {
          errorMsg(res.Message)
        }
      })
      .catch(() => {
        errorMsg('网络异常')
      })
  }, [])
  return (
    <>
      <PageHeader title={'数据中心'} />
      <div style={{ padding: 10 }}>
        <div
          style={{
            background: 'white',
            padding: 10,
            borderRadius: 10,
            paddingTop: 0,
          }}
        >
          <div style={{ lineHeight: '30px' }}>平台数据</div>
          <Grid columns={4} gap={5}>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{statistic?.UserCount ?? 0}</div>
                <div>用户数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.ConversationCount ?? 0}
                </div>
                <div>话题数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{statistic?.ChatCount ?? 0}</div>
                <div>聊天数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.AiDrawingCount ?? 0}
                </div>
                <div>AI绘图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.NoWatermarkCount ?? 0}
                </div>
                <div>去水印次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.ImageFixCount ?? 0}
                </div>
                <div>AI修图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayRemoveBgCount ?? 0}
                </div>
                <div>AI抠图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.MessageCount ?? 0}
                </div>
                <div>总问答次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{statistic?.LikeCount ?? 0}</div>
                <div>总点赞次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.FavoriteCount ?? 0}
                </div>
                <div>总收藏次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{statistic?.ViewCount ?? 0}</div>
                <div>总浏览次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.CommentCount ?? 0}
                </div>
                <div>总评论次数</div>
              </div>
            </Grid.Item>
          </Grid>
        </div>
        <div
          style={{
            background: 'white',
            padding: 10,
            borderRadius: 10,
            paddingTop: 0,
            marginTop: 10,
          }}
        >
          <div style={{ lineHeight: '30px' }}>今日数据</div>
          <Grid columns={4} gap={5}>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayUserCount ?? 0}
                </div>
                <div>用户数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayConversationCount ?? 0}
                </div>
                <div>话题数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayChatCount ?? 0}
                </div>
                <div>聊天数量</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayAiDrawingCount ?? 0}
                </div>
                <div>AI绘图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayNoWatermarkCount ?? 0}
                </div>
                <div>去水印次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayImageFixCount ?? 0}
                </div>
                <div>AI修图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayRemoveBgCount ?? 0}
                </div>
                <div>AI抠图次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayMessageCount ?? 0}
                </div>
                <div>总问答次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayLikeCount ?? 0}
                </div>
                <div>总点赞次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayFavoriteCount ?? 0}
                </div>
                <div>总收藏次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayViewCount ?? 0}
                </div>
                <div>总浏览次数</div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  {statistic?.TodayCommentCount ?? 0}
                </div>
                <div>总评论次数</div>
              </div>
            </Grid.Item>
          </Grid>
        </div>
        <div
          style={{
            background: 'white',
            padding: 10,
            borderRadius: 10,
            paddingTop: 0,
            marginTop: 10,
          }}
        >
          <div style={{ lineHeight: '30px' }}>待审核内容</div>
          <Grid columns={4}>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/conversation')
                    }}
                  >
                    {statistic?.UncheckConversationCount ?? 0}
                  </span>
                </div>
                <div>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/conversation')
                    }}
                  >
                    话题/AI绘图
                  </span>
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/comment')
                    }}
                  >
                    {statistic?.UncheckCommentCount ?? 0}
                  </span>
                </div>
                <div>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/comment')
                    }}
                  >
                    评论
                  </span>
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/message')
                    }}
                  >
                    {statistic?.UncheckMessageCount ?? 0}
                  </span>
                </div>
                <div>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/message')
                    }}
                  >
                    提问
                  </span>
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/imageFix')
                    }}
                  >
                    {statistic?.UncheckImageFixCount ?? 0}
                  </span>
                </div>
                <div>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/imageFix')
                    }}
                  >
                    AI修复图片
                  </span>
                </div>
              </div>
            </Grid.Item>
            <Grid.Item>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/rembg')
                    }}
                  >
                    {statistic?.UncheckRemoveBgCount ?? 0}
                  </span>
                </div>
                <div>
                  <span
                    onClick={() => {
                      navigate('/admin/content/check/rembg')
                    }}
                  >
                    AI抠图
                  </span>
                </div>
              </div>
            </Grid.Item>
          </Grid>
        </div>
      </div>
    </>
  )
}

import { errorMsg, isWxEnv } from '@utils/common'
import { Grid, List, NoticeBar, Space, Tag } from 'antd-mobile'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeIndex() {
  const navigate = useNavigate()
  useEffect(() => {
    document.title = '首页'
  }, [])
  return (
    <>
      <NoticeBar
        content="现在关注微信公众号牛油果AI，可获得大量牛油果奖励哦！！！"
        color="alert"
        extra={
          <Space style={{ '--gap': '12px' }}>
            <span onClick={() => {}}>查看详情</span>
          </Space>
        }
      />
      <div
        style={{
          height: `calc(100vh - 50px - 40px)`,
          overflow: 'auto',
        }}
      >
        <div style={{ padding: 10, color: '#999' }}>AI助手</div>
        <List>
          <TypeItem
            title="ChatGPT助手"
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/chatgpt.png?x-oss-process=style/jmms"
            desc="基于OpenAI的ChatGPT技术，实现的多功能AI助手。"
            onclick={() => {
              navigate('/chat/create')
            }}
          />
          <TypeItem
            title="AI抠图"
            desc="一键去除背景，AI智能抠图，抠出人物，物品，服装等内容。"
            imgSrc="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/icon/rmbg.png"
            onclick={() => {
              navigate('/drawing/rembg')
            }}
            iconHeight={55}
          />
          <TypeItem
            title="AI绘图"
            desc="描述一幅画面，AI自动生成，每一张图片都是独一无二的。"
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/icons/painting.png?x-oss-process=style/jmms"
            onclick={() => {
              navigate('/drawing/create')
            }}
          />
          <TypeItem
            title="AI图片修复"
            desc="通过AI进行智能复原原本模糊的图片，可以得到一张修复后的清晰图片。"
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/icons/picture.png?x-oss-process=style/jmms"
            onclick={() => {
              navigate('/drawing/fix')
            }}
          />
          <TypeItem
            title="AI制作证件照"
            desc="一键在线制作证件照，可更换照片为任何背景颜色！"
            imgSrc="https://avocado-ai.oss-cn-shenzhen.aliyuncs.com/Images/icon/photo.png"
            onclick={() => {
              navigate('/drawing/photoMaker')
            }}
          />
          <TypeItem
            title="话题发布"
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/icons/public.png?x-oss-process=style/jmms"
            desc="发布话题到社区，由ChatGPT进行答复，其他用户也可进行追加提问。"
            onclick={() => {
              navigate('/p/create')
            }}
            iconHeight={50}
          />
          {/* <TypeItem
            title={
              <>
                <span>AI女友/男友</span>
                <Tag style={{ marginLeft: 5 }} color="danger">
                  即将上线
                </Tag>
              </>
            }
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/icons/gender.png?x-oss-process=style/jmms"
            desc="描述心目中的女友/男友，将基于ChatGPT技术生成一个虚拟女友/男友。"
            onclick={() => {
              errorMsg('即将上线，敬请期待')
            }}
            iconHeight={40}
          /> */}
        </List>
        <div style={{ padding: 10, color: '#999' }}>其他</div>
        <List>
          <TypeItem
            title="无水印下载视频/图集"
            desc="抖音、快手、小红书、微博、B站、皮皮虾、陌陌、头条、TikTok等200多个短视频平台。"
            imgSrc="https://aiquyin-static-beijing.oss-cn-beijing.aliyuncs.com/ChatGPT/icons/watemark.png?x-oss-process=style/jmms"
            onclick={() => {
              navigate('/noWatermark')
            }}
          />
        </List>
      </div>
    </>
  )
}

interface ITypeItem {
  imgSrc: string
  title: string | JSX.Element
  desc?: string
  onclick: () => void
  iconHeight?: number
}
function TypeItem(props: ITypeItem) {
  return (
    <List.Item
      onClick={props.onclick}
      prefix={
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 70,
            }}
          >
            <img
              src={props.imgSrc}
              alt=""
              style={{ height: props.iconHeight ?? 50 }}
            />
          </div>
        </>
      }
      description={props.desc}
      title={
        <span style={{ color: 'var(--adm-color-text)', fontSize: 16 }}>
          {props.title}
        </span>
      }
    ></List.Item>
  )
}

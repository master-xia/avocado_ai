import { formatDate2 } from '@utils/common'
import { Avatar, Ellipsis, Grid, List, Tag } from 'antd-mobile'
import { ConversationImages } from './ConversationImages'
import { useMemo } from 'react'

interface IConversationItem {
  item: ConversationInfoVM
  onClick?: () => void
}
export function ConversationItem(props: IConversationItem) {
  const m = props.item
  var tags = useMemo(() => {
    let tagList: string[] = []
    if (m.RoleDescription && m.ConversationType === 3) {
      var tmp = m.RoleDescription.split('|')
      tmp.forEach((item) => {
        if (item && item.length > 0) {
          tagList.push(item)
        }
      })
    }
    return tagList
  }, [m])
  return (
    <List.Item
      arrow={false}
      onClick={() => {
        if (props.onClick) {
          props.onClick()
        }
      }}
    >
      <div style={{ color: '#666', fontSize: 14 }}>
        <div
          style={{
            display: 'flex',
            lineHeight: '20px',
            fontSize: 12,
            color: '#999',
          }}
        >
          <Avatar
            src={m.Header ?? ''}
            style={{
              '--size': '20px',
              marginRight: 5,
            }}
          />
          <span>{m.Name}</span>
          <span>
            <Tag style={{ marginLeft: 5 }} color={'success'}>
              {m.CategoryName}
            </Tag>
          </span>

          <span style={{ marginLeft: 'auto' }}>
            {m.ConversationType === 2 && (
              <>
                <span>{m.MessageCount}</span>个提问
                <span> | </span>
              </>
            )}
            <span>{m.City ?? '未知'}</span>
          </span>
        </div>

        <div style={{ marginTop: 5, display: 'flex' }}>
          <Ellipsis
            rows={2}
            style={{ wordBreak: 'break-all' }}
            content={m.Title}
          />
          <span
            style={{
              marginLeft: 'auto',
              minWidth: '60px',
              fontSize: 12,
              color: '#999',
              textAlign: 'right',
            }}
          >
            {formatDate2(m.CreateTime)}
          </span>
        </div>
        <div>
          <ConversationImages Images={m.Images} />
        </div>
        {tags && tags.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {tags.map((item) => (
              <Tag
                key={item}
                color="primary"
                fill="outline"
                style={{ marginRight: 5, marginBottom: 5 }}
              >
                {item}
              </Tag>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12 }}>
          <Grid columns={4} style={{ textAlign: 'left' }}>
            <Grid.Item>
              <span style={{ color: '#999' }}>
                <span>点赞 </span>
                <span>{m.Likes}</span>
              </span>
            </Grid.Item>
            <Grid.Item>
              <span style={{ color: '#999' }}>
                <span>收藏 </span>
                <span>{m.Favorites}</span>
              </span>
            </Grid.Item>
            <Grid.Item>
              <span style={{ color: '#999' }}>
                <span>评论 </span>
                <span>{m.Comments}</span>
              </span>
            </Grid.Item>
            <Grid.Item>
              <span style={{ color: '#999' }}>
                <span>浏览 </span>
                <span>{m.Views}</span>
              </span>
            </Grid.Item>
          </Grid>
        </div>
      </div>
    </List.Item>
  )
}

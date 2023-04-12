import { Grid } from 'antd-mobile'
import { useMemo } from 'react'

interface IConversationImages {
  Images: string[]
}

export function ConversationImages(props: IConversationImages) {
  let column = useMemo(() => {
    if (props.Images && props.Images.length > 0) {
      let len = props.Images.length
      if (len === 1) {
        return 1
      }
      if (len <= 9) {
        return 3
      }
      if (len <= 16) {
        return 4
      }
      return 6
    }
    return 0
  }, [props.Images])
  let images = useMemo(() => {
    let tmp: string[] = []
    if (props.Images && props.Images.length > 0) {
      let len = props.Images.length
      if (len === 1) {
        return props.Images
      } else {
        return props.Images.map(
          (m) => m + '?x-oss-process=style/img_thumb_square'
        )
      }
    }
    return tmp
  }, [props.Images])
  if (props.Images && props.Images.length > 0) {
    return (
      <>
        <Grid columns={column} gap={5}>
          {images.map((m) => {
            if (m !== '') {
              return (
                <div
                  key={m}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img alt="" src={m} style={{ width: '100%' }} />
                </div>
              )
            }
            return (
              <div
                key={m}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#eee',
                }}
              >
                <div style={{ color: '#999' }}>图片违规</div>
              </div>
            )
          })}
        </Grid>
      </>
    )
  }
  return <></>
}

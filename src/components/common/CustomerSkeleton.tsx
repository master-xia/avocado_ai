import { Skeleton } from 'antd-mobile'
import React from 'react'

interface ICustomerSkeletonProps {
  conHeight?: number
  height: number | string
  width: number | string
  style?: React.CSSProperties
}
export default function CustomerSkeleton(props: ICustomerSkeletonProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: props.conHeight ?? props.height,
        ...props.style,
      }}
    >
      <Skeleton
        animated
        style={{
          '--height':
            typeof props.height === 'string'
              ? props.height
              : `${props.height}px`,
          '--width':
            typeof props.width === 'string' ? props.width : `${props.width}px`,
          display: 'flex',
          alignSelf: 'center',
        }}
      />
    </div>
  )
}

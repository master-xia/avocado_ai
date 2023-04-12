import { isWxEnv } from '@utils/common'
import { NavBar } from 'antd-mobile'
import { Component, FC, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
interface IPageHeaderProps {
  title: string
  showBack?: boolean
  backText?: string
  backgroundColor?: string
  right?: ReactNode
}
export const PageHeader: FC<IPageHeaderProps> = (props: IPageHeaderProps) => {
  let navigate = useNavigate()
  function back() {
    navigate(-1)
  }
  useEffect(() => {
    if (isWxEnv) {
      document.title = props.title
    }
  }, [])
  return (
    <>
      {!isWxEnv && (
        <NavBar
          back={props.showBack ? props.backText : undefined}
          onBack={props.showBack ? back : undefined}
          backArrow={props.showBack}
          style={{ background: props.backgroundColor }}
          right={props.right}
        >
          {props.title}
        </NavBar>
      )}
    </>
  )
}
PageHeader.defaultProps = {
  showBack: true,
  backText: '返回',
  backgroundColor: 'white',
}

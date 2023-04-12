interface ICheckStatus {
  CheckStatus: number | undefined
  fontSize?: number | undefined
}
export function CheckStatus(props: ICheckStatus) {
  let status = props.CheckStatus
  if (status === undefined) {
    return <></>
  }
  if (status === 0) {
    return (
      <>
        <span style={{ fontSize: props.fontSize ?? 12, color: '#999' }}>
          审核中，仅自己可见
        </span>
      </>
    )
  }
  if (status === 1) {
    return (
      <>
        <span style={{ fontSize: props.fontSize ?? 12, color: '#999' }}>
          审核失败，仅自己可见
        </span>
      </>
    )
  }
  if (status === 2) {
    return (
      <>
        <span style={{ fontSize: props.fontSize ?? 12, color: '#999' }}>
          审核通过
        </span>
      </>
    )
  }
  return <></>
}

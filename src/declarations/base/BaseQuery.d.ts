interface BaseQuery {
  LastOperatorUserName?: string
  CreatorUserName?: string
  IsDelete?: boolean
  SortList?: SortInfo[]
}
interface SortInfo {
  FieldName: string
  Asc: boolean
}

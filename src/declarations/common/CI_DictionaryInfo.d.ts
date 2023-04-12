interface CI_DicInfo extends BaseEntity {
  Id: number
  DomainType: string
  Key: string
  Value: string
  Order: number
  DomainOrder: number
  Note?: string
}

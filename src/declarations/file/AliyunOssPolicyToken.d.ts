interface AliyunOssPolicyToken {
  Signature: string
  CallbackBase64: string
  PolicyTokenBase64: string
  UploadUrl: string
  ExpiredTime: Date
  Dir: string
  AccessId: string
}
interface AliyunOssPolicyTokenVM extends AliyunOssPolicyToken {
  Key: string
  FileId: string
}

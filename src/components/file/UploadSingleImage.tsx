import { checkFile } from '@api/file'
import { errorMsg } from '@utils/common'
import { ImageUploadItem, ImageUploader } from 'antd-mobile'
import { useState } from 'react'
interface IUploadSingleImage {
  onSelect?: () => void
  onBegin?: (fileId: string) => void
  onSuccess?: (fileInfo: CheckFileResultVM) => void
  onFailed?: (fileId: string) => void
  onDelete?: (fileId: string) => void
  getToken: (
    info: GetUplodaToAliyunOSSPolicyTokenBaseVM
  ) => Promise<CommonResult<AliyunOssPolicyTokenVM>>
}
//只能上传一张图
export function UploadSingleImage(props: IUploadSingleImage) {
  //上传的图片列表
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  let [fileId, setFileId] = useState('')
  async function uploadFile(file: File) {
    if (props.onSelect) {
      props.onSelect()
    }
    var tokenRes = await props.getToken({
      FileName: file.name,
      FileSize: file.size,
    })
    if (!tokenRes.IsSuccess) {
      errorMsg(tokenRes.Message)
      throw new Error()
    }
    var uploadToken = tokenRes.Result
    var uploadPromise = new Promise<ImageUploadItem>((resolve, reject) => {
      var formData = new FormData()
      if (uploadToken!.CallbackBase64) {
        formData.append('callback', uploadToken!.CallbackBase64)
      }
      formData.append('key', uploadToken!.Key)
      formData.append('OSSAccessKeyId', uploadToken!.AccessId)
      formData.append('policy', uploadToken!.PolicyTokenBase64)
      formData.append('signature', uploadToken!.Signature)
      formData.append('file', file)
      var httpRequest = new XMLHttpRequest()
      if (props.onBegin) {
        props.onBegin(uploadToken!.FileId)
      }
      setFileId(uploadToken!.FileId)
      httpRequest.open('POST', uploadToken!.UploadUrl, true)
      httpRequest.send(formData) //发送请求 将json写入send中
      httpRequest.onreadystatechange = async function () {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 204) {
            var checkRes = await checkFile(uploadToken!.FileId)
            if (checkRes.IsSuccess) {
              if (props.onSuccess) {
                props.onSuccess(checkRes.Result)
              }
              resolve({
                url: checkRes.Result!.Url,
                thumbnailUrl: URL.createObjectURL(file),
              })
            } else {
              reject()
              errorMsg(checkRes.Message)
              throw new Error()
            }
          }
        }
      }
    })
    return uploadPromise
  }
  async function beforeUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      errorMsg('请选择小于 5M 的图片')
      return null
    }
    return file
  }
  return (
    <>
      <ImageUploader
        value={fileList}
        onChange={setFileList}
        upload={uploadFile}
        beforeUpload={beforeUpload}
        maxCount={1}
        onDelete={() => {
          if (props.onDelete) {
            props.onDelete(fileId)
          }
        }}
      />
    </>
  )
}

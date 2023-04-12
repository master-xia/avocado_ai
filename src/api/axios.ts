import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { showLoading, hideLoading } from '@utils/common'
import WebConfig from 'WebConfig'
import { logout } from '@utils/auth'
import { Dialog } from 'antd-mobile'

axios.defaults.timeout = 1000 * 60 * 5
axios.defaults.withCredentials = true // 允许携带cookie，不然后端没法用*
axios.defaults.baseURL = WebConfig.host.api
// 新增请求拦截器
axios.interceptors.request.use(
  function (config) {
    if (config.url && config.url[0] !== '/') {
      config.withCredentials = false
    }
    config.headers!['X-Requested-With'] = 'XMLHttpRequest'
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 新增响应拦截器
axios.interceptors.response.use(
  function (response) {
    const data = response.data as CommonResult
    const code = data.Code
    if (code === 10001) {
      logout()
    } else if (code === 40002) {
      //需要进行身份验证
      window.location.href = '/user/verify/phone'
    } else if (code === 40001) {
      Dialog.confirm({
        title: '提示',
        content: '次数不足，是否购买更多次数？',
        confirmText: '获取牛油果',
        onConfirm: () => {
          window.location.href = '/system/avocadoTips'
        },
      })
    }
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)
/**
 * get请求
 * @param url 请求api
 * @param params 参数
 * @param isHideLoading 是否隐藏加载
 * @returns
 */
export async function GET<T = any | undefined>(
  url: string,
  params: any = {},
  isHideLoading = false
) {
  if (!isHideLoading) {
    showLoading()
  }
  if (url.indexOf('?') !== -1) {
    url += '&t=' + new Date().getTime()
  } else {
    url += '?t=' + new Date().getTime()
  }
  return new Promise<CommonResult<T>>((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        if (!isHideLoading) {
          hideLoading()
        }
        resolve(res.data)
      })
      .catch((err) => {
        if (!isHideLoading) {
          hideLoading()
        }
        reject(err)
      })
  })
}
/**
 * Post请求
 * @param url api
 * @param params 参数
 * @param json 是否传递json格式的参数
 * @param isHideLoading 是否隐藏加载
 * @returns
 */
export async function POST<T = any | undefined>(
  url: string,
  params: any = {},
  json = false,
  isHideLoading = false
) {
  return REQ(url, params, json, isHideLoading, axios.post)
}

export async function PUT<T = any | undefined>(
  url: string,
  params: any = {},
  json = false,
  isHideLoading = true
) {
  return REQ(url, params, json, isHideLoading, axios.put)
}

export async function DELETE(
  url: string,
  params: any = {},
  json = false,
  isHideLoading = true
) {
  return REQ(url, params, json, isHideLoading, axios.delete)
}

export async function REQ<T = any | undefined>(
  url: string,
  params: any = {},
  json = false,
  isHideLoading = true,
  method:
    | (<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>
      ) => Promise<R>)
    | (<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        config?: AxiosRequestConfig<D>
      ) => Promise<R>)
) {
  if (!isHideLoading) {
    showLoading()
  }
  // json格式请求头
  const headerJSON = {
    'Content-Type': 'application/json;charset=UTF-8',
  }
  // FormData格式请求头
  const headerFormData = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
  return new Promise<CommonResult<T>>((resolve, reject) => {
    method(url, json ? JSON.stringify(params) : qs.stringify(params), {
      headers: json ? headerJSON : headerFormData,
    })
      .then((res) => {
        if (!isHideLoading) {
          hideLoading()
        }
        resolve(res.data)
      })
      .catch((err) => {
        if (!isHideLoading) {
          hideLoading()
        }
        reject(err)
      })
  })
}
/**
 * 下载文件
 * @param downloadUrl 下载链接
 * @param params 参数
 * @param isHideLoading 是否显示加载
 * @returns
 */
export function download(
  downloadUrl: string,
  params: any,
  isHideLoading = false
) {
  if (!isHideLoading) {
    showLoading()
  }
  return new Promise((resolve, reject) => {
    axios
      .post(
        downloadUrl,
        { ...params },
        {
          responseType: 'blob',
        }
      )
      .then((res) => {
        if (!isHideLoading) {
          hideLoading()
        }
        const { data, headers } = res
        const fileName = (
          headers['content-disposition'] || new Date().getTime() + ''
        ).replace(/\w+;filename=(.*)/, '$1')
        const blob = new Blob([data], { type: headers['content-type'] })
        let dom = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        dom.href = url
        dom.download = decodeURI(fileName)
        dom.style.display = 'none'
        document.body.appendChild(dom)
        dom.click()
        dom.parentNode!.removeChild(dom)
        window.URL.revokeObjectURL(url)
      })
      .catch((err) => {
        if (!isHideLoading) {
          hideLoading()
        }
        reject(err)
      })
  })
}

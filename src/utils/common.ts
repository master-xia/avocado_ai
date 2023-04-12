import { Dialog, Toast } from 'antd-mobile'
import { ExclamationCircleOutline } from 'antd-mobile-icons'
import { number } from 'yargs'
/**
 * 成功的消息
 * @param {*} msg
 */
export function successMsg(msg: string) {
  Toast.show({
    icon: 'success',
    content: msg,
  })
}
/**
 * 失败的消息
 * @param {*} msg
 */
export function errorMsg(msg: string, isToast = false) {
  if (isToast) {
    Toast.show({
      icon: 'fail',
      content: msg,
    })
  } else {
    Dialog.alert({
      title: '提示',
      content: msg,
      closeOnMaskClick: true,
    })
  }
}

let loading: any
let loadingCount = 0
/**
 * 显示加载
 */
export function showLoading() {
  loadingCount++
  if (loading !== undefined) {
    return
  }
  loading = Toast.show({
    icon: 'loading',
    content: '加载中…',
    duration: 0,
  })
}
/**
 * 关闭加载
 */
export function hideLoading() {
  loadingCount--
  if (loading && loadingCount <= 0) {
    loading.close()
    loading = undefined
  }
  if (loadingCount <= 0) {
    loadingCount = 0
  }
}
/**
 * 格式化日期
 * @param dateTime
 * @param format 默认yyyy-MM-dd hh:mm:ss
 * @returns
 */
export function formatDate(
  dateTime: string | Date,
  format = 'yyyy-MM-dd hh:mm:ss'
): string {
  const date: Date =
    typeof dateTime == 'string' ? getDateFromStr(dateTime) : dateTime
  try {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const milSecond = date.getMilliseconds()
    format = format.replace('yyyy', date.getFullYear().toString())
    format = format.replace('yy', date.getFullYear().toString().substring(2, 4))
    format = format.replace('MM', month < 10 ? '0' + month : month.toString())
    format = format.replace('dd', day < 10 ? '0' + day : day.toString())
    format = format.replace('hh', hour < 10 ? '0' + hour : hour.toString())
    format = format.replace(
      'mm',
      minute < 10 ? '0' + minute : minute.toString()
    )
    format = format.replace(
      'ss',
      second < 10 ? '0' + second : second.toString()
    )
    format = format.replace(
      'ms',
      milSecond < 10 ? '0' + milSecond : milSecond.toString()
    )
  } catch {}
  return format
}
/**
 * 将字符串转日期
 * @param dateTimeStr
 * @returns
 */
export function getDateFromStr(dateTimeStr: string): Date {
  if (dateTimeStr === '') {
    return new Date()
  }
  if (dateTimeStr.startsWith('/Date')) {
    return new Date(parseInt(dateTimeStr.substring(6, dateTimeStr.length - 2)))
  } else {
    return new Date(Date.parse(dateTimeStr))
  }
}
/**
 *将日期格式化成xx秒前
 */
export function formatDate2(dateTime: Date | string) {
  const date: Date =
    typeof dateTime == 'string' ? getDateFromStr(dateTime) : dateTime
  var mistiming = Math.round((new Date().getTime() - date.getTime()) / 1000)
  var postfix = mistiming > 0 ? '前' : '后'
  mistiming = Math.abs(mistiming)
  var arrr = ['年', '个月', '星期', '天', '小时', '分钟', '秒']
  var arrn = [31536000, 2592000, 604800, 86400, 3600, 60, 1]

  for (var i = 0; i < 7; i++) {
    var inm = Math.floor(mistiming / arrn[i])
    if (inm != 0) {
      return inm + arrr[i] + postfix
    }
  }
}
/**
 * 判断是否是数字
 * @param val
 * @returns
 */
export function isNumber(val: any) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
  if (val === '' || val === null) {
    return false
  }
  if (!isNaN(val)) {
    //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
    //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
    return true
  } else {
    return false
  }
}
/*
 * 参数说明：
 * val：要格式化的数字
 * decimals：保留几位小数
 * dec：小数点符号
 * sep：千分位符号
 * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 * */
export function formatNumber(
  val: number,
  decimals: number,
  dec: string = '.',
  sep: string = ',',
  roundtag: 'ceil' | 'floor' | 'round' = 'ceil'
): string {
  const number = (val + '').replace(/[^0-9+-Ee.]/g, '')
  roundtag = roundtag || 'ceil'
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  let toFixedFix = function (n: number, prec: number) {
    let k = Math.pow(10, prec)
    return (
      '' +
      parseFloat(
        Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)
      ) /
        k
    )
  }
  const s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
/**
 * 数字转中文
 * @param val
 * @returns
 */
export function numberToChinese(val: number | string): string {
  let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] //汉字的数字
  let cnIntRadice = ['', '拾', '佰', '仟'] //基本单位
  let cnIntUnits = ['', '万', '亿', '兆'] //对应整数部分扩展单位
  let cnDecUnits = ['角', '分', '毫', '厘'] //对应小数部分单位
  let cnInteger = '整' //整数金额时后面跟的字符
  let cnIntLast = '元' //整数完以后的单位
  //最大处理的数字
  let maxNum = 999999999999999.9999
  //输出的中文金额字符串
  let chineseStr = ''
  if (typeof val === 'string' && val === '') {
    return ''
  }
  let number: number = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(number)) {
    return 'NAN'
  }
  if (number >= maxNum) {
    return '超出最大处理数字'
  }
  if (number === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  number = Math.abs(number)
  //四舍五入保留两位小数,转换为字符串
  const numberStr = Math.round(number * 100).toString()
  const integerNum = numberStr.substring(0, numberStr.length - 2) //金额整数部分
  const decimalNum = numberStr.substring(numberStr.length - 2, numberStr.length) //金额小数部分

  //获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    let IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      let n = integerNum.substr(i, 1)
      let p = IntLen - i - 1
      let q = p / 4
      let m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        //归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  //小数部分
  if (decimalNum !== '') {
    let decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      let n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '' || /^0*$/.test(decimalNum)) {
    chineseStr += cnInteger
  }
  return chineseStr
}
/**
 * 获取两个日期相差的天数
 * @param startDate
 * @param enDate
 * @returns
 */
export function getDaysBetween(
  startDate: string | Date,
  enDate: string | Date
): number {
  let time1 = formatDate(startDate, 'yyyy/MM/dd')
  let time2 = formatDate(enDate, 'yyyy/MM/dd')
  let sDate = Date.parse(time1)
  let eDate = Date.parse(time2)
  if (sDate > eDate) {
    return 0
  }
  if (sDate === eDate) {
    return 0
  }
  const days = (eDate - sDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

/**
 * 获取cookie
 * @param name
 * @returns
 */
export function getCookie(name: string): string {
  var cookies = document.cookie
  var list = cookies.split('; ')
  for (var i = 0; i < list.length; i++) {
    var arr = list[i].split('=')
    if (arr[0] === name) {
      return decodeURIComponent(arr[1])
    }
  }
  return ''
}
/**
 * 设置cookies
 * @param cname
 * @param cvalue
 */
export function setCookie(cname: string, cvalue: string) {
  document.cookie = cname + '=' + cvalue + '; '
}
export function clearCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--; ) {
      document.cookie =
        keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() //清除当前域名下的,例如：m.kevis.com
      document.cookie =
        keys[i] +
        '=0;path=/;domain=baobte.com;expires=' +
        new Date(0).toUTCString() //清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}
/**
 * 复制文本
 * @param text
 * @param msg
 */
export function copyText(text: string, msg = '复制成功') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  } else {
    // 创建输入框
    var textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    // 隐藏此输入框
    textarea.style.position = 'absolute'
    textarea.style.clip = 'rect(0 0 0 0)'
    // 赋值
    textarea.value = text
    // 选中
    textarea.select()
    // 复制
    document.execCommand('copy', true)
  }
  if (msg) {
    successMsg(msg)
  }
}
/**
 * 获取url参数
 * @param name
 * @returns
 */
export function getQueryString(name: string) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === name) {
      return pair[1]
    }
  }
  return undefined
}
export function combineTwoList<T>(
  list1: T[],
  list2: T[],
  key: string | number
) {
  var keys = new Set<string | number>()
  var newList: T[] = []
  list1.forEach((m) => {
    var curKey = (m as any)[key]
    if (!keys.has(curKey)) {
      newList.push(m)
      keys.add(curKey)
    }
  })
  list2.forEach((m) => {
    var curKey = (m as any)[key]
    if (!keys.has(curKey)) {
      newList.push(m)
      keys.add(curKey)
    }
  })
  return newList
}
/**
 * 是否是电脑端
 * @returns
 */
export function isPC() {
  var userAgentInfo = navigator.userAgent
  console.log(navigator.userAgent)
  var Agents: string[] = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ]
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
export const isWxEnv = navigator.userAgent
  .toLowerCase()
  .includes('micromessenger')

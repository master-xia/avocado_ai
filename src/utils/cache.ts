interface WindowExtended extends Window {
  dataCache?: Map<string, any>
}
const win = window as WindowExtended
win.dataCache = new Map<string, any>()
const cache = win.dataCache
/**是否存在缓存 */
export function hasCache(key: string) {
  return cache.has(key)
}
/**
 * 设置缓存
 * @param key
 * @param data
 * @returns
 */
export function setCache(key: string, data: any) {
  return cache.set(key, data)
}
/**
 * 获取缓存
 * @param key
 * @returns
 */
export function getCache<T = any>(key: string, isDelete = true): T | undefined {
  if (!hasCache(key)) {
    return undefined
  }
  const data = cache.get(key)
  if (isDelete) {
    deleteCache(key)
  }
  return data as T
}
/**
 * 获取页面缓存的key
 * @returns
 */
export function getPageCacheKey() {
  return win.location.pathname
}
/**
 * 以当前页面url为cache的key
 * @param data
 * @returns
 */
export function setPageCache(data: any) {
  return setCache(getPageCacheKey(), data)
}
/**
 * 获取页面缓存
 * @returns
 */
export function getPageCache<T = any>(isDelete = true): T | undefined {
  return getCache<T>(getPageCacheKey(), isDelete)
}
/**
 * 是否存在页面缓存
 * @returns
 */
export function hasPageCache() {
  return hasCache(getPageCacheKey())
}
/**
 * 删除页面数据缓存
 * @returns
 */
export function deletePageCache() {
  return deleteCache(getPageCacheKey())
}
/**
 * 删除缓存
 * @param key
 * @returns
 */
export function deleteCache(key: string) {
  return cache.delete(key)
}

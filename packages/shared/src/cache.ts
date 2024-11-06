/**
 * 缓存工具类，用于缓存数据一定时间
 */
export class TimeCache {
  // 缓存数据
  protected cache: Map<string, { value: any; time: number }> = new Map()

  constructor(public clearTime: number = 1000 * 100) {
    this.clear()
  }

  /**
   * 设置缓存数据
   */
  set(key: string, value: any, time: number) {
    this.cache.set(key, { value, time: Date.now() + time })
  }

  /**
   * 获取缓存数据
   */
  get(key: string) {
    const data = this.cache.get(key)
    if (!data) return null

    // 过期删除
    if (data.time < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return data.value
  }

  /**
   * 删除缓存数据
   */
  delete(key: string) {
    this.cache.delete(key)
  }

  /**
   * 定时清理过期数据
   */
  clear() {
    setInterval(() => {
      const now = Date.now()
      this.cache.forEach((v, k) => {
        if (v.time < now) {
          this.cache.delete(k)
        }
      })
    }, this.clearTime)
  }
}

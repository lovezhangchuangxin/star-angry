// 接口返回数据格式
export interface ResponseData<T> {
  /**
   * 状态码，0 为成功，其他为失败
   */
  code: number
  /**
   * 状态消息
   */
  msg: string
  /**
   * 数据
   */
  data: T
}

// 默认请求方法为 GET, POST, PUT, DELETE
export type DafaultRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

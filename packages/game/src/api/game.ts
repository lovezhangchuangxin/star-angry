import { UserData } from '@star-angry/core'
import { req } from './req'

export class GameApi {
  /**
   * 获取我的游戏数据
   */
  static async getMyData() {
    return req<UserData | undefined>('GET', '/game/myData')
  }
}

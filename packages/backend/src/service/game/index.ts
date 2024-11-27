import { init, loop } from '@star-angry/core'
import { GameDB } from '@star-angry/db'

export default class GameService {
  /**
   * 游戏循环定时器
   */
  static loopTimerId: NodeJS.Timeout
  /**
   * 上一次游戏循环执行的时间
   */
  static lastLoopTime = Date.now()
  /**
   * 游戏循环间隔
   */
  static Tick = 1000
  /**
   * 定时器
   */
  static timerInterval = GameService.Tick

  /**
   * 获取我的游戏数据
   */
  static async getMyData(userId: string) {
    const data = await GameDB.getDB().getData()
    return data.userDataMap[userId]
  }

  /**
   * 初始化游戏数据
   */
  static async initData() {
    const data = await GameDB.getDB().getData()
    init(data.userDataMap)
    console.log('initData')
  }

  /**
   * 启动游戏循环
   */
  static startLoop = () => {
    GameService.loopTimerId = setTimeout(async () => {
      const data = await GameDB.getDB().getData()
      try {
        if (Date.now() - GameService.lastLoopTime > GameService.Tick / 3) {
          loop(data.userDataMap)
          GameService.timerInterval = Math.max(
            GameService.Tick / 3,
            2 * GameService.Tick - (Date.now() - GameService.lastLoopTime),
            GameService.Tick,
          )
          // console.log('Tick: ', Date.now() - GameService.lastLoopTime)
          // console.log('GameService.timerInterval', GameService.timerInterval)
          GameService.lastLoopTime = Date.now()
        }
      } finally {
        GameService.startLoop()
      }
    }, GameService.timerInterval)
  }

  /**
   * 停止游戏循环
   */
  static stopLoop = () => {
    clearTimeout(GameService.loopTimerId)
  }
}

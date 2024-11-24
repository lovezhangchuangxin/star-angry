import { UserModel } from '@star-angry/db'
import { Context } from 'koa'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import GameService from '../../service/game'

export default class GameController {
  /**
   * 获取我的数据
   */
  static async getMyData(ctx: Context) {
    const { id } = (ctx.state.user?.data || {}) as UserModel
    if (!id) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }
    ctx.body = await GameService.getMyData(id)
  }
}

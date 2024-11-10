import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import StructureService from '../../service/structure'
import { UserModel } from '@star-angry/db'
import { Context, Next } from 'koa'

export default class StructureController {
  /**
   * 获取建筑
   */
  static async getStructures(ctx: Context) {
    const { id } = (ctx.state.user?.data || {}) as UserModel
    if (!id) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }
    ctx.body = await StructureService.getStructures(id)
  }
}

import { processor } from '../../../../core/src'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import { GameDB } from '@star-angry/db'

export default class StructureService {
  /**
   * 添加操作
   */
  static async addOperation(params: {
    userId: string
    planetId: string
    structureId: string
    operation: string
  }) {
    const { userId, planetId, structureId, operation } = params
    const data = await GameDB.getDB().getData()
    const userDataMap = data.userDataMap
    const userData = userDataMap[userId]
    if (!userData) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    return processor(params, userDataMap)
  }
}

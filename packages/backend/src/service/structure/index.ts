import { processor, StructureOperationParams } from '@star-angry/core'
import { GameDB } from '@star-angry/db'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'

export default class StructureService {
  /**
   * 添加操作
   */
  static async addOperation(params: StructureOperationParams) {
    const { userId } = params
    const data = await GameDB.getDB().getData()
    const userDataMap = data.userDataMap
    const userData = userDataMap[userId]
    if (!userData) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    return processor(params, userDataMap)
  }
}

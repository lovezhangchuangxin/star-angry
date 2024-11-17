import { processor } from '@star-angry/core'
import { GameDB } from '@star-angry/db'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'

export default class StructureService {
  /**
   * 获取建筑
   */
  static async getStructures(userId: string) {
    const data = await GameDB.getDB().getData()

    const userData = data.userData[userId]
    if (!userData) {
      return {}
    }
    Object.values(userData.structures).forEach(async (structure) => {
      if ('update' in structure) {
        await StructureService.addIntent(userId, structure.id, 'update')
      }
    })

    return userData.structures
  }

  /**
   * 添加意图
   */
  static async addIntent(userId: string, id: string, type: string) {
    const data = await GameDB.getDB().getData()
    const userData = data.userData[userId]
    if (!userData) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    const getUserObject = (userId: string, objectId?: string) => {
      const userData = data.userData[userId]
      if (!userData) {
        return []
      }
      if (!objectId) {
        return Object.values(userData.structure)
      }
      let object =
        userData.structure[objectId as keyof typeof userData.structure]
      if (!object) {
        object = userData.structure[
          objectId as keyof typeof userData.structure
        ] = new structuresMap[objectId as keyof typeof structuresMap]() as any
      }
      return [object!]
    }
    return processor({ objectId: id, type }, userId, getUserObject)
  }
}

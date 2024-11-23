import { processor, Structure, structuresMap } from '../../../../core/src'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import { GameDB } from '@star-angry/db'

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
    return userData.structure
  }

  /**
   * 添加意图
   */
  static async addIntent(
    userId: string,
    id: string,
    type: string,
    structureMap?: any,
  ) {
    const data = await GameDB.getDB().getData()
    const userData = data.userData[userId]
    if (!userData) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }
    if (!structureMap) {
      structureMap = await StructureService.getStructures(userId)
    }

    let object = userData.structure[id as keyof typeof userData.structure]
    if (!object) {
      object = userData.structure[id as keyof typeof userData.structure] =
        new structuresMap[id as keyof typeof structuresMap]() as any
    }
    return processor({ objectId: id, type }, structureMap)
  }

  /**
   * 执行意图
   */
  static intentTimer: NodeJS.Timeout
  static execIntent = () => {
    const timer: NodeJS.Timeout = setInterval(async () => {
      if (StructureService.intentTimer != timer) {
        clearInterval(timer)
        console.log('终止运行')
        return
      }
      const data = await GameDB.getDB().getData()
      data.user.forEach(({ id }) => {
        const userData = data.userData[id]
        if (!userData) {
          return {}
        }
        // 少于 900ms 不执行建筑意图更新
        if (Date.now() - userData.updateTime > 900) {
          // 过滤掉异常实例化的对象
          const structures = Object.values(userData.structure).filter(
            (structure) => structure instanceof Structure,
          )
          // 更新电力使用情况
          const solarPlant = userData.structure.solarPlant
          solarPlant?.calcUsed(structures)
          solarPlant?.calcProd(structures)
          structures.forEach(async (structure) => {
            if ('update' in structure) {
              await StructureService.addIntent(
                id,
                structure.id,
                'update',
                userData.structure,
              )
            }
          })
          userData.updateTime = Date.now()
        }
      })
    }, 1000)
    StructureService.intentTimer = timer
  }
}

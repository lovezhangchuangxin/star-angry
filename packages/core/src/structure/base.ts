import { isResourceEnough } from '../utils/planet'
import { StructureOperationObject } from '../utils/types'

/**
 * 建筑基础操作
 */
export const StructureBaseOperation: StructureOperationObject = {
  /**
   * 初始化
   */
  _init(params, data, _, planetData) {
    const { structureId } = params
    if (data?.level === undefined) {
      planetData.structures[structureId] = { id: structureId, level: 0 } as any
      return true
    }
    return false
  },

  /**
   * 升级
   */
  upgrade(_, data, structureConfigs, planetData) {
    const config = structureConfigs[data.id]

    // 是否已经是最大等级
    if (config.maxLevel && data.level >= config.maxLevel) {
      return false
    }

    // 获取升级依赖的前置建筑
    const preStructure = config.preDepend
    // 检查这些建筑的等级是否满足
    if (preStructure) {
      for (const [id, level] of Object.entries(preStructure)) {
        if (planetData.structures[id].level < level) {
          return false
        }
      }
    }

    // 获取升级所需资源
    const cost = config.getUpgradeCost(data.level)
    // 检查资源是否足够并扣除资源
    if (!isResourceEnough(planetData.resources, cost, true)) {
      return false
    }

    // 升级建筑
    data.level++

    return true
  },
}

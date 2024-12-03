import { isResourceEnough, StructureOperationObject } from '../utils'
import { StructureBaseOperation } from './base'
import { DefenseData } from './types'

/**
 * 防御设施建筑操作
 */
export const DefenseOperation: StructureOperationObject = {
  /**
   * 初始化
   */
  _init(_, data, structureConfigs, planetData) {
    if (!StructureBaseOperation._init(_, data, structureConfigs, planetData)) {
      return false
    }
    return true
  },

  /**
   * 建造
   */
  build(params, data, structureConfigs, planetData) {
    const config = structureConfigs[data.id]
    // 想要建造的数量
    const require = Math.floor(params.data?.require)
    if (typeof require !== 'number' || require < 1 || !isFinite(require)) {
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

    // 获取建造所需资源
    const cost = config.getUpgradeCost(data.level)
    Object.keys(cost).forEach((key) => {
      cost[key as keyof typeof cost]! *= require
    })

    // 检查资源是否足够并扣除资源
    if (!isResourceEnough(planetData.resources, cost, true)) {
      return false
    }

    // 更新数量
    const defenseData = data as DefenseData
    defenseData.amount = (defenseData.amount || 0) + require

    return true
  },
}

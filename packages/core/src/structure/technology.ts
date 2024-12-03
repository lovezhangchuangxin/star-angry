import { StructureOperationObject } from '../utils'
import { StructureBaseOperation } from './base'

/**
 * 科技类型建筑操作
 */
export const TechnologyOperation: StructureOperationObject = {
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
   * 升级
   */
  upgrade(_, data, structureConfigs, planetData) {
    if (
      !StructureBaseOperation.upgrade(_, data, structureConfigs, planetData)
    ) {
      return false
    }
    return true
  },
}

import { StructureOperationObject } from '../utils'
import { StructureBaseOperation } from './base'
import { StorageConfig } from './types'

/**
 * 存储类型建筑操作
 */
export const StorageOperation: StructureOperationObject = {
  /**
   * 初始化
   */
  _init(params, data, structureConfigs, planetData, userDataMap) {
    if (
      !StructureBaseOperation._init(
        params,
        data,
        structureConfigs,
        planetData,
        userDataMap,
      )
    ) {
      return false
    }

    // 更新星球资源容量
    const { structureId } = params
    const config = structureConfigs[structureId] as StorageConfig
    const resource = config.resource
    const capacity = config.capacity(0)
    planetData.resources[resource] = { amount: 2000, capacity }

    return true
  },

  /**
   * 升级
   */
  upgrade(_, data, structureConfigs, planetData, userDataMap) {
    if (
      !StructureBaseOperation.upgrade(
        _,
        data,
        structureConfigs,
        planetData,
        userDataMap,
      )
    ) {
      return false
    }

    // 升级成功，更新星球资源容量
    const config = structureConfigs[data.id] as StorageConfig
    const resource = config.resource
    const capacity = config.capacity(data.level)
    planetData.resources[resource]!.capacity = capacity

    return true
  },
}

import { StructureOperationObject } from '../utils/types'
import { StructureBaseOperation } from './base'
import { StorageConfig } from './types'

/**
 * 存储类型建筑操作
 */
export const StorageOperation: StructureOperationObject = {
  /**
   * 升级
   */
  upgrade(_, data, structureConfigs, planetData) {
    if (
      !StructureBaseOperation.upgrade(_, data, structureConfigs, planetData)
    ) {
      return false
    }

    // 升级成功，更新星球资源容量
    const config = structureConfigs[data.id] as StorageConfig
    const resource = config.resource
    const capacity = config.capacity(data.level)
    const resourceConfig = planetData.resources[resource]
    if (!resourceConfig) {
      planetData.resources[resource] = { amount: 0, capacity }
    } else {
      resourceConfig.capacity = capacity
    }

    return true
  },
}

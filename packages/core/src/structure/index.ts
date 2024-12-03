import { StructureConfigs } from '../config'
import { StructureOperationObject } from '../utils/types'
import { ProducerOperation } from './producer'
import { StorageOperation } from './storage'
import { TechnologyOperation } from './technology'
import { StructureType } from './types'

export * from './types'

export const StructureOperationMap: {
  [type in StructureType]: StructureOperationObject
} = {
  storage: StorageOperation,
  producer: ProducerOperation,
  technology: TechnologyOperation,
}

/**
 * 获取建筑操作处理函数
 *
 * @param id 建筑 id
 * @param operation 操作类型
 */
export const getOperationHandler = (id: string, operation: string) => {
  const config = StructureConfigs[id]
  if (!config) {
    return
  }

  return StructureOperationMap[config.type][operation]
}

import { InstantResource, ResourceType } from '../config/resource'
import { StructureOperationObject } from '../utils/types'
import { StructureBaseOperation } from './base'
import { ProducerConfig, ProducerData } from './types'

/**
 * 生产类型建筑操作
 */
export const ProducerOperation: StructureOperationObject = {
  /**
   * 更新
   */
  _update(_, data, structureConfigs, planetData) {
    return ProducerOperation._produce(_, data, structureConfigs, planetData)
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

    // 升级成功，更新资源产量和消耗
    const config = structureConfigs[data.id] as ProducerConfig
    const produceSpeed = config.getProduceSpeed?.(data.level) ?? {}
    const consumeSpeed = config.getConsumeSpeed?.(data.level) ?? {}
    const structureData = data as ProducerData
    structureData.produceSpeed = produceSpeed
    structureData.consumeSpeed = consumeSpeed

    return true
  },

  /**
   * 生产资源
   */
  _produce(_, data, __, planetData) {
    const structureData = data as ProducerData
    const produceSpeed = structureData.produceSpeed
    const consumeSpeed = structureData.consumeSpeed
    const deltaTime = Date.now() - structureData.lastUpdateTime
    structureData.lastUpdateTime = Date.now()
    const percent = deltaTime / 1000

    // 先消耗资源
    for (const [type, speed] of Object.entries(consumeSpeed)) {
      const resourceData = planetData.resources[type as ResourceType]
      // 对于如电能这样的瞬时资源，不需要乘以时间系数
      const cost = speed * (InstantResource[type as ResourceType] ? 1 : percent)
      // 资源不足，无法生产
      if (!resourceData || resourceData.amount < cost) {
        return false
      }
      resourceData.amount = Math.max(Math.ceil(resourceData.amount - cost), 0)
    }

    // 再生产资源
    for (const [type, speed] of Object.entries(produceSpeed)) {
      const resourceData = planetData.resources[type as ResourceType]
      // 没有就创建
      if (!resourceData) {
        planetData.resources[type as ResourceType] = {
          amount: 0,
          capacity: 0,
        }
      } else {
        // 对于如电能这样的瞬时资源，容量和存储量都要加上，且不需要乘以时间系数
        if (InstantResource[type as ResourceType]) {
          // console.log('增加电能：', Math.floor(speed * percent))
          // console.log('当前电能：', resourceData.amount)
          // console.log('容量：', resourceData.capacity)

          resourceData.capacity = resourceData.capacity + Math.floor(speed)
          resourceData.amount = resourceData.amount + Math.floor(speed)
        } else {
          resourceData.amount = Math.min(
            Math.floor(resourceData.amount + speed * percent),
            resourceData.capacity,
          )
        }
      }
    }

    return true
  },
}

import { ResourceType } from '../config/resource'
import { isStorageFull } from '../utils'
import { StructureOperationObject } from '../utils/types'
import { StructureBaseOperation } from './base'
import { ProducerConfig, ProducerData } from './types'

/**
 * 生产类型建筑操作
 */
export const ProducerOperation: StructureOperationObject = {
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
  _produce(params = {}, data, __, planetData) {
    const structureData = data as ProducerData
    const now = Date.now()
    const deltaTime = now - (structureData.lastUpdateTime ?? now)
    structureData.lastUpdateTime = now

    // 暂停生产
    if (structureData.pause) {
      return false
    }

    const produceSpeed = structureData.produceSpeed
    const consumeSpeed = structureData.consumeSpeed
    const percent = deltaTime / 1000

    // 是否消耗电能
    const needElectricity = !!consumeSpeed.electricity
    // 第 0 项表示消耗的资源，第 1 项表示生产的资源
    const changeResources = (params.changeResources = [{}, {}] as {
      [key in ResourceType]?: number
    }[])

    // 检查仓库是否都满了
    if (
      isStorageFull(
        planetData.resources,
        Object.keys(produceSpeed).filter(
          (type) => type !== ResourceType.Electricity,
        ) as ResourceType[],
      )
    ) {
      return false
    }

    // 先消耗资源
    for (const [type, speed] of Object.entries(consumeSpeed)) {
      const isElectricity = type === ResourceType.Electricity
      const resourceData = planetData.resources[type as ResourceType]
      const cost = Math.ceil(speed * (isElectricity ? 1 : percent))
      // 资源不足，无法生产，先不考虑电能够不够
      if (!resourceData || (!isElectricity && resourceData.amount < cost)) {
        return false
      }
      resourceData.amount -= cost
      // 记录消耗的资源
      if (needElectricity && !isElectricity) {
        changeResources[0][type as ResourceType] = cost
      }
    }

    // 再生产资源
    for (const [type, speed] of Object.entries(produceSpeed)) {
      const isElectricity = type === ResourceType.Electricity
      const resourceData = planetData.resources[type as ResourceType]
      const produce = Math.floor(speed * (isElectricity ? 1 : percent))
      if (!resourceData) {
        // 正常不可能走到这个分支，因为所有的资源一开始就会初始化
        return false
      } else {
        // 如果是电能，加上容量上
        resourceData[isElectricity ? 'capacity' : 'amount'] += produce
        // 记录生产的资源
        if (needElectricity && !isElectricity) {
          changeResources[1][type as ResourceType] = produce
        }
      }
    }

    return true
  },

  /**
   * 切换暂停状态
   */
  togglePause(_, data) {
    const structureData = data as ProducerData
    structureData.pause = !structureData.pause
    return true
  },
}

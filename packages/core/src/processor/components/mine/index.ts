import { MineComponent } from '../../../components/mine'
import { HandlerFuncType } from '../../types'
import { ResourceType } from '../../../constant'
import { StoreComponent } from '../../../components'
import { LevelComponent } from '../../../components/level'

/**
 * 挖矿
 */
const mine: HandlerFuncType<any, MineComponent> = (
  intent,
  component,
  structure,
  getUserStructures,
) => {
  const { userId } = intent
  const { mineSpeed, getMineSpeedByLevel } = component.defaultConfig
  const { mineStartTime } = component.config

  // 计算已经挖到的资源
  const time = Date.now() - mineStartTime
  const levelComp = structure.components.level as LevelComponent | undefined
  const resources = Object.keys(
    levelComp && getMineSpeedByLevel
      ? getMineSpeedByLevel(levelComp.config.level)
      : mineSpeed,
  ).reduce(
    (acc, resourceType) => {
      const speed = mineSpeed[resourceType as ResourceType]!
      acc[resourceType as ResourceType] = Math.floor((time * speed) / 1000)
      return acc
    },
    {} as Record<ResourceType, number>,
  )

  // 添加资源
  const structureWithStore = Object.values(getUserStructures(userId)).filter(
    (s) => {
      !!s.components.store
    },
  )

  for (const resourceType in resources) {
    const type = resourceType as ResourceType
    let amount = resources[type]!
    for (const s of structureWithStore) {
      const storeComp = s.components.store as StoreComponent
      const levelComp = s.components.level as LevelComponent | undefined
      const { storeTypes, getCapacityByLevel } = storeComp.defaultConfig
      if (storeTypes && !storeTypes.includes(type)) {
        continue
      }

      const capacity =
        getCapacityByLevel && levelComp
          ? getCapacityByLevel(levelComp.config.level)
          : storeComp.defaultConfig.capacity
      const space = capacity - storeComp.total
      if (space <= 0) {
        continue
      }

      const addedAmount = Math.min(space, amount)
      storeComp.config.store[type] =
        (storeComp.config.store[type] || 0) + addedAmount
      amount -= addedAmount
      if (amount <= 0) {
        break
      }
    }
  }

  // 更新时间
  component.config.mineStartTime = Date.now()

  return true
}

export default {} as Record<string, HandlerFuncType<any, any>>

import { ComponentIds } from '../../config'
import {
  createEventHandlerMap,
  GameEventHandler,
  GameEventModel,
} from '../../event/types'
import { ResourceMap } from '../../utils/types'
import { LevelCompData } from '../level'
import { MineCompConfig, MineCompData } from './types'

/**
 * 挖矿
 */
const mine: GameEventHandler = (event: GameEventModel) => {
  const {
    _userId,
    _planetId,
    _structureId,
    _componentId,
    _structureConfigs,
    _gameData,
  } = event.data
  const planetData = _gameData[_userId][_planetId]
  const structures = planetData.structures
  const mineCompData = structures[_structureId].components[
    _componentId
  ] as MineCompData

  const { mineSpeed, getMineSpeedByLevel } = _structureConfigs[_structureId]
    .componentConfig[_componentId] as MineCompConfig
  const { mineStartTime } = mineCompData

  // 计算已经挖到的资源
  const time = Date.now() - mineStartTime
  const levelCompData = structures[_structureId].components[
    ComponentIds.Level
  ] as LevelCompData | undefined
  const addResources = Object.keys(
    levelCompData && getMineSpeedByLevel
      ? getMineSpeedByLevel(levelCompData.level)
      : mineSpeed,
  ).reduce((acc, resourceId) => {
    const speed = mineSpeed[resourceId]
    acc[resourceId] = Math.floor((time * speed) / 1000)
    return acc
  }, {} as ResourceMap)

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

export const mineGameEventHandlers = createEventHandlerMap({
  mine,
})

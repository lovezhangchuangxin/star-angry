import { ComponentIds } from '../../config'
import {
  createEventHandlerMap,
  GameEventHandler,
  GameEventModel,
} from '../../event/types'
import { checkResource } from '../../utils/utils'
import { LevelCompConfig, LevelCompData } from './types'

/**
 * 升级
 */
const upgrade: GameEventHandler = (event: GameEventModel) => {
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
  const levelCompData = structures[_structureId].components[
    _componentId
  ] as LevelCompData
  const { level, upgradeStartTime } = levelCompData
  const { maxLevel, calcUpgradeRequire } = _structureConfigs[_structureId]
    .componentConfig[_componentId] as LevelCompConfig

  // 已经是最大等级或者正在升级中，则无法升级
  if (level >= maxLevel || upgradeStartTime) {
    return
  }

  // 获取升级所需条件
  const { resources: requireResources, preStructureLevel } =
    calcUpgradeRequire(level)

  // 检查前置建筑等级是否满足
  if (preStructureLevel) {
    for (const structureId in preStructureLevel) {
      const structure = structures[+structureId]
      const levelComp = structure?.components[
        ComponentIds.Level
      ] as LevelCompData
      if (!levelComp || levelComp.level < preStructureLevel[structureId]) {
        return
      }
    }
  }

  // 检查资源是否满足
  const resources = planetData.resources
  if (!checkResource(resources, requireResources)) {
    return
  }

  // 开始升级
  levelCompData.upgradeStartTime = Date.now()

  return true
}

export const levelGameEventHandlers = createEventHandlerMap('level', {
  upgrade,
})

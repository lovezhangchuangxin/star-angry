import { StoreComponent } from '../../../components'
import { LevelComponent } from '../../../components/level'
import { HandlerFuncType } from '../../types'
import { ResourceType } from '../../../constant'

/**
 * 升级
 */
const upgrade: HandlerFuncType<any, LevelComponent> = (
  intent,
  component,
  _structure,
  getUserStructures,
) => {
  const { userId } = intent
  const { maxLevel, calcUpgradeRequire } = component.defaultConfig
  const { level, upgradeStartTime } = component.config

  // 已经是最大等级或者正在升级中，则无法升级
  if (level >= maxLevel || upgradeStartTime) {
    return false
  }

  // 获取升级所需条件
  const { resources, preStructureLevel } = calcUpgradeRequire(level)

  // 检查前置建筑等级是否满足
  if (preStructureLevel) {
    const structures = getUserStructures(userId)
    for (const name in preStructureLevel) {
      const structure = structures[name]
      const levelComp = structure?.components.level as LevelComponent
      if (!levelComp || levelComp.config.level < preStructureLevel[name]!) {
        return false
      }
    }
  }

  // 检查资源是否满足
  const structureWithStore = Object.values(getUserStructures(userId)).filter(
    (s) => {
      !!s.components.store
    },
  )
  // 先遍历一遍看资源是否足够
  for (const resourceType in resources) {
    const requireAmount = resources[resourceType as ResourceType]!
    let hasAmount = 0
    for (const s of structureWithStore) {
      const storeComp = s.components.store as StoreComponent
      hasAmount += storeComp.config.store[resourceType as ResourceType] || 0
    }
    if (hasAmount < requireAmount) {
      return false
    }
  }

  // 再遍历一遍扣除资源
  for (const resourceType in resources) {
    let requireAmount = resources[resourceType as ResourceType]!
    for (const s of structureWithStore) {
      const storeComp = s.components.store as StoreComponent
      const store = storeComp.config.store
      const hasAmount = store[resourceType as ResourceType] || 0
      if (hasAmount >= requireAmount) {
        store[resourceType as ResourceType] = hasAmount - requireAmount
        break
      } else {
        store[resourceType as ResourceType] = 0
        requireAmount -= hasAmount
      }
    }
  }

  // 开始升级
  component.config.upgradeStartTime = Date.now()

  return true
}

export default {
  upgrade,
} as Record<string, HandlerFuncType<any, any>>

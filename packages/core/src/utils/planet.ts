import { ResourceType } from '../config/resource'
import { PlanetResource } from './types'

/**
 * 判断星球的资源是否满足，满足则扣除资源并返回 true，否则返回 false
 *
 * @param planetResource 星球资源
 * @param resources 资源消耗
 * @param reduce 是否扣除资源
 */
export function isResourceEnough(
  planetResource: PlanetResource,
  resources: Partial<Record<ResourceType, number>>,
  reduce?: boolean,
): boolean {
  for (const [type, value] of Object.entries(resources)) {
    if ((planetResource[type as ResourceType]?.amount || 0) < value) {
      return false
    }
  }

  if (reduce) {
    for (const [type, value] of Object.entries(resources)) {
      planetResource[type as ResourceType]!.amount -= value
    }
  }

  return true
}

/**
 * 检查要生产的资源所在仓库是否都满了
 */
export function isStorageFull(
  planetResource: PlanetResource,
  resources: ResourceType[],
) {
  if (!resources.length) return false

  return resources.every((type) => {
    const resource = planetResource[type]
    return resource && resource.amount >= resource.capacity
  })
}

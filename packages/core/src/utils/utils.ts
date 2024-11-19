import { ResourceMap } from './types'

/**
 * 判断当前资源能否满足，能则扣除资源并返回 true，否则返回 false
 */
export function checkResource(
  resources: ResourceMap,
  requireResources: ResourceMap,
): boolean {
  for (const resourceId in requireResources) {
    const requireAmount = requireResources[resourceId]!
    // 资源不存在或者数量不足
    if (!resources[resourceId] || resources[resourceId] < requireAmount) {
      return false
    }
  }

  reduceResource(resources, requireResources)

  return true
}

/**
 * 增加资源
 */
export function addResource(resources: ResourceMap, addResources: ResourceMap) {
  for (const resourceId in addResources) {
    const addAmount = addResources[resourceId]
    resources[resourceId] = (resources[resourceId] || 0) + addAmount
  }
}

/**
 * 减少资源
 */
export function reduceResource(
  resources: ResourceMap,
  reduceResources: ResourceMap,
) {
  for (const resourceId in reduceResources) {
    const reduceAmount = reduceResources[resourceId]
    resources[resourceId] = Math.max(
      (resources[resourceId] || 0) - reduceAmount,
      0,
    )
  }
}

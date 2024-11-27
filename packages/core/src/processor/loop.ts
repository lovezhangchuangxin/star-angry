import { ResourceType, StructureConfigs } from '../config'
import { ProducerData, StructureOperationMap } from '../structure'
import { PlanetData, ResourceNumberMap, UserDataMap } from '../utils'

/**
 * 游戏循环
 */
export const loop = (userDataMap: UserDataMap) => {
  Object.values(userDataMap).forEach((user) => {
    Object.values(user.planets).forEach((planet) => {
      // 建筑生产
      produce(planet)
    })
  })
}

/**
 * 建筑生产
 */
const produce = (planet: PlanetData) => {
  // 每 Tick 开始先把电能置为 0，后续再加上建筑的电能产出
  planet.resources.electricity = {
    amount: 0,
    capacity: 0,
  }

  // 按优先级处理建筑
  const structureIds = Object.keys(planet.structures)
  structureIds.sort((a, b) => {
    return (
      (StructureConfigs[a].priority ?? 1000) -
      (StructureConfigs[b].priority ?? 1000)
    )
  })

  const changeResourcesList: [ResourceNumberMap, ResourceNumberMap][] = []
  // 调用建筑的 _update 方法
  structureIds
    .map((id) => planet.structures[id])
    .forEach((structure) => {
      const operationObject =
        StructureOperationMap[StructureConfigs[structure.id]?.type]
      if (
        operationObject &&
        '_update' in operationObject &&
        structure.level >= 1
      ) {
        const params = { changeResources: [] }
        const result = operationObject._update(
          params,
          structure,
          StructureConfigs,
          planet,
        )
        if (result && (structure as ProducerData).consumeSpeed?.electricity) {
          changeResourcesList.push(params.changeResources as any)
        }
      }
    })

  // 计算耗电建筑总的资源消耗和生产
  const resouceChangeMap = changeResourcesList.reduce((prev, curr) => {
    Object.keys(curr[0]).forEach((type) => {
      const resourceType = type as ResourceType
      prev[resourceType] = (prev[resourceType] ?? 0) - curr[0][resourceType]!
    })
    Object.keys(curr[1]).forEach((type) => {
      const resourceType = type as ResourceType
      prev[resourceType] = (prev[resourceType] ?? 0) + curr[1][resourceType]!
    })
    return prev
  }, {} as ResourceNumberMap)

  // 电力不足时，所有需要电能的建筑不能以最大功率生产
  // 必须要减小生产的速度，真实速度占额定速度的比例为
  const { amount, capacity } = planet.resources.electricity
  const electricityConsume = -amount
  const electricityProduce = capacity
  const rate =
    electricityConsume <= 0
      ? 1
      : Math.min(electricityProduce / electricityConsume, 1)

  // 更新资源
  Object.entries(resouceChangeMap).forEach(([type, amount]) => {
    planet.resources[type as ResourceType]!.amount -= Math.floor(
      amount * (1 - rate),
    )
  })
}

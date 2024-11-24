import { StructureConfigs } from '../config'
import { StructureOperationMap } from '../structure'
import { UserDataMap } from '../utils'

/**
 * 游戏循环
 */
export const loop = (userDataMap: UserDataMap) => {
  Object.values(userDataMap).forEach((user) => {
    Object.values(user.planets).forEach((planet) => {
      // 每 Tick 开始先把电能置为 0，后续再加上建筑的电能产出
      planet.resources.electricity = {
        amount: 0,
        capacity: 0,
      }

      const structureIds = Object.keys(planet.structures)
      structureIds.sort((a, b) => {
        return (
          (StructureConfigs[a].priority ?? 1000) -
          (StructureConfigs[b].priority ?? 1000)
        )
      })
      structureIds
        .map((id) => planet.structures[id])
        .forEach((structure) => {
          const operationObject =
            StructureOperationMap[StructureConfigs[structure.id]?.type]
          if (operationObject && '_update' in operationObject) {
            operationObject._update({}, structure, StructureConfigs, planet)
          }
        })
    })
  })
}

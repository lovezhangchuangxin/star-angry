import { ResourceType, StructureConfigs } from '../config'
import { ProducerData, StructureOperationMap } from '../structure'
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

      // 按优先级处理建筑
      const structureIds = Object.keys(planet.structures)
      structureIds.sort((a, b) => {
        return (
          (StructureConfigs[a].priority ?? 1000) -
          (StructureConfigs[b].priority ?? 1000)
        )
      })

      // 先算总的电力产出和消耗
      let totalProduce = 0,
        totalConsume = 0
      structureIds
        .map((id) => planet.structures[id])
        .forEach((structure) => {
          const structureConfig = StructureConfigs[structure.id]
          if (structureConfig.type !== 'producer') {
            return
          }

          // 生产和消耗与电能无关的建筑不计算
          if (
            !(structure as ProducerData).produceSpeed.electricity &&
            !(structure as ProducerData).consumeSpeed.electricity
          ) {
            return
          }

          const deltaTime = Date.now() - structure.lastUpdateTime
          structure.lastUpdateTime = Date.now()
          const percent = deltaTime / 1000

          const consumeSpeed = (structure as ProducerData).consumeSpeed
          for (const [type, speed] of Object.entries(consumeSpeed)) {
            // TODO: 只考虑电能有一点问题，暂时先这样算了
            if (type === 'electricity') {
              continue
            }
            const resourceData = planet.resources[type as ResourceType]
            const cost = speed * percent
            // 资源不足，无法生产
            if (!resourceData || resourceData.amount < cost) {
              return
            }
          }

          // 此时可以生产
          totalProduce +=
            (structure as ProducerData).produceSpeed.electricity ?? 0
          totalConsume +=
            (structure as ProducerData).consumeSpeed.electricity ?? 0
        })

      // 电力不足时，所有需要电能的建筑不能以最大功率生产
      // 必须要减小生产的速度，真实功率占额定功率的比例为
      const rate =
        totalConsume <= 0 ? 1 : Math.min(totalProduce / totalConsume, 1)

      // 调用建筑的 _update 方法
      structureIds
        .map((id) => planet.structures[id])
        .forEach((structure) => {
          const operationObject =
            StructureOperationMap[StructureConfigs[structure.id]?.type]
          if (operationObject && '_update' in operationObject) {
            operationObject._update(
              { rate },
              structure,
              StructureConfigs,
              planet,
            )
          }
        })
    })
  })
}

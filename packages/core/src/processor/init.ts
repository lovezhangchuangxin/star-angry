import { StructureConfigs } from '../config'
import { StructureOperationMap } from '../structure'
import { PlanetData, UserDataMap } from '../utils'

/**
 * 初始化游戏数据
 */
export const init = (userDataMap: UserDataMap) => {
  Object.values(userDataMap).forEach((user) => {
    Object.values(user.planets).forEach((planet) => {
      initPlanetData(planet, userDataMap)
    })
  })
}

/**
 * 获取星球基础数据
 */
export const getPlanetBaseData = (planetId: string): PlanetData => {
  return {
    id: planetId,
    name: `星球${planetId}`,
    level: 1,
    speed: 0,
    structures: {},
    resources: {},
    position: [0, 0],
  }
}

/**
 * 初始化星球
 */
export const initPlanetData = (
  planet: PlanetData,
  userDataMap: UserDataMap,
) => {
  // 初始化建筑
  const structureIds = Object.keys(StructureConfigs)
  structureIds.forEach((structureId) => {
    const structureData = planet.structures[structureId]
    if (structureData) {
      return
    }
    const operationObject =
      StructureOperationMap[StructureConfigs[structureId]?.type]
    if (operationObject && '_init' in operationObject) {
      operationObject._init(
        { structureId },
        {} as any,
        StructureConfigs,
        planet,
        userDataMap,
      )
    }
  })
}

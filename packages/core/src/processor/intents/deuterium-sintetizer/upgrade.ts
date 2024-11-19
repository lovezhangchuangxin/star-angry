import {
  DeuteriumSintetizer,
  EnergyStorage,
  MetalStorage,
  SolarPlant,
  StructureType,
} from '../../../structure'

export const upgrade = (
  object: DeuteriumSintetizer,
  planetObjects: StructureType[],
) => {
  // 找到仓库
  const energyStorage = planetObjects.find((o) => o instanceof EnergyStorage)
  const metalStorage = planetObjects.find((o) => o instanceof MetalStorage)
  if (!energyStorage || !metalStorage) {
    return false
  }

  // 获取升级所需资源
  const cost = object.calcUpgradeCost(object.level)
  if (energyStorage.store < cost.energy || metalStorage.store < cost.metal) {
    return false
  }

  // 更新资源
  if (object.upgrade()) {
    energyStorage.addStore(-cost.energy)
    metalStorage.addStore(-cost.metal)

    // 计算用电量
    const solarPlant = planetObjects.find((o) => o instanceof SolarPlant)
    solarPlant?.calcUsed(planetObjects)
    return true
  }

  return false
}

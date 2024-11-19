import {
  DeuteriumStorage,
  EnergyStorage,
  FusionPlant,
  MetalStorage,
  StructureType,
} from '../../../structure'

export const upgrade = (
  object: FusionPlant,
  planetObjects: StructureType[],
) => {
  // 找到仓库
  const energyStorage = planetObjects.find((o) => o instanceof EnergyStorage)
  const metalStorage = planetObjects.find((o) => o instanceof MetalStorage)
  const deuteriumStorage = planetObjects.find(
    (o) => o instanceof DeuteriumStorage,
  )
  if (!energyStorage || !metalStorage || !deuteriumStorage) {
    return false
  }

  // 获取升级所需资源
  const cost = object.calcUpgradeCost(object.level)
  if (
    energyStorage.store < cost.energy ||
    metalStorage.store < cost.metal ||
    deuteriumStorage.store < cost.deuterium
  ) {
    return false
  }

  // 更新资源
  if (object.upgrade()) {
    energyStorage.addStore(-cost.energy)
    metalStorage.addStore(-cost.metal)
    deuteriumStorage.addStore(-cost.deuterium)
    return true
  }

  return false
}

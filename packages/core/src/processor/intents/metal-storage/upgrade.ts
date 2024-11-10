import { EnergyStorage, MetalStorage, StructureType } from '../../../structure'

export const upgrade = (
  object: MetalStorage,
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
    return true
  }

  return false
}

import {
  EnergyMine,
  EnergyStorage,
  SolarPlant,
  StructureType,
} from '../../../structure'

export const mine = (object: EnergyMine, planetObjects: StructureType[]) => {
  // 找到仓库
  const storage = planetObjects.find((o) => o instanceof EnergyStorage)

  if (!storage) {
    return false
  }
  // 电量因素
  const solarPlant = planetObjects.find((o) => o instanceof SolarPlant)
  // 更新资源
  const output = object.update(solarPlant?.calcProdLevel())
  storage.addStore(output)
  return true
}

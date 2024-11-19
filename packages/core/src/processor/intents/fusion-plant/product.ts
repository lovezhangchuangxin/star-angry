import {
  DeuteriumStorage,
  FusionPlant,
  StructureType,
} from '../../../structure'

export const product = (
  object: FusionPlant,
  planetObjects: StructureType[],
) => {
  // 找到仓库
  const storage = planetObjects.find((o) => o instanceof DeuteriumStorage)

  if (!storage) {
    return false
  }
  // 更新资源
  const input = object.update()
  if (storage.store >= input) {
    storage.addStore(-input)
    object.elecProd = object.calcOutput(object.level)
  } else {
    // 重氢不足
    object.elecProd = 0
  }
  return true
}

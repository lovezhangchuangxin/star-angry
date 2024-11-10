import { MetalMine, MetalStorage, StructureType } from '../../../structure'

export const mine = (object: MetalMine, planetObjects: StructureType[]) => {
  // 找到仓库
  const storage = planetObjects.find((o) => o instanceof MetalStorage)
  if (!storage) {
    return false
  }

  // 更新资源
  const output = object.update()
  storage.addStore(output)
  return true
}

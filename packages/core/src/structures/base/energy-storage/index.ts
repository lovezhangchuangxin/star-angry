import { ResourceType } from '../../../constant'
import { StructureConfig } from '../../types'

/**
 * 能量仓库
 */
export const EnergyStorageConfig: StructureConfig = {
  name: '能量仓库',
  desc: '用于存储能量资源',
  componentConfig: {
    level: {
      maxLevel: 100,
      calcUpgradeRequire: (level: number) => {
        return {
          resources: {
            [ResourceType.energy]: 100 * 1.1 ** level,
            [ResourceType.metal]: 100 * 1.1 ** level,
          },
          time: Math.max(level * 10, 3600),
        }
      },
    },
    store: {
      capacity: 1000,
      getCapacityByLevel: (level: number) => 1000 * 1.2 ** level,
    },
  },
}

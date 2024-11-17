import { ResourceType } from '../../../constant'
import { StructureConfig } from '../../types'

/**
 * 能量矿场
 */
export const EnergyMineConfig: StructureConfig = {
  name: '能量矿场',
  desc: '用于生产能量资源',
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
    mine: {
      mineSpeed: {
        [ResourceType.energy]: 100,
      },
      getMineSpeedByLevel: (level: number) => ({
        [ResourceType.energy]: 100 * level,
      }),
    },
  },
}

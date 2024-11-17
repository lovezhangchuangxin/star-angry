import { ResourceType } from '../../../constant'
import { StructureConfig } from '../../types'

/**
 * 金属矿场
 */
export const MetalMineConfig: StructureConfig = {
  name: '金属矿场',
  desc: '用于生产金属资源',
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
        [ResourceType.metal]: 100,
      },
      getMineSpeedByLevel: (level: number) => ({
        [ResourceType.metal]: 100 * level,
      }),
    },
  },
}

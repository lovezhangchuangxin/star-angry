import { StructureConfig } from '../../types'

/**
 * 金属仓库
 */
export const MetalStorageConfig: StructureConfig = {
  name: '金属仓库',
  desc: '用于存储金属资源',
  componentConfig: {
    store: {
      capacity: 1000,
    },
  },
}

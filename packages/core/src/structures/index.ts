import { EnergyMineConfig } from './base/energy-mine'
import { EnergyStorageConfig } from './base/energy-storage'
import { MetalMineConfig } from './base/metal-mine'
import { MetalStorageConfig } from './base/metal-storage'
import { StructureConfig } from './types'

export const StructureConfigMap: Record<string, StructureConfig> = {
  [EnergyStorageConfig.name]: EnergyStorageConfig,
  [MetalStorageConfig.name]: MetalStorageConfig,
  [EnergyMineConfig.name]: EnergyMineConfig,
  [MetalMineConfig.name]: MetalMineConfig,
}

/**
 * 建筑分类
 */
export const StructureCategory = {
  /**
   * 基础建筑
   */
  Base: [
    EnergyStorageConfig.name,
    MetalStorageConfig.name,
    EnergyMineConfig.name,
    MetalMineConfig.name,
  ],
}

export * from './types'

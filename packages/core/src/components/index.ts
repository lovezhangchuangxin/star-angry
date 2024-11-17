import { LevelCompDefaultConfig, LevelComponent } from './level'
import { MineCompDefaultConfig, MineComponent } from './mine'
import { StoreCompDefaultConfig, StoreComponent } from './store'

export * from './store'
export * from './level'
export * from './mine'

/**
 * 组件类映射
 */
export const componentClassMap = {
  [StoreComponent.type]: StoreComponent,
  [LevelComponent.type]: LevelComponent,
  [MineComponent.type]: MineComponent,
}

/**
 * 组件类型
 */
export type ComponentType = keyof typeof componentClassMap

/**
 * 组件默认配置映射
 */
export type ComponentDefaultConfigMap = {
  [StoreComponent.type]: StoreCompDefaultConfig
  [LevelComponent.type]: LevelCompDefaultConfig
  [MineComponent.type]: MineCompDefaultConfig
}

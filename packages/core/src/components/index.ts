import { ComponentIds } from '../config'
import { LevelCompConfig, levelGameEventHandlers } from './level'

/**
 * 组件配置映射
 */
export interface ComponentConfigMap {
  [ComponentIds.Level]: LevelCompConfig
}

/**
 * 组件事件处理器映射
 */
export const componentHandlers = [levelGameEventHandlers]

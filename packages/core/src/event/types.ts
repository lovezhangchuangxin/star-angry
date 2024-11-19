import { GameData, StructureConfig } from '../utils/types'

/**
 * 游戏事件对象
 */
export interface GameEventModel {
  /**
   * 事件名称
   */
  name: string
  /**
   * 事件参数
   */
  data: GameEventData
  /**
   * 事件范围
   */
  scope: string
}

/**
 * 事件数据
 */
export interface GameEventData {
  /**
   * 用户 id
   */
  _userId: string
  /**
   * 星球 id
   */
  _planetId: number
  /**
   * 建筑 id
   */
  _structureId: number
  /**
   * 组件 id
   */
  _componentId: number
  /**
   * 建筑配置
   */
  _structureConfigs: {
    [structureId: number]: StructureConfig
  }
  /**
   * 所有玩家的游戏数据
   */
  _gameData: GameData
  /**
   * 其他参数
   */
  [key: string]: any
}

/**
 * 游戏事件处理函数
 */
export type GameEventHandler = (event: GameEventModel) => void

/**
 * 构造事件处理函数映射
 */
export const createEventHandlerMap = (
  prefix: string,
  handlerMap: {
    [name: string]: GameEventHandler
  },
) => {
  const result: {
    [name: string]: GameEventHandler
  } = {}
  for (const name in handlerMap) {
    result[`${prefix}:${name}`] = handlerMap[name]
  }
  return result
}

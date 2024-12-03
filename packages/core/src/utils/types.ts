import { ResourceType } from '../config'
import { AllStructureData, StructureConfig } from '../structure'

/**
 * 玩家游戏数据
 */
export interface UserDataMap {
  [userId: string]: {
    /**
     * 全局资源
     */
    globals: {
      /**
       * 钱
       */
      money: number
      /**
       * 星怒币
       */
      xnc: number
    }
    /**
     * 星球
     */
    planets: {
      [planetId: string]: PlanetData
    }
  }
}

/**
 * 星球数据
 */
export interface PlanetData {
  /**
   * 星球名称
   */
  name: string
  /**
   * 星球等级
   */
  level: number
  /**
   * 飞行速度
   */
  speed: number
  /**
   * 当前坐标
   */
  position: {
    x: number
    y: number
  }
  /**
   * 目的地坐标
   */
  targetPosition?: {
    x: number
    y: number
  }
  /**
   * 星球资源
   */
  resources: PlanetResource
  /**
   * 星球建筑
   */
  structures: {
    [structureId: string]: AllStructureData
  }
}

/**
 * 星球资源
 */
export type PlanetResource = {
  [resourceId in ResourceType]?: {
    /**
     * 资源数量
     */
    amount: number
    /**
     * 资源容量
     */
    capacity: number
  }
}

/**
 * 我的游戏数据
 */
export type UserData = UserDataMap[string]

/**
 * 建筑操作函数
 */
export type StructureOperationFunc = (
  params: any,
  data: AllStructureData,
  structureConfigs: StructureConfig,
  planetData: PlanetData,
) => boolean

/**
 * 建筑操作对象
 */
export interface StructureOperationObject {
  [operationId: string]: StructureOperationFunc
}

/**
 * 资源数量 Map
 */
export type ResourceNumberMap = {
  [resourceId in ResourceType]?: number
}

/**
 * 建筑操作参数
 */
export interface StructureOperationParams {
  userId: string
  planetId: string
  structureId: string
  operation: string
  data?: any
}

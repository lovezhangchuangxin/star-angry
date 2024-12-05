import { AttackType } from '../config/combat'
import { ResourceType } from '../config/resource'
import { UserDataMap } from '../utils'

/**
 * 建筑 id
 */
export type StructureId = string

/**
 * 等级
 */
export type Level = number

/**
 * 建筑基础配置
 */
export interface StructureBaseConfig {
  /**
   * 建筑 id
   */
  id: StructureId
  /**
   * 建筑名称
   */
  name: string
  /**
   * 建筑类型
   */
  type: string
  /**
   * 最大等级
   */
  maxLevel?: Level
  /**
   * 前置依赖建筑
   */
  preDepend?: Record<StructureId, Level>
  /**
   * 获取升级消耗
   */
  getUpgradeCost: (level: number) => Partial<Record<ResourceType, number>>
  /**
   * 建筑描述
   */
  description: string
  /**
   * 建筑图标
   */
  image?: string
  /**
   * 优先级，小的在前面，默认 1000
   */
  priority?: number
}

/**
 * 存储类型建筑配置
 */
export interface StorageConfig extends StructureBaseConfig {
  type: 'storage'
  /**
   * 存储的资源
   */
  resource: ResourceType
  /**
   * 存储容量
   */
  capacity: (level: number) => number
}

/**
 * 生产类型建筑配置
 */
export interface ProducerConfig extends StructureBaseConfig {
  type: 'producer'
  /**
   * 获取产出资源速度
   */
  getProduceSpeed?: (level: number) => Partial<Record<ResourceType, number>>
  /**
   * 获取消耗资源速度
   */
  getConsumeSpeed?: (level: number) => Partial<Record<ResourceType, number>>
}

/**
 * 科技类型建筑配置
 */
export interface TechnologyConfig extends StructureBaseConfig {
  type: 'technology'
}

/**
 * 防御设施建造配置
 */
export interface DefenseConfig extends StructureBaseConfig {
  type: 'defense'
  /**
   * 生命值
   */
  health: number
  /**
   * 护盾
   */
  shield: number
  /**
   * 攻击力
   */
  attack?: {
    [type in AttackType]?: number
  }
}

/**
 * 所有类型的建筑配置
 */
export type AllStructureConfig =
  | StorageConfig
  | ProducerConfig
  | TechnologyConfig
  | DefenseConfig

/**
 * 建筑类型
 */
export type StructureType = AllStructureConfig['type']

/**
 * 建筑配置文件
 */
export interface StructureConfig {
  [structureId: string]: AllStructureConfig
}

/**
 * 建筑基础数据
 */
export interface StructureData {
  /**
   * 建筑 id
   */
  id: StructureId
  /**
   * 建筑等级
   */
  level: Level
  /**
   * 建筑暂停状态
   */
  pause?: boolean
  /**
   * 上次更新的时间
   */
  lastUpdateTime?: number
}

/**
 * 存储类型建筑数据
 */
export interface StorageData extends StructureData {}

/**
 * 生产类型建筑数据
 */
export interface ProducerData extends StructureData {
  /**
   * 产出资源的速度
   */
  produceSpeed: Partial<Record<ResourceType, number>>
  /**
   * 消耗资源的速度
   */
  consumeSpeed: Partial<Record<ResourceType, number>>
}

/**
 * 科技类型建筑数据
 */
export interface TechnologyData extends StructureData {}

/**
 * 防御设施建筑数据
 */
export interface DefenseData extends StructureData {
  /**
   * 数量
   */
  amount: number
}

/**
 * 所有类型的建筑数据
 */
export type AllStructureData =
  | StorageData
  | ProducerData
  | TechnologyData
  | DefenseData

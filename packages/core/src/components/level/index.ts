import { ResourceType } from '../../constant'
import { Component } from '../types'

/**
 * 组件默认配置
 */
export interface LevelCompDefaultConfig {
  /**
   * 最大等级
   */
  maxLevel: number
  /**
   * 升级所需资源的计算函数
   *
   * @param level 当前等级
   */
  calcUpgradeRequire: (level: number) => {
    /** 需要的资源 */
    resources: Partial<Record<ResourceType, number>>
    /** 依赖的前置建筑的等级 */
    preStructureLevel?: Partial<Record<string, number>>
    /** 升级需要的时间，单位为秒 */
    time?: number
  }
}

/**
 * 组件配置，可变化的数据
 */
export interface ILevelCompConfig {
  /**
   * 当前等级
   */
  level: number
  /**
   * 开始升级的时间，有该值表示正在升级
   */
  upgradeStartTime?: number
}

/**
 * 等级组件，拥有该组件的实体具有等级且可以升级
 */
export class LevelComponent extends Component<
  LevelCompDefaultConfig,
  ILevelCompConfig
> {
  static readonly type = 'level'

  constructor(
    defaultConfig: LevelCompDefaultConfig,
    config: ILevelCompConfig = {
      level: 1,
    },
  ) {
    super(defaultConfig, config)
  }
}

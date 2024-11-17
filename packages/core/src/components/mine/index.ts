import { ResourceType } from '../../constant'
import { Component } from '../types'

/**
 * 组件默认配置
 */
export interface MineCompDefaultConfig {
  /**
   * 挖矿速度，单位为每秒
   */
  mineSpeed: Partial<Record<ResourceType, number>>
  /**
   * 不同等级的挖矿速度
   */
  getMineSpeedByLevel?: (level: number) => Partial<Record<ResourceType, number>>
}

/**
 * 组件配置，可变化的数据
 */
export interface IMineCompConfig {
  /**
   * 开始挖矿的时间
   */
  mineStartTime: number
}

/**
 * 挖资源组件
 */
export class MineComponent extends Component<
  MineCompDefaultConfig,
  IMineCompConfig
> {
  static readonly type = 'mine'

  constructor(
    defaultConfig: MineCompDefaultConfig,
    config: IMineCompConfig = {
      mineStartTime: Date.now(),
    },
  ) {
    super(defaultConfig, config)
  }
}

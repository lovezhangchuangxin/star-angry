import { ResourceType } from '../../constant'
import { Component } from '../types'

/**
 * 组件默认配置
 */
export interface StoreCompDefaultConfig {
  /**
   * 基础存储容量
   */
  capacity: number
  /**
   * 存储资源类型
   */
  storeTypes?: ResourceType[]
  /**
   * 获取所属实体等级下的存储容量
   */
  getCapacityByLevel?: (level: number) => number
}

/**
 * 组件配置，可变化的数据
 */
export interface IStoreCompConfig {
  /**
   * 已存储的资源
   */
  store: Partial<Record<ResourceType, number>>
}

/**
 * 存储组件，用于星球上存储资源（非舰队）
 */
export class StoreComponent extends Component<
  StoreCompDefaultConfig,
  IStoreCompConfig
> {
  static readonly type = 'store'

  constructor(
    defaultConfig: StoreCompDefaultConfig,
    config: IStoreCompConfig = {
      store: {},
    },
  ) {
    super(defaultConfig, config)
  }

  /**
   * 计算已存储的资源总数
   */
  get total() {
    return Object.values(this.config.store).reduce((acc, num) => acc + num, 0)
  }
}

import { AnyObject } from '../utils/types'

/**
 * 基础组件类
 */
export abstract class Component<
  T extends AnyObject = AnyObject,
  U extends AnyObject = AnyObject,
> {
  static readonly type: string

  /**
   * @param defaultConfig 默认配置
   * @param config 可变配置
   */
  constructor(
    public defaultConfig: T,
    public config: U,
  ) {}

  toJSON() {
    return this.config
  }
}

/**
 * 构造默认配置
 */
export type BuildDefaultConfig<T> = {
  defaultConfig: T
}

/**
 * 构造可变配置
 */
export type BuildConfig<U> = {
  config: U
}

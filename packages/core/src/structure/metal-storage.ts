import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 金属仓库
 */
export class MetalStorage extends Structure {
  public readonly id = 'metalStorage'
  public readonly name = '金属仓库'
  public level = 0
  public readonly maxLevel = 100
  /**
   * 已存储资源
   */
  public store = 0
  /**
   * 存储限制
   */
  public storeLimit = 0

  public constructor(
    config: { level: number; store: number } = { level: 0, store: 0 },
  ) {
    super()
    this.level = config.level
    this.store = config.store
    this.storeLimit = this.calcCapacity(this.level)
  }

  public calcUpgradeCost(level: number): Record<ResourceType, number> {
    return {
      [ResourceType.metal]: Math.floor(2000 * Math.pow(2, level)),
      [ResourceType.energy]: 0,
      [ResourceType.deuterium]: 0,
    }
  }

  public upgrade(): boolean {
    if (this.level >= this.maxLevel) {
      return false
    }
    this.level++
    return true
  }

  /**
   * 不同等级的资源存储上限
   */
  public calcCapacity(level: number): number {
    return Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 1000
  }

  /**
   * 设置存储的资源
   */
  public addStore(addStore: number): void {
    const capacity = this.calcCapacity(this.level)
    const store = this.store + addStore
    if (store > capacity) {
      this.store = capacity
    } else if (store < 0) {
      this.store = 0
    } else {
      this.store = store
    }
  }

  public toJSON(): Record<string, any> {
    return {
      level: this.level,
      store: this.store,
    }
  }
}

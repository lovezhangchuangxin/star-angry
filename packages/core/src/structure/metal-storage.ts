import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 金属仓库
 */
export class MetalStorage extends Structure {
  public id = 'metalStorage'
  public name = '金属仓库'
  public level = 0
  public maxLevel = 100
  /**
   * 已存储资源
   */
  public store = 0

  public constructor(
    config: { level: number; store: number } = { level: 0, store: 0 },
  ) {
    super()
    this.level = config.level
    this.store = config.store
  }

  public calcUpgradeCost(level: number): Record<ResourceType, number> {
    return {
      [ResourceType.metal]: Math.floor(100 * Math.pow(1.3, level)),
      [ResourceType.energy]: Math.floor(50 * Math.pow(1.3, level)),
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
    return 1000 * Math.pow(2, level)
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

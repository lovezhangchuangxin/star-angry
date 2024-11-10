import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 金属矿场
 */
export class MetalMine extends Structure {
  public id = 'metalMine'
  public name = '金属矿场'
  public level = 0
  public maxLevel = 100

  /**
   * 上一次的更新时间
   */
  public lastUpdate = Date.now()

  public constructor(
    config: { level: number; lastUpdate: number } = {
      level: 0,
      lastUpdate: Date.now(),
    },
  ) {
    super()
    this.level = config.level
    this.lastUpdate = config.lastUpdate
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
   * 计算每秒的资源产量
   */
  public calcOutput(level: number): number {
    return 50 * level
  }

  /**
   * 更新资源
   */
  public update(): number {
    const now = Date.now()
    const deltaTime = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    return Math.floor(deltaTime * this.calcOutput(this.level))
  }

  public toJSON(): Record<string, any> {
    return {
      level: this.level,
      lastUpdate: this.lastUpdate,
    }
  }
}

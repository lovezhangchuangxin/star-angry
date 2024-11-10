import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 能量矿场
 */
export class EnergyMine extends Structure {
  public id = 'energyMine'
  public name = '能量矿场'
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
      [ResourceType.metal]: Math.floor(90 * Math.pow(1.3, level)),
      [ResourceType.energy]: Math.floor(60 * Math.pow(1.3, level)),
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
    return 100 * level
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

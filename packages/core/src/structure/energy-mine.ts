import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 能量矿场
 */
export class EnergyMine extends Structure {
  public readonly id = 'energyMine'
  public readonly name = '能量矿场'
  public level = 0
  public readonly maxLevel = 255
  /**
   * 产量
   */
  public output = 0
  /**
   * 用电量
   */
  public elecUsed = 0
  /**
   * 上一次的更新时间
   */
  public lastUpdate = Date.now()

  public constructor(
    config: { level: number; lastUpdate: number; elecUsed: number } = {
      level: 0,
      lastUpdate: Date.now(),
      elecUsed: 0,
    },
  ) {
    super()
    this.level = config.level
    this.lastUpdate = config.lastUpdate
    this.output = this.calcOutput(this.level)
    this.elecUsed = this.electricityUsage(this.level)
  }

  public calcUpgradeCost(level: number): Record<ResourceType, number> {
    return {
      [ResourceType.metal]: Math.floor(48 * Math.pow(1.5, level)),
      [ResourceType.energy]: Math.floor(24 * Math.pow(1.5, level)),
      [ResourceType.deuterium]: 0,
    }
  }

  public upgrade(): boolean {
    if (this.level >= this.maxLevel) {
      return false
    }
    this.level++
    this.output = this.calcOutput(this.level)
    this.elecUsed = this.electricityUsage(this.level)
    return true
  }

  /**
   * 计算每秒的资源产量
   */
  public calcOutput(level: number): number {
    return Math.floor(20 * level * Math.pow(1.1, level) * (0.1 * 11))
  }

  /**
   * 用电量
   */
  public electricityUsage(level: number): number {
    return Math.ceil(10 * level * Math.pow(1.1, level) * (0.1 * 11))
  }

  /**
   * 更新资源
   */
  public update(prodLevel: number = 1): number {
    const now = Date.now()
    const deltaTime = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    let prodPerTick = this.calcOutput(this.level) * prodLevel
    if (prodPerTick < 1) prodPerTick = this.calcOutput(1)
    return Math.floor(deltaTime * prodPerTick)
  }

  public toJSON(): Record<string, any> {
    return {
      level: this.level,
      lastUpdate: this.lastUpdate,
    }
  }
}

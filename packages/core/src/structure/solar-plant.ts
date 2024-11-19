import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 太阳能电站
 */
export class SolarPlant extends Structure {
  public readonly id = 'solarPlant'
  public readonly name = '太阳能电站'
  public level = 0
  public readonly maxLevel = 255
  /**
   * 已使用量
   */
  public totalUsed = 0
  public totalProd = 0
  /**
   * 产量
   */
  public output = 0
  public elecProd = 0
  /**
   * 上一次的更新时间
   */
  public lastUpdate = Date.now()

  public constructor(
    config: {
      level: number
      lastUpdate: number
      totalUsed: number
      totalProd: number
    } = {
      level: 0,
      lastUpdate: Date.now(),
      totalUsed: 0,
      totalProd: 0,
    },
  ) {
    super()
    this.level = config.level
    this.totalUsed = config.totalUsed
    this.totalProd = config.totalProd
    this.lastUpdate = config.lastUpdate
    this.output = this.calcOutput(this.level)
    this.elecProd = this.output
  }

  public calcUpgradeCost(level: number): Record<ResourceType, number> {
    return {
      [ResourceType.metal]: Math.floor(75 * Math.pow(1.5, level)),
      [ResourceType.energy]: Math.floor(30 * Math.pow(1.5, level)),
      [ResourceType.deuterium]: 0,
    }
  }

  public upgrade(): boolean {
    if (this.level >= this.maxLevel) {
      return false
    }
    this.level++
    this.output = this.calcOutput(this.level)
    this.elecProd = this.output
    return true
  }

  /**
   * 计算每秒电能产量
   */
  public calcOutput(level: number): number {
    return Math.floor(20 * level * Math.pow(1.1, level) * (0.1 * 11))
  }

  /**
   * 计算每秒的用电总量
   */
  public calcUsed(structures: Structure[]): void {
    this.totalUsed = structures
      .map((e) => e.elecUsed)
      .reduce((total, curr) => (total += curr), 0)
  }

  /**
   * 计算每秒的产电总量
   */
  public calcProd(structures: Structure[]): void {
    this.totalProd = structures
      .map((e) => e.elecProd)
      .reduce((total, curr) => (total += curr), 0)
  }

  /**
   * 计算建筑产能削减
   */
  public calcProdLevel(): number {
    if (!this.totalUsed) return 1
    if (!this.totalProd) return 0
    if (this.totalUsed > this.totalProd) {
      return this.totalProd / this.totalUsed
    } else {
      return 1
    }
  }

  /**
   * 更新资源
   */
  public update(): number {
    const now = Date.now()
    this.lastUpdate = now

    return this.calcOutput(this.level)
  }

  public toJSON(): Record<string, any> {
    return {
      level: this.level,
      totalUsed: this.totalUsed,
      totalProd: this.totalProd,
      lastUpdate: this.lastUpdate,
    }
  }
}

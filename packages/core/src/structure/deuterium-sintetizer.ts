import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 重氢精炼厂
 */
export class DeuteriumSintetizer extends Structure {
  public readonly id = 'deuteriumSintetizer'
  public readonly name = '重氢精炼厂'
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
   * 热量 (跟星球温度有关)
   */
  public buildTemp = 30
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
      [ResourceType.metal]: Math.floor(225 * Math.pow(1.5, level)),
      [ResourceType.energy]: Math.floor(75 * Math.pow(1.5, level)),
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
    return Math.floor(
      10 *
        level *
        Math.pow(1.1, level) *
        (-0.002 * this.buildTemp + 1.28) *
        (0.1 * 11),
    )
  }

  /**
   * 用电量
   */
  public electricityUsage(level: number): number {
    return Math.ceil(30 * level * Math.pow(1.1, level) * (0.1 * 11))
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

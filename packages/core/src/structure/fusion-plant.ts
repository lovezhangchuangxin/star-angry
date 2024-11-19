import { ResourceType } from '../constant/res'
import { Structure } from './structure'

/**
 * 聚变反应堆
 */
export class FusionPlant extends Structure {
  public readonly id = 'fusionPlant'
  public readonly name = '聚变反应堆'
  public level = 0
  public readonly maxLevel = 255
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
    config: { level: number; lastUpdate: number; elecProd: number } = {
      level: 0,
      lastUpdate: Date.now(),
      elecProd: 0,
    },
  ) {
    super()
    this.level = config.level
    this.lastUpdate = config.lastUpdate
    this.elecProd = config.elecProd
    this.output = this.calcOutput(this.level)
  }

  public calcUpgradeCost(level: number): Record<ResourceType, number> {
    return {
      [ResourceType.metal]: Math.floor(900 * Math.pow(2, level)),
      [ResourceType.energy]: Math.floor(360 * Math.pow(2, level)),
      [ResourceType.deuterium]: Math.floor(180 * Math.pow(2, level)),
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
   * 计算每秒消耗资源
   */
  public calcInput(level: number): number {
    return Math.ceil(10 * level * Math.pow(1.1, level) * (0.1 * 11))
  }

  /**
   * 计算每秒电能产量
   */
  public calcOutput(level: number): number {
    return Math.floor(30 * level * Math.pow(1.05, level) * (0.1 * 11)) * 10
  }

  /**
   * 更新资源
   */
  public update(): number {
    const now = Date.now()
    this.lastUpdate = now

    return this.calcInput(this.level)
  }

  public toJSON(): Record<string, any> {
    return {
      level: this.level,
      elecProd: this.elecProd,
      lastUpdate: this.lastUpdate,
    }
  }
}

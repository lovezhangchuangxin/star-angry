import { ResourceType } from '../constant/res'

/**
 * 建筑
 */
export abstract class Structure {
  /**
   * 建筑 id
   */
  public abstract id: string
  /**
   * 建筑名称
   */
  public abstract name: string
  /**
   * 建筑等级
   */
  public abstract level: number
  /**
   * 最大等级
   */
  public abstract maxLevel: number
  /**
   * 使用电量
   */
  public elecUsed: number = 0
  /**
   * 产生电量
   */
  public elecProd: number = 0
  /**
   * 升到某级需要的资源
   */
  public abstract calcUpgradeCost(level: number): Record<ResourceType, number>
  /**
   * 升级
   */
  public abstract upgrade(): boolean
  /**
   * toJSON
   */
  public abstract toJSON(): Record<string, any>
}

/**
 * Any object
 */
export type AnyObject = Record<string, any>

/**
 * 游戏数据结构
 */
export interface GameData {
  [userId: string]: {
    [planetId: number]: {
      /**
       * 该星球的资源，资源全部挂在星球下面
       */
      resources: ResourceMap
      /**
       * 该星球的建筑
       */
      structures: {
        [structureId: number]: {
          /**
           * 组件数据
           */
          components: {
            [componentId: number]: any
          }
        }
      }
    }
  }
}

/**
 * 建筑配置
 */
export interface StructureConfig {
  /**
   * 建筑 id
   */
  id: string
  /**
   * 建筑名称
   */
  name: string
  /**
   * 建筑描述
   */
  desc: string
  /**
   * 建筑的图片地址
   */
  image?: string
  /**
   * 组件配置
   */
  componentConfig: {
    [componentId: string]: any
  }
}

/**
 * 资源映射
 */
export interface ResourceMap {
  [resourceId: string]: number
}

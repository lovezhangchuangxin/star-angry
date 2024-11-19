/**
 * 等级组件配置
 */
export interface LevelCompConfig {
  /**
   * 最大等级
   */
  maxLevel: number
  /**
   * 升级所需资源的计算函数
   *
   * @param level 当前等级
   */
  calcUpgradeRequire: (level: number) => {
    /**
     * 需要的资源
     */
    resources: {
      [resourceId: string]: number
    }
    /**
     * 依赖的前置建筑的等级
     */
    preStructureLevel?: {
      [structureId: string]: number
    }
    /**
     * 升级需要的时间，单位为秒
     */
    costTime?: number
  }
}

/**
 * 等级组件数据
 */
export interface LevelCompData {
  /**
   * 当前等级
   */
  level: number
  /**
   * 开始升级的时间，有该值表示正在升级
   */
  upgradeStartTime?: number
}

/**
 * 挖矿组件配置
 */
export interface MineCompConfig {
  /**
   * 挖矿速度，单位为每秒
   */
  mineSpeed: {
    [resourceId: string]: number
  }
  /**
   * 不同等级的挖矿速度
   */
  getMineSpeedByLevel?: (level: number) => {
    [resourceId: string]: number
  }
}

/**
 * 挖矿组件数据
 */
export interface MineCompData {
  /**
   * 开始挖矿的时间
   */
  mineStartTime: number
}

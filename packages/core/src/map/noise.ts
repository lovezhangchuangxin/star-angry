import { random } from '@star-angry/shared'

// 参考，柏林噪声

/**
 * Noise 噪声
 */
export abstract class Noise {
  /**
   * 生成噪声对象
   * @param seed 随机种子
   * @param diff 间距（整数）
   * @param loud 响度
   */
  public constructor(
    public seed: number,
    public diff: number,
    public loud: number,
  ) {}

  /**
   * 获取噪声值
   */
  public abstract getBuff(...args: number[]): number
}

/**
 * 二维噪声
 */
export class Noise2D extends Noise {
  public constructor(
    public seed: number,
    public diff: number,
    public loud: number,
  ) {
    super(random(seed, 3), diff, loud)
  }

  /**
   * 计算小于该数的最大整点（相对于 diff 来说）
   *
   * @example
   * ```js
   * // 例如 diff = 10 时：
   * floor(5) = 0
   * floor(11) = 10
   * floor(-2) = -10
   * ```
   */
  public floor(x: number) {
    return x - (((x % this.diff) + this.diff) % this.diff)
  }

  /**
   * 平滑函数
   *
   * @example
   * ```js
   * // 满足以下条件：
   * smooth(0) = 0
   * smooth(1) = 1
   * ```
   */
  public smooth(x: number) {
    return x * x * (3 - 2 * x)
  }

  /**
   * 获取二维空间中一个点周围的四个整点坐标，左上，右上，左下，右下
   *
   * @param x
   * @param y
   */
  public getAroundPosition(x: number, y: number): [x: number, y: number][] {
    const xMin = this.floor(x)
    const xMax = xMin + this.diff
    const yMin = this.floor(y)
    const yMax = yMin + this.diff
    return [
      [xMin, yMax],
      [xMax, yMax],
      [xMin, yMin],
      [xMax, yMin],
    ]
  }

  /**
   * 获取整点的噪声值
   */
  public getNoise(x: number, y: number) {
    // 种子不能是负数！
    const r = random((x * 49632 + y * 325176 + this.seed) >>> 1, 3)
    return (r * 2 - 1) * this.loud
  }

  /**
   * 获取噪声值
   */
  public getBuff(x: number, y: number) {
    const [p1, p2, p3, p4] = this.getAroundPosition(x, y)
    const qR = this.smooth((x - p1[0]) / this.diff)
    const qL = 1 - qR
    const qT = this.smooth((y - p4[1]) / this.diff)
    const qB = 1 - qT

    const v1 = this.getNoise(p1[0], p1[1])
    const v2 = this.getNoise(p2[0], p2[1])
    const v3 = this.getNoise(p3[0], p3[1])
    const v4 = this.getNoise(p4[0], p4[1])

    return v1 * qL * qT + v2 * qR * qT + v3 * qL * qB + v4 * qR * qB
  }
}

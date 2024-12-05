import { isClose } from '@star-angry/shared'
import { Noise2D } from './noise'

/**
 * 宇宙地图
 */
export class UniverseMap {
  /**
   * 噪声
   */
  public noise: Noise2D

  public constructor(
    public seed: number,
    public chunkSize: number = 256,
  ) {
    this.noise = new Noise2D(seed, 10, 1)
  }

  /**
   * 获取区块中的星球
   */
  public getPlanets(chunkId: number) {
    const planets: [x: number, y: number][] = []
    const [lx, ly] = this.getChunkCoord(chunkId)
    const rx = lx + this.chunkSize
    const ry = ly + this.chunkSize
    for (let x = lx; x < rx; x++) {
      for (let y = ly; y < ry; y++) {
        if (this.isPlanet(x, y)) {
          planets.push([x, y])
        }
      }
    }
    return planets
  }

  /**
   * 检查方块是否是星球
   */
  public isPlanet(x: number, y: number): boolean {
    const noise = this.noise.getBuff(x, y)
    return isClose(noise, 0, 0.0001)
  }

  /**
   * 获取地图可视区中的区块
   *
   * @param lx 左上角 x 坐标
   * @param ly 左上角 y 坐标
   * @param rx 右下角 x 坐标
   * @param ry 右下角 y 坐标
   */
  public getChunks(lx: number, ly: number, rx: number, ry: number): number[] {
    const chunkIds: number[] = []
    for (let x = lx; x < rx + this.chunkSize; x += this.chunkSize) {
      for (let y = ly; y < ry + this.chunkSize; y += this.chunkSize) {
        const chunkId = this.getChunkId(x, y)
        chunkIds.push(chunkId)
      }
    }

    return chunkIds
  }

  /**
   * 获取方块 id，x，y 均为整数且 |x| 应小于 16384， |y| 应小于 32768
   */
  public getBlockId(x: number, y: number): number {
    return ((x + 16383) << 16) + y + 32767
  }

  /**
   * 获取方块坐标
   */
  public getBlockCoord(blockId: number): [number, number] {
    const x = (blockId >> 16) - 16383
    const y = (blockId & 0xffff) - 32767
    return [x, y]
  }

  /**
   * 获取区块 id，即区块左上角方块 id
   */
  public getChunkId(x: number, y: number): number {
    x = Math.floor(x / this.chunkSize)
    y = Math.floor(y / this.chunkSize)
    return this.getBlockId(x, y)
  }

  /**
   * 获取区块左上角坐标
   */
  public getChunkCoord(chunkId: number): [number, number] {
    const [x, y] = this.getBlockCoord(chunkId)
    return [x * this.chunkSize, y * this.chunkSize]
  }
}

import { lcg } from '@star-angry/shared'

/**
 * 宇宙地图
 */
export class Universe {
  /**
   * 伪随机数生成器，种子相同，生成的随机数序列相同
   */
  public random: () => number

  // 区块星系
  public chunkGalaxyMap: Map<number, Galaxy> = new Map()

  public constructor(
    public seed: number,
    public chunkSize: number = 256,
  ) {
    this.random = lcg(seed)
  }

  /**
   * 获取区块中的星系
   */
  public getGalaxy(chunkId: number): Galaxy {
    if (this.chunkGalaxyMap.has(chunkId)) {
      return this.chunkGalaxyMap.get(chunkId)!
    }

    // 先找到区块中心
    let [x, y] = this.getChunkCoord(chunkId)
    x += Math.floor(this.chunkSize / 2)
    y += Math.floor(this.chunkSize / 2)
    // 在生成星系中心，即区块中心附近
    const galaxyX = x + Math.floor(((this.random() - 0.5) * this.chunkSize) / 2)
    const galaxyY = y + Math.floor(((this.random() - 0.5) * this.chunkSize) / 2)

    // 暂时一个区块只有一个星系，星系整体范围在区块内，半径大约为区块半径的 1/4
    const size = Math.floor((this.random() / 4 + 0.1) * this.chunkSize)
    const galaxy = new Galaxy(
      this.getBlockId(galaxyX, galaxyY),
      galaxyX,
      galaxyY,
      size,
    )

    // 生成星球
    const planetCount = Math.floor(this.random() * 5 + 5)
    const planets: Planet[] = []

    const genPlanet = () => {
      const planetX = galaxyX + Math.floor(this.random() * size)
      const planetY = galaxyY + Math.floor(this.random() * size)
      const planetSize = Math.floor((this.random() / planetCount + 0.1) * size)
      const color = `#${Math.floor(this.random() * 0xffffff).toString(16)}`
      return new Planet(
        this.getBlockId(planetX, planetY),
        planetX,
        planetY,
        planetSize,
        color,
      )
    }

    let check = 0
    for (let i = 0; i < planetCount; i++) {
      const planet = genPlanet()
      // 防止星球重叠
      if (
        planets.some(
          (p) =>
            Math.abs(p.x - planet.x) < p.size + planet.size &&
            Math.abs(p.y - planet.y) < p.size + planet.size,
        )
      ) {
        if (check++ > 10) {
          check = 0
          continue
        }
        i--
        continue
      }
      planets.push(planet)
    }

    galaxy.planets = planets
    this.chunkGalaxyMap.set(chunkId, galaxy)
    return galaxy
  }

  /**
   * 获取地图可视区中的星系
   */
  public getGalaxies(lx: number, ly: number, rx: number, ry: number): Galaxy[] {
    const chunkIds = this.getChunks(lx, ly, rx, ry)
    const galaxies: Galaxy[] = []
    for (const chunkId of chunkIds) {
      const galaxy = this.getGalaxy(chunkId)
      galaxies.push(galaxy)
    }
    return galaxies
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
    for (let x = lx; x <= rx; x += this.chunkSize) {
      for (let y = ly; y <= ry; y += this.chunkSize) {
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

/**
 * 星系
 */
export class Galaxy {
  // 星球
  public planets: Planet[] = []

  /**
   * @param x 星系中心 x 坐标
   * @param y 星系中心 y 坐标
   * @param seed 随机种子
   */
  public constructor(
    public id: number,
    public x: number,
    public y: number,
    public size: number,
  ) {}

  addPlanet(planet: Planet) {
    this.planets.push(planet)
  }
}

/**
 * 星球
 */
export class Planet {
  public constructor(
    public id: number,
    public x: number,
    public y: number,
    public size: number,
    public color: string = '#000',
  ) {}
}

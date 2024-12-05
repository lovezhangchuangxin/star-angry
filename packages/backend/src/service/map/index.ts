import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import {
  getPlanetBaseData,
  initPlanetData,
  PlanetData,
  UniverseMap,
} from '@star-angry/core'
import { GameDB, GameModel } from '@star-angry/db'

/**
 * 地图缓存对象数据
 */
export interface ObjectCacheData {
  userId?: string
  userName?: string
  planet: PlanetData
}

export default class MapService {
  static map: UniverseMap

  /**
   * 缓存区块中的物体
   */
  static objectCache: {
    [chunkId: number]: ObjectCacheData[]
  } = {}

  /**
   * 区块中原始星球（后来被玩家占领）的id
   */
  static originalPlanetIds: Record<number, Set<number>> = {}

  /**
   * 新玩家注册星球
   */
  static async registerPlanet(userId: string, planetId: string) {
    const data = await GameDB.getDB().getData()
    const userDataMap = data.userDataMap
    const userData = userDataMap[userId]
    if (!userData || Object.keys(userData.planets).length > 0) {
      throw new GameError(ErrorCode.USER_NOT_EXIST)
    }
    const map = MapService.map
    const [x, y] = map.getBlockCoord(+planetId)
    // 不是一个星球
    if (!map.isPlanet(x, y)) {
      throw new GameError(ErrorCode.PLANET_NOT_EXIST)
    }
    // 已经被别人占了
    const originChunkId = map.getChunkId(x, y)
    if (MapService.originalPlanetIds[originChunkId]?.has(+planetId)) {
      throw new GameError(ErrorCode.PLANET_OCCUPIED)
    }

    const planet = getPlanetBaseData(planetId)
    planet.position = [x, y]
    userData.planets[planetId] = planet
    initPlanetData(planet, userDataMap)
    if (!MapService.objectCache[originChunkId]) {
      MapService.objectCache[originChunkId] = []
    }
    MapService.objectCache[originChunkId].push({
      userId,
      userName: data.user.find((user) => user.id === userId)?.username || '',
      planet,
    })
    if (!MapService.originalPlanetIds[originChunkId]) {
      MapService.originalPlanetIds[originChunkId] = new Set()
    }
    MapService.originalPlanetIds[originChunkId].add(+planetId)
  }

  /**
   * 获取我的所有星球
   */
  static async getMyPlanets(userId: string) {
    const data = await GameDB.getDB().getData()
    const userData = data.userDataMap[userId]
    if (!userData) {
      throw new GameError(ErrorCode.USER_NOT_EXIST)
    }
    return userData.planets
  }

  /**
   * 获取区块中的物体
   */
  static getObjectsFromChunks(chunkIds: number[]) {
    return chunkIds.reduce(
      (prev, chunkId) => {
        prev[chunkId] = MapService.objectCache[chunkId] || []
        return prev
      },
      {} as { [chunkId: number]: ObjectCacheData[] },
    )
  }

  /**
   * 获取区块中已经被占领的星球
   */
  static getOccupiedPlanetsFromChunks(chunkIds: number[]) {
    return chunkIds.reduce(
      (prev, chunkId) => {
        prev[chunkId] = Array.from(MapService.originalPlanetIds[chunkId] || [])
        return prev
      },
      {} as Record<number, number[]>,
    )
  }

  /**
   * 初始化地图相关数据
   */
  static init(data: GameModel) {
    MapService.map = new UniverseMap(data.config.seed)

    Object.keys(data.userDataMap).forEach((userId) => {
      const userData = data.userDataMap[userId]
      Object.values(userData.planets).forEach((planet) => {
        // 缓存现在的坐标
        const [x, y] = planet.position
        const chunkId = MapService.map.getChunkId(x, y)
        if (!MapService.objectCache[chunkId]) {
          MapService.objectCache[chunkId] = []
        }
        MapService.objectCache[chunkId].push({
          userId,
          userName:
            data.user.find((user) => user.id === userId)?.username || '',
          planet,
        })
        // 缓存原始的坐标
        const originChunkId = MapService.map.getChunkId(
          ...MapService.map.getBlockCoord(+planet.id),
        )
        if (!MapService.originalPlanetIds[originChunkId]) {
          MapService.originalPlanetIds[originChunkId] = new Set()
        }
        MapService.originalPlanetIds[originChunkId].add(+planet.id)
      })
    })
  }
}

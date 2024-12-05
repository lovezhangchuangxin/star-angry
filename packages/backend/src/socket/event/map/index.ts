import { Server, Socket } from 'socket.io'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'
import { GameError } from '../../../error/GameError'
import MapService from '../../../service/map'

export const mapEventHandler = (socket: Socket, io: Server) => {
  /**
   * 新玩家注册星球
   */
  socket.on('registerPlanet', async (planetId: string, callback) => {
    const userId = socket.userId
    if (!userId) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    try {
      await MapService.registerPlanet(userId, planetId)
      return callback(Result.success({}))
    } catch (error: unknown) {
      console.error(error)
      if (error instanceof GameError) {
        return callback(Result.error(error.errorCode))
      }
    }
  })

  /**
   * 获取区块中的物体
   */
  socket.on('getObjectsFromChunks', async (chunkIds: number[], callback) => {
    try {
      const data = MapService.getObjectsFromChunks(chunkIds)
      const occupiedPlanets = MapService.getOccupiedPlanetsFromChunks(chunkIds)
      return callback(
        Result.success({
          seed: MapService.map.seed,
          chunkObjects: data,
          occupiedPlanets,
        }),
      )
    } catch (error: unknown) {
      console.error(error)
      if (error instanceof GameError) {
        return callback(Result.error(error.errorCode))
      }
    }
  })
}

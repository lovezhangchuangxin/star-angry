import { Server, Socket } from 'socket.io'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'
import StructureService from '../../../service/structure'
import { GameError } from '../../../error/GameError'

export const structureEventHandler = (socket: Socket, io: Server) => {
  // 获取自己的所有建筑
  socket.on('getStructures', async (callback) => {
    const userId = socket.userId
    if (!userId) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    const data = await StructureService.getStructures(userId)
    return callback(Result.success(data))
  })

  // 添加意图
  socket.on('addIntent', async (id: string, type: string, callback) => {
    const userId = socket.userId
    if (!userId || !id) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    try {
      const data = await StructureService.addIntent(userId, id, type)
      return callback(Result.success(data))
    } catch (error: unknown) {
      if (error instanceof GameError) {
        return callback(Result.error(error.errorCode))
      }
    }
  })
}

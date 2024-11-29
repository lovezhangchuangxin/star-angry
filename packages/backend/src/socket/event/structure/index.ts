import { Server, Socket } from 'socket.io'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'
import StructureService from '../../../service/structure'
import { GameError } from '../../../error/GameError'
import UserService from '../../../service/user'

export const structureEventHandler = (socket: Socket, io: Server) => {
  // 添加操作
  socket.on(
    'addOperation',
    async (
      params: {
        planetId: string
        structureId: string
        operation: string
      },
      callback,
    ) => {
      const userId = socket.userId
      if (!userId) {
        return callback(Result.error(ErrorCode.PARAM_ERROR))
      }

      try {
        const data = await StructureService.addOperation({ ...params, userId })
        UserService.activeUser(userId)
        return callback(Result.success(data))
      } catch (error: unknown) {
        console.error(error)
        if (error instanceof GameError) {
          return callback(Result.error(error.errorCode))
        }
      }
    },
  )
}

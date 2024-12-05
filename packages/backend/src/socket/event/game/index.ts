import { Server, Socket } from 'socket.io'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'
import { GameError } from '../../../error/GameError'
import UserService from '../../../service/user'
import GameService from '../../../service/game'

export const gameEventHandler = (socket: Socket, io: Server) => {
  // 获取我的数据
  socket.on('getMyData', async (callback) => {
    const userId = socket.userId
    if (!userId) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    try {
      const data = await GameService.getMyData(userId)
      UserService.onlineUser(userId)
      return callback(Result.success(data))
    } catch (error: unknown) {
      if (error instanceof GameError) {
        return callback(Result.error(error.errorCode))
      }
    }
  })
}

import { Server, Socket } from 'socket.io'
import { GameDB } from '@star-angry/db'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'

export const userEventHandler = (socket: Socket, io: Server) => {
  socket.on('queryUsers', async (userIds: string[], callback) => {
    if (!userIds || !Array.isArray(userIds)) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    const data = await GameDB.getDB().getData()
    const isSets = new Set(userIds)
    const users = data.user
      .filter((user) => isSets.has(user.id))
      .map((user) => ({
        id: user.id,
        username: user.username,
      }))
    callback(Result.success(users))
  })
}

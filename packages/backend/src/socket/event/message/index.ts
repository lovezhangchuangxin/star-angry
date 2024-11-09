import { Server, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { GameDB } from '@star-angry/db'
import { Result } from '../../../utils/result'
import { ErrorCode } from '../../../error/ErrorCode'
import { MessageModel } from '@star-angry/db/src/model/message'

export const messageEventHandler = (socket: Socket, io: Server) => {
  socket.on('getChat', async (toId: string, callback) => {
    const fromId = socket.userId
    if (!fromId || !toId) {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    const data = await GameDB.getDB().getData()
    if (!data.messages) {
      data.messages = {}
    }
    // 区别房间和私聊
    const key = isRoomId(toId)
      ? toId
      : [fromId, toId].sort((a, b) => a.localeCompare(b)).join('-')
    const messages = data.messages[key] || []
    const userMap = new Map<string, string>()
    const messageData = messages.map((item) => {
      let fromName = userMap.get(item.fromId)
      if (!fromName) {
        fromName =
          data.user.find((user) => user.id === item.fromId)?.username ||
          '未知用户'
      }
      return {
        ...item,
        fromName,
      }
    })
    callback(Result.success(messageData))
  })

  socket.on('sendChat', async (toId: string, content: string, callback) => {
    const fromId = socket.userId
    const fromName = socket.userInfo?.username
    const isRoom = isRoomId(toId)
    if (!fromId || !toId || !content || typeof content !== 'string') {
      return callback(Result.error(ErrorCode.PARAM_ERROR))
    }

    if (content.length > 1000) {
      return callback(Result.error(ErrorCode.MESSAGE_TOO_LONG))
    }

    const data = await GameDB.getDB().getData()
    if (!data.messages) {
      data.messages = {}
    }

    if (!isRoom && !data.user.find((user) => user.id === toId)) {
      return callback(Result.error(ErrorCode.USER_NOT_EXIST))
    }

    // 区别房间和私聊
    const key = isRoom
      ? toId
      : [fromId, toId].sort((a, b) => a.localeCompare(b)).join('-')
    if (!data.messages[key]) {
      data.messages[key] = []
    }

    const message = {
      id: uuidv4(),
      fromId: fromId,
      content: content,
      visible: true,
      selfVisible: true,
      read: false,
      time: Date.now(),
    }
    data.messages[key].push(message)
    const messageInfo = { ...message, fromName }
    if (isRoom) {
      io.to(toId).emit('receiveChat', fromId, messageInfo)
    } else {
      const toSocket = Array.from(io.sockets.sockets.values()).find(
        (item) => item.userId === toId,
      )
      if (toSocket) {
        toSocket.emit('receiveChat', fromId, messageInfo)
      }
    }

    callback(Result.success(messageInfo))
  })
}

export function isRoomId(id: string) {
  return id.startsWith('__room')
}

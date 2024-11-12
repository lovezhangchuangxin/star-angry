import http from 'http'
import { Server } from 'socket.io'
import app from './app'
import { createConnection } from '../socket/connection'

const server = http.createServer(app.callback())

// 配置 socket
const io = new Server(server, {
  cors: {
    origin: '*',
  },
  path: '/ws',
})

createConnection(io)

export { server, io }

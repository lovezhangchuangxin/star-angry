import Koa from 'koa'
import cors from '@koa/cors'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'
import jwt from 'koa-jwt'
import { Server } from 'socket.io'
import path from 'path'
import http from 'http'
import router from './router'
import { globalErrorHandler } from './error/globalErrorHandler'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

const app = new Koa()

// 配置跨域
app.use(cors())
// 配置静态资源
app.use(KoaStatic(path.resolve(__dirname, '../static')))
// 处理全局异常
app.use(globalErrorHandler)
// 配置 jwt
app.use(
  jwt({ secret: process.env.JWT_SECRET! }).unless({ path: [/^\/api\/login/] }),
)
// 配置 body 解析
app.use(bodyParser())
// 配置路由
app.use(router.routes())

const server = http.createServer(app.callback())
// 配置 socket
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

// 测试代码
const clients: { id: string; name: string }[] = []
io.on('connection', (socket) => {
  console.log('有人跟我建立连接', socket.handshake.query)
  socket.nsp.sockets.forEach((item, key) => {
    const index = clients.findIndex(
      (_item) => _item.name === item.handshake.query.name,
    )
    if (index >= 0) {
      clients.splice(index, 1)
    }
    clients.push({
      id: key,
      name: item.handshake.query.name as string,
    })
  })
  console.log('当前的用户列表', clients)
})

server.listen(process.env.GAME_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.GAME_PORT}`)
})

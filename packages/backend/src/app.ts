import Koa from 'koa'
import cors from '@koa/cors'
import KoaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import dotenv from 'dotenv'
import jwt from 'koa-jwt'
import path from 'path'
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
app.use(jwt({ secret: process.env.JWT_SECRET! }).unless({ path: [/^\/login/] }))
// 配置 body 解析
app.use(bodyParser())
// 配置路由
app.use(router.routes())

app.listen(process.env.GAME_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.GAME_PORT}`)
})

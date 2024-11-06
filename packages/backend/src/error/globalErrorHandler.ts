import { Context, Next } from 'koa'
import { GameError } from './GameError'
import { Result } from '../utils/result'

export const globalErrorHandler = async (ctx: Context, next: Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof GameError) {
      ctx.body = Result.error(error.getCode(), error.getMsg())
      return
    }

    if ((error as { status: number }).status === 401) {
      ctx.status = 200
      ctx.body = Result.error(401, 'token 无效 或 过期')
      return
    }

    ctx.body = Result.error(500, '未知错误')
    return
  }
}

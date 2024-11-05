import { Context, Next } from 'koa'
import UserService from '../../service/user'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import { UserModel } from '@star-angry/db'

export default class UserController {
  /**
   * 注册
   */
  static async register(ctx: Context) {
    const { username, password } = ctx.request.body as {
      username?: string
      password?: string
    }

    if (!username || !password) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.register(username, password)
  }

  /**
   * 登录
   */
  static async login(ctx: Context) {
    const { username, password } = ctx.request.body as {
      username?: string
      password?: string
    }

    if (!username || !password) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.login(username, password)
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(ctx: Context) {
    const { username } = ctx.state.user as UserModel
    console.log('user: ', ctx.state.user)
    if (!username) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.getUserInfo(username)
  }
}

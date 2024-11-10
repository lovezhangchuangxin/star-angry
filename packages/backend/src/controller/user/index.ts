import { Context, Next } from 'koa'
import UserService from '../../service/user'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import { UserModel } from '@star-angry/db'
import { Validator } from '@star-angry/shared'

export default class UserController {
  /**
   * 注册
   */
  static async register(ctx: Context) {
    const { user: { username, password, email } = {}, verification } = ctx
      .request.body as {
      user?: Partial<UserModel>
      verification?: string
    }

    if (!username || !password || !email || !verification) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    // 检验数据格式
    if (
      !Validator.isUsername(username) ||
      !Validator.isPassword(password) ||
      !Validator.isEmail(email)
    ) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.register(
      username,
      password,
      email,
      verification,
    )
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
    const { username } = (ctx.state.user?.data || {}) as UserModel
    if (!username) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.getUserInfo(username)
  }

  /**
   * 发送验证码
   */
  static async sendVerification(ctx: Context) {
    const { email } = ctx.request.body as {
      email?: string
    }

    if (!email) {
      throw new GameError(ErrorCode.PARAM_ERROR)
    }

    ctx.body = await UserService.sendVerification(email)
  }

  /**
   * 获取排行榜
   */
  static async getRank(ctx: Context) {
    ctx.body = await UserService.getRank()
  }
}

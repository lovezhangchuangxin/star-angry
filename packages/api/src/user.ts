import { UserModel } from '@star-angry/db'
import { req } from './req'

export class UserApi {
  /**
   * 注册
   */
  static async register(
    user: Pick<UserModel, 'username' | 'password' | 'email'>,
    verification: string,
  ) {
    return req<{
      token: string
      user: UserModel
    }>('POST', '/login/register', { user, verification })
  }

  /**
   * 登录
   */
  static async login(user: Pick<UserModel, 'username' | 'password'>) {
    return req<{
      token: string
      user: UserModel
    }>('POST', '/login', user)
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo() {
    return req<Omit<UserModel, 'password'>>('GET', '/user/info')
  }

  /**
   * 发送验证码
   */
  static async sendVerification(email: string) {
    return req<{ verification: string }>('POST', '/login/verification', {
      email,
    })
  }

  /**
   * 获取排行榜
   */
  static async getRank() {
    return req<
      {
        id: string
        username: string
        score: number
      }[]
    >('GET', '/user/rank')
  }
}

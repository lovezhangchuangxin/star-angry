import { UserModel } from 'packages/db/src'
import { req } from './req'

export class UserApi {
  /**
   * 注册
   */
  static async register(user: Pick<UserModel, 'username' | 'password'>) {
    return req<string>('POST', '/login/register', user)
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
    return req('POST', '/login/sendVerification', { email })
  }
}

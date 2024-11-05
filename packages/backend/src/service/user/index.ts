import { DBNames, GameDB, Role, UserModel } from '@star-angry/db'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { Result } from '../../utils/result'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'

export default class UserService {
  /**
   * 注册
   */
  static async register(username: string, password: string) {
    // 检查是否已经注册过
    const data = await GameDB.getDB().getData()
    if (data.user.find((item) => item.username === username)) {
      throw new GameError(ErrorCode.USER_EXIST)
    }
    const userInfo: UserModel = {
      id: uuidv4(),
      username,
      password,
      email: '',
      role: Role.USER,
      createTime: Date.now(),
      updateTime: Date.now(),
    }
    const { password: _, ...safeUserInfo } = userInfo
    data.user.push(userInfo)
    // 生成 jwt
    const token = jwt.sign(
      {
        data: safeUserInfo,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )
    return Result.success({ token, user: safeUserInfo })
  }

  /**
   * 登录
   */
  static async login(username: string, password: string) {
    const data = await GameDB.getDB().getData()
    const user = data.user.find((item) => item.username === username)
    if (!user || user.password !== password) {
      throw new GameError(ErrorCode.USERNAME_OR_PASSWORD_ERROR)
    }
    const { password: _, ...safeUserInfo } = user
    const token = jwt.sign(
      {
        data: safeUserInfo,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )
    return Result.success({ token, user: safeUserInfo })
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(username: string) {
    const data = await GameDB.getDB().getData()
    const user = data.user.find((item) => item.username === username)
    if (!user) {
      throw new GameError(ErrorCode.USER_NOT_EXIST)
    }
    const { password: _, ...safeUserInfo } = user
    return Result.success(safeUserInfo)
  }
}

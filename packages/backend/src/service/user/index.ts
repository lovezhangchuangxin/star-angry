import { GameDB, Role, UserModel } from '@star-angry/db'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { Result } from '../../utils/result'
import { ErrorCode } from '../../error/ErrorCode'
import { GameError } from '../../error/GameError'
import { TimeCache } from '@star-angry/shared'
import { MailUtil } from '../../utils/mail'
import StructureService from '../structure'

export default class UserService {
  static verificationCache = new TimeCache()

  /**
   * 注册
   */
  static async register(
    username: string,
    password: string,
    email: string,
    verification: string,
  ) {
    // 先检查验证码
    const cacheVerification = UserService.verificationCache.get(email)
    if (cacheVerification !== verification) {
      throw new GameError(ErrorCode.VERIFICATION_ERROR)
    }

    // 检查是否已经注册过（用户名或者邮箱相同）
    const data = await GameDB.getDB().getData()
    if (
      data.user.find(
        (item) => item.username === username || item.email === email,
      )
    ) {
      throw new GameError(ErrorCode.USER_EXIST)
    }

    // 密码加密
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    const userInfo: UserModel = {
      id: uuidv4(),
      username,
      password,
      email,
      role: Role.USER,
      createTime: Date.now(),
      updateTime: Date.now(),
    }
    const { password: _, ...safeUserInfo } = userInfo
    data.user.push(userInfo)
    GameDB.getDB().processUserData(data.user, data.userData, true)

    // 生成 jwt
    const token = jwt.sign(
      {
        data: safeUserInfo,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )
    UserService.verificationCache.delete(email)
    return Result.success({ token, user: safeUserInfo })
  }

  /**
   * 登录
   */
  static async login(username: string, password: string) {
    const data = await GameDB.getDB().getData()
    const user = data.user.find((item) => item.username === username)
    if (!user || !bcrypt.compareSync(password, user.password)) {
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

  /**
   * 发送验证码
   */
  static async sendVerification(email: string) {
    // 先看是否有缓存的验证码
    const cacheVerification = UserService.verificationCache.get(email)
    if (cacheVerification) {
      return Result.success({ cacheVerification })
    }

    const verification = Math.random().toString().slice(-6)
    try {
      await MailUtil.sendMail({
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: '星怒验证码',
        text: `验证码：${verification}`,
      })
      // 缓存验证码，5分钟有效
      UserService.verificationCache.set(email, verification, 5 * 60 * 1000)
      return Result.success({ verification })
    } catch (error) {
      // throw new GameError(ErrorCode.SEND_MAIL_ERROR)

      // 兜底：邮件发送失败则直接返回验证码
      // 缓存验证码，5分钟有效
      UserService.verificationCache.set(email, verification, 5 * 60 * 1000)
      return Result.success({ verification })
    }
  }

  /**
   * 获取排行榜
   */
  static async getRank() {
    const data = await GameDB.getDB().getData()
    const users = data.user
      .map((user) => {
        const structureMap = data.userData[user.id]?.structure || {}
        Object.values(structureMap).forEach((structure) => {
          if ('update' in structure) {
            StructureService.addIntent(user.id, structure.id, 'update')
          }
        })
        const energyStorage = structureMap.energyStorage
        const metalStorage = structureMap.metalStorage
        const store = (energyStorage?.store || 0) + (metalStorage?.store || 0)
        return {
          id: user.id,
          username: user.username,
          score: store,
        }
      })
      .sort((a, b) => b.score - a.score)
    return Result.success(users)
  }
}

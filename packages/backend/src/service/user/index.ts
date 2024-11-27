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
import { ResourceType } from '@star-angry/core'

export default class UserService {
  static verificationCache = new TimeCache()
  static userModelCache = new Map<string, UserModel>()

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
      activeTime: Date.now(),
      lastOnlineTime: Date.now(),
    }
    const { password: _, ...safeUserInfo } = userInfo
    data.user.push(userInfo)
    GameDB.getDB().addUser(userInfo.id)

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

    const verification = '888888'
    //Math.random().toString().slice(-6)
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
    const users = data.user.map((user) => {
      const userData = data.userDataMap[user.id]
      const store =
        Object.values(userData?.planets || {}).reduce(
          (prev, cur) =>
            prev +
            Object.keys(cur.resources).reduce((p, res) => {
              if (res === ResourceType.Electricity) {
                return p
              }
              return p + cur.resources[res as ResourceType]!.amount
            }, 0),
          0,
        ) || 0
      const { totalLevel, maxLevel } = Object.values(
        userData?.planets || {},
      ).reduce(
        (prev, cur) => {
          const totalLevel =
            prev.totalLevel +
            Object.values(cur.structures).reduce((p, c) => p + c.level, 0)
          const maxLevel = Math.max(
            prev.maxLevel,
            ...Object.values(cur.structures).map((c) => c.level),
          )
          return { totalLevel, maxLevel }
        },
        { totalLevel: 0, maxLevel: 0 },
      )
      const elecProd = Object.values(userData?.planets || {}).reduce(
        (prev, cur) => {
          return prev + (cur.resources.electricity?.capacity ?? 0)
        },
        0,
      )

      return {
        id: user.id,
        username: user.username,
        lastOnlineTime: user.lastOnlineTime,
        activeTime: user.activeTime,
        store,
        totalLevel,
        maxLevel,
        elecProd,
      }
    })

    users.sort((a, b) => b.elecProd - a.elecProd)
    return Result.success(users)
  }

  /**
   * 缓存 id 取用户信息
   */
  private static async getUserById(userId: string) {
    const data = await GameDB.getDB().getData()
    let user = UserService.userModelCache.get(userId)
    if (!user) {
      user = data.user.find((item) => item.id === userId)
      if (user) UserService.userModelCache.set(userId, user)
    }
    return user
  }

  /**
   * 用户活跃
   */
  static async activeUser(userId: string) {
    const user = await UserService.getUserById(userId)
    if (user) {
      user.activeTime = Date.now()
    }
  }

  /**
   * 用户在线
   */
  static async onlineUser(userId: string) {
    const user = await UserService.getUserById(userId)
    if (user) {
      user.lastOnlineTime = Date.now()
    }
  }
}

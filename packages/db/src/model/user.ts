import { structuresMap } from '@star-angry/core'

export interface UserModel {
  /**
   * 用户 id
   */
  id: string
  /**
   * 用户名
   */
  username: string
  /**
   * 密码
   */
  password: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 角色
   */
  role: Role
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 更新时间
   */
  updateTime: number
  /**
   * 活跃时间
   */
  activeTime: number
  /**
   * 最后在线时间
   */
  lastOnlineTime: number
}

export enum Role {
  USER,
  ADMIN,
}

export interface UseDataMap {
  [userId: string]: UserDataModel
}

export interface UserDataModel {
  structure: {
    [type in keyof typeof structuresMap]?: InstanceType<
      (typeof structuresMap)[type]
    >
  }
  /**
   * 更新时间
   */
  updateTime: number
}

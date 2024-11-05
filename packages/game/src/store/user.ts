import { defineStore } from 'pinia'
import type { UserModel } from '@star-angry/db'

/**
 * 用户信息
 */
type PartialUserInfo = Omit<UserModel, 'password'>

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      id: '',
      username: '',
      email: '',
      role: 0,
      createTime: 0,
      updateTime: 0,
    }) as PartialUserInfo,
  actions: {
    setUserInfo(info: Partial<PartialUserInfo>) {
      Object.assign(this, info)
    },
  },
})

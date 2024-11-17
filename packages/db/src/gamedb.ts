import { processor, Structure, StructureConfigMap } from '@star-angry/core'
import { DB, DBNames } from './db'
import { GameModel } from './model/game'
import { UseDataMap, UserModel } from './model/user'
import { EnergyStorageConfig } from 'packages/core/src/structures/base/energy-storage'
import { MetalStorageConfig } from 'packages/core/src/structures/base/metal-storage'
import { EnergyMineConfig } from 'packages/core/src/structures/base/energy-mine'
import { MetalMineConfig } from 'packages/core/src/structures/base/metal-mine'
import { MineComponent } from 'packages/core/src/components/mine'

export class GameDB extends DB {
  protected dataCache: GameModel | null = null

  static getDB() {
    if (!GameDB.dbs[DBNames.game]) {
      const db = new GameDB('dist/data/' + DBNames.game)
      GameDB.dbs[DBNames.game] = db
      db.getData()
      db.autoSave()
    }
    return GameDB.dbs[DBNames.game] as GameDB
  }

  async getData() {
    if (this.dataCache) {
      return this.dataCache
    }
    const dataJson = await this.get('game')
    if (dataJson) {
      this.dataCache = JSON.parse(dataJson) as GameModel
    } else {
      this.dataCache = this.initData()
    }
    const data = this.dataCache
    if (!data.userData) {
      data.userData = {}
    }
    if (!data.messages) {
      data.messages = {}
    }
    this.processUserData(data.user, data.userData)
    return this.dataCache
  }

  async setData(data: GameModel) {
    this.dataCache = data
    this.set('game', JSON.stringify(data))
  }

  processUserData(
    users: UserModel[],
    userDataMap: UseDataMap,
    newPlayer = false,
  ) {
    // 先初始化所有玩家的建筑
    users.forEach(({ id }) => {
      const userData = userDataMap[id] || {}
      if (!userData?.structures) {
        userData.structures = {
          [EnergyStorageConfig.name]: new Structure(EnergyStorageConfig),
          [MetalStorageConfig.name]: new Structure(MetalStorageConfig),
          [EnergyMineConfig.name]: new Structure(EnergyMineConfig),
          [MetalMineConfig.name]: new Structure(MetalMineConfig),
        }
      } else if (!newPlayer) {
        Object.keys(userData.structures).forEach((key) => {
          const structureData = userData.structures[key]
          if (!structureData) {
            return
          }
          userData.structures[key] = new Structure(
            StructureConfigMap[key],
            structureData,
          )
        })
      }
      userDataMap[id] = userData
    })

    // 再更新某些组件
    if (!newPlayer) {
      users.forEach(({ id }) => {
        const userData = userDataMap[id]
        Object.keys(userData.structures).forEach((key) => {
          const structure = userData.structures[key]
          const mineComp = structure.components.mine as
            | MineComponent
            | undefined
          if (mineComp) {
            const intent = {
              structureName: structure.name,
              componentType: 'mine',
              intentType: 'mine',
            }
            processor(intent, id, (userId: string) => {
              return userDataMap[userId].structures
            })
          }
        })
      })
    }
  }

  initData() {
    return {
      user: [],
      messages: {},
      userData: {},
    } as GameModel
  }

  autoSave() {
    setInterval(
      () => {
        if (!this.dataCache) {
          return
        }
        this.set('game', JSON.stringify(this.dataCache))
      },
      1000 * 60 * 5,
    )
  }
}

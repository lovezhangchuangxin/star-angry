import {
  EnergyStorage,
  MetalStorage,
  processor,
  structuresMap,
} from '@star-angry/core'
import { DB, DBNames } from './db'
import { GameModel } from './model/game'
import { UseDataMap, UserModel } from './model/user'

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
    users.forEach(({ id }) => {
      const userData = userDataMap[id] || {}
      if (!userData?.structure) {
        userData.structure = {
          energyStorage: new EnergyStorage({ level: 1, store: 2000 }),
          metalStorage: new MetalStorage({ level: 1, store: 2000 }),
        }
      } else if (!newPlayer) {
        Object.keys(userData.structure).forEach((key) => {
          let structure =
            userData.structure[key as keyof typeof userData.structure]
          if (!structure) {
            return
          }
          structure = new structuresMap[key as keyof typeof structuresMap](
            structure as any,
          )
          if ('update' in structure) {
            const getUserObject = (userId: string, objectId?: string) => {
              const structures = Object.values(userDataMap[userId].structure)
              if (!objectId) {
                return structures
              }
              return structures.filter((s) => s.id === objectId)
            }
            processor({ objectId: key, type: 'update' }, id, getUserObject)
          }
          userData.structure[key as keyof typeof userData.structure] =
            structure as any
        })
      }
      userDataMap[id] = userData
    })
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

import {
  DeuteriumStorage,
  EnergyStorage,
  MetalStorage,
  SolarPlant,
  Structure,
  structuresMap,
} from '@star-angry/core'
import { DB, DBNames } from './db'
import { GameModel } from './model/game'
import { UseDataMap, UserModel } from './model/user'
import { Mutex } from './AsyncLock'

const mutex = new Mutex()
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
    await mutex.lock()
    try {
      if (this.dataCache) {
        return this.dataCache
      }
      console.log('initData')
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
    } finally {
      mutex.unlock()
    }
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
          energyStorage: new EnergyStorage({ level: 0, store: 1000 }),
          metalStorage: new MetalStorage({ level: 0, store: 1000 }),
          deuteriumStorage: new DeuteriumStorage({ level: 0, store: 0 }),
          solarPlant: new SolarPlant(),
        }
      } else if (!newPlayer) {
        // 初始化建筑
        Object.keys(userData.structure).forEach((key) => {
          let structure =
            userData.structure[key as keyof typeof userData.structure]
          if (!structure) {
            return
          }
          if (!(structure instanceof Structure)) {
            structure = new structuresMap[key as keyof typeof structuresMap](
              structure as any,
            )
          }
          userData.structure[key as keyof typeof userData.structure] =
            structure as any
        })
      }
      userData.updateTime = Date.now()
      userDataMap[id] = userData
    })
    this.saveData()
  }

  initData() {
    return {
      user: [],
      messages: {},
      userData: {},
    } as GameModel
  }

  async saveData() {
    await this.set('game', JSON.stringify(this.dataCache))
    console.log('Save data finish')
  }

  autoSave() {
    setInterval(
      () => {
        if (!this.dataCache) {
          return
        }
        this.set('game', JSON.stringify(this.dataCache))
        console.log('autoSave')
      },
      1000 * 60 * 5,
    )
  }
}

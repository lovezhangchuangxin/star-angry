import { DB, DBNames } from './db'
import { GameModel } from './model/game'
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
      if (!data.userDataMap) {
        data.userDataMap = {}
      }
      if (!data.messages) {
        data.messages = {}
      }
      return this.dataCache
    } finally {
      mutex.unlock()
    }
  }

  async setData(data: GameModel) {
    this.dataCache = data
    this.set('game', JSON.stringify(data))
  }

  async addUser(userId: string) {
    const data = await this.getData()
    if (data.userDataMap[userId]) return
    data.userDataMap[userId] = {
      globals: {
        money: 0,
        xnc: 0,
      },
      planets: {},
    }
  }

  initData() {
    return {
      version: '0.0.2',
      user: [],
      messages: {},
      userDataMap: {},
      config: {
        seed: 0.63,
      },
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
      1000 * 60 * 10,
    )
  }
}

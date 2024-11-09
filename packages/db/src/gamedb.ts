import { DB, DBNames } from './db'
import { GameModel } from './model/game'

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
    const data = await this.get('game')
    if (data) {
      return (this.dataCache = JSON.parse(data) as GameModel)
    }
    return (this.dataCache = this.initData())
  }

  async setData(data: GameModel) {
    this.dataCache = data
    this.set('game', JSON.stringify(data))
  }

  initData() {
    return {
      user: [],
      messages: {},
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

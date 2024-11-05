import { DatabaseOptions, Level } from 'level'

export enum DBNames {
  game = 'game',
}

/**
 * DB 类，封装了 level 的 get、set、del 等方法
 */
export class DB {
  protected db: Level

  static dbs: Record<string, DB> = {}

  protected constructor(
    location: string,
    options: DatabaseOptions<string, string> = {
      valueEncoding: 'json',
    },
  ) {
    this.db = new Level(location, options)
  }

  static getDB(location: string, options?: DatabaseOptions<string, string>) {
    if (!DB.dbs[location]) {
      DB.dbs[location] = new DB(location, options)
    }
    return DB.dbs[location]
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.db.get(key)
    } catch (error) {
      return null
    }
  }

  async set(key: string, value: string): Promise<void> {
    return await this.db.put(key, value)
  }

  async del(key: string): Promise<void> {
    return await this.db.del(key)
  }
}

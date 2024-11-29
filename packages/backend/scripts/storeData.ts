// 操作 leveldb 数据库
import { GameDB, Role } from '@star-angry/db'
import fs from 'fs'

/**
 * 将数据写到json文件
 */
const storeData = async () => {
  try {
    const data = await GameDB.getDB().getData()
    fs.writeFileSync('dist/data.json', JSON.stringify(data))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// 傻逼了，忘调用了
storeData()

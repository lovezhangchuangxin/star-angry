// 操作 leveldb 数据库
import { GameDB, Role } from '@star-angry/db'

const [username, role] = process.argv.slice(2)
if (!username || !role) {
  console.error('请输入用户名和角色')
  process.exit(1)
}

const setRole = async () => {
  try {
    const data = await GameDB.getDB().getData()
    const user = data.user.find((item) => item.username === username)
    if (!user) {
      console.error('用户不存在')
      process.exit(1)
    }

    if (!Object.values(Role).includes(+role)) {
      console.error('角色不存在')
      process.exit(1)
    }

    user.role = +role as Role
    await GameDB.getDB().setData(data)
    console.log('设置成功')
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

setRole()

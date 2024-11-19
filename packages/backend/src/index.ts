import { GameDB } from '@star-angry/db'
import { server } from './app/server'
import StructureService from './service/structure'

server.listen(process.env.GAME_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.GAME_PORT}`)
  StructureService.execIntent()
})

const handleStop = () => {
  console.log('Server is stopping...')
  GameDB.getDB()
    .saveData()
    .then(() => {
      process.exit(0)
    })
}

process.on('SIGTERM', handleStop)
process.on('SIGINT', handleStop)

import { server } from './app/server'

server.listen(process.env.GAME_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.GAME_PORT}`)
})

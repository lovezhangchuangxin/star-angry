import GameController from '../../controller/game'
import KoaRouter from 'koa-router'

const gameRouter = new KoaRouter({
  prefix: '/game',
})

gameRouter.get('/myData', GameController.getMyData)

export default gameRouter

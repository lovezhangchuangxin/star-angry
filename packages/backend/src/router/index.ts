import KoaRouter from 'koa-router'
import userRouter from './user'

const routes = [userRouter]
const router = new KoaRouter()

routes.forEach((route) => {
  router.use(route.routes(), route.allowedMethods())
})

export default router

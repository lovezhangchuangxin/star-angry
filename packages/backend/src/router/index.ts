import KoaRouter from 'koa-router'
import userRouter from './user'
import structureRouter from './structure'

const routes = [userRouter, structureRouter]
const router = new KoaRouter({
  prefix: '/api',
})

routes.forEach((route) => {
  router.use(route.routes(), route.allowedMethods())
})

export default router

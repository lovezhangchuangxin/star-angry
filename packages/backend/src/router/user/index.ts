import UserController from '../../controller/user'
import KoaRouter from 'koa-router'

const userRouter = new KoaRouter()

userRouter.post('/login/register', UserController.register)

userRouter.post('/login', UserController.login)

userRouter.get('/user/info', UserController.getUserInfo)

export default userRouter

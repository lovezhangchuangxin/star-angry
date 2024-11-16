import UserController from '../../controller/user'
import KoaRouter from 'koa-router'

const userRouter = new KoaRouter()

userRouter.post('/login/register', UserController.register)

userRouter.post('/login', UserController.login)

userRouter.post('/login/verification', UserController.sendVerification)

userRouter.get('/user/info', UserController.getUserInfo)

userRouter.get('/user/rank', UserController.getRank)

userRouter.get('/user/levelRank', UserController.getLevelRank)

export default userRouter

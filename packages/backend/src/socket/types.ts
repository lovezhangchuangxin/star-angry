import { UserModel } from '@star-angry/db'
import 'socket.io'

declare module 'socket.io' {
  interface Socket {
    userId?: string
    userInfo?: Partial<UserModel>
  }
}

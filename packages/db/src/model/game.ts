import { MessageMap } from './message'
import { UserModel } from './user'

export interface GameModel {
  user: UserModel[]
  messages: MessageMap
}

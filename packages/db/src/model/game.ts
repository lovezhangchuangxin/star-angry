import { MessageMap } from './message'
import { UseDataMap, UserModel } from './user'

export interface GameModel {
  user: UserModel[]
  messages: MessageMap
  userData: UseDataMap
}

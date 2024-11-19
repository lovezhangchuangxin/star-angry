import { componentHandlers } from './components'
import { GameEventEmitter } from './event/event'

export const gameEventEmitter = new GameEventEmitter()

// 注册组件
componentHandlers.forEach((handlers) => {
  Object.keys(handlers).forEach((name) => {
    gameEventEmitter.on(name, handlers[name])
  })
})

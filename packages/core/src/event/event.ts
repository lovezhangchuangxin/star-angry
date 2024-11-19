import { GameEventHandler, GameEventModel } from './types'

/**
 * 游戏事件管理器，发布订阅模式
 */
export class GameEventEmitter {
  public events: {
    [name: string]: GameEventHandler[]
  } = {}

  /**
   * 订阅事件
   * @param name 事件名称
   * @param handler 事件处理函数
   */
  public on(
    name: string,
    handler: GameEventHandler,
    scope: string = 'star-angry',
  ) {
    name = `${scope}:${name}`
    if (!this.events[name]) {
      this.events[name] = []
    }
    this.events[name].push(handler)
  }

  /**
   * 发布事件
   *
   * @param event 事件对象
   */
  public emit(event: GameEventModel) {
    const name = `${event.scope}:${event.name}`
    const handlers = this.events[name] || []
    try {
      handlers.forEach((handler) => handler(event))
    } catch (error) {
      // TODO
    }
  }
}

import { structuresMap } from 'packages/core/src'
import { req } from './req'

export class StructureApi {
  /**
   * 获取我的建组
   */
  static async getStructures() {
    return req<{
      [type in keyof typeof structuresMap]: ConstructorParameters<
        (typeof structuresMap)[type]
      >
    }>('GET', '/structure')
  }
}

import { ComponentType } from '../components'
import { Structure } from '../structures/types'
import level from './components/level'
import mine from './components/mine'
import store from './components/store'

const handlerMap = {
  level,
  store,
  mine,
}

const getHandler = (componentType: ComponentType, intentType: string) => {
  const handler = handlerMap[componentType]
  if (!handler) {
    return null
  }
  return handler[intentType]
}

/**
 * 处理 intent
 * @param intent 意图
 * @param userId 用户 id
 * @param getUserStructures
 * @returns
 */
export const processor = (
  intent: any,
  userId: string,
  getUserStructures: (userId: string) => Record<string, Structure>,
) => {
  const { structureName, componentType, intentType } = intent || {}
  const handler = getHandler(componentType, intentType)
  if (!handler) {
    return false
  }

  const structure = getUserStructures(userId)[structureName]
  if (!structure) {
    return false
  }

  const component = structure.components[componentType as ComponentType]
  if (!component) {
    return false
  }

  intent.userId = userId
  return handler(intent, component, structure, getUserStructures)
}

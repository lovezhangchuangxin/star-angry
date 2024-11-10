import { StructureType } from '../structure'
import { getIntentHandler } from './intents'

export const processor = (
  intent: any,
  userId: string,
  getUserObject: (userId: string, objectId?: string) => StructureType[],
) => {
  const { objectId, type } = intent
  const object = getUserObject(userId, objectId)[0]
  if (!object) {
    return false
  }

  const handler = getIntentHandler(object, type)
  if (!handler) {
    return false
  }

  const planetObjects = getUserObject(userId)
  return handler(object as any, planetObjects)
}

import { getIntentHandler } from './intents'

export const processor = (intent: any, userObject: any) => {
  const { objectId, type } = intent
  const object = userObject[objectId]
  if (!object) {
    return false
  }

  const handler = getIntentHandler(object, type)
  if (!handler) {
    return false
  }

  return handler(object as any, Object.values(userObject))
}

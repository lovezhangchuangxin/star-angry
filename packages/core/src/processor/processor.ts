import { StructureConfigs } from '../config'
import { getOperationHandler } from '../structure'
import { UserDataMap } from '../utils'

export const processor = (
  params: {
    userId: string
    planetId: string
    structureId: string
    operation: string
  },
  userDataMap: UserDataMap,
) => {
  const { userId, planetId, structureId, operation } = params
  if (!userId || !planetId || !structureId || !operation) {
    return false
  }

  const operationHanlder = getOperationHandler(structureId, operation)
  if (!operationHanlder) {
    return false
  }

  const planetData = userDataMap[userId].planets[planetId]
  const data = planetData.structures[structureId]

  return operationHanlder?.(params, data, StructureConfigs, planetData)
}

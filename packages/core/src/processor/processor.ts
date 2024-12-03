import { StructureConfigs } from '../config'
import { getOperationHandler } from '../structure'
import { StructureOperationParams, UserDataMap } from '../utils'

export const processor = (
  params: StructureOperationParams,
  userDataMap: UserDataMap,
) => {
  const { userId, planetId, structureId, operation } = params
  if (!userId || !planetId || !structureId || !operation) {
    return false
  }

  // 以 _ 开头的操作为私有的操作，不允许用户调用
  if (operation.includes('_')) {
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

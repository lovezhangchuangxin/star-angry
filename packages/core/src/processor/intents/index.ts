import { StructureType } from '../../structure'
import energyMineIntents from './energy-mine'
import energyStorageIntents from './energy-storage'
import metalMineIntents from './metal-mine'
import metalStorageIntents from './metal-storage'

const intentsMap = {
  energyMine: energyMineIntents,
  energyStorage: energyStorageIntents,
  metalMine: metalMineIntents,
  metalStorage: metalStorageIntents,
}

export const getIntentHandler = (object: StructureType, type: string) => {
  const intents = intentsMap[object.id as keyof typeof intentsMap]
  if (!intents) {
    return
  }

  return intents[type as keyof typeof intents]
}

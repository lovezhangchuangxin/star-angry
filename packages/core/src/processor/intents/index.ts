import { StructureType } from '../../structure'
import energyMineIntents from './energy-mine'
import energyStorageIntents from './energy-storage'
import metalMineIntents from './metal-mine'
import metalStorageIntents from './metal-storage'
import deuteriumSintetizerIntents from './deuterium-sintetizer'
import deuteriumStorageIntents from './deuterium-storage'
import solarPlantIntents from './solar-plant'
import fusionPlantIntents from './fusion-plant'

const intentsMap = {
  energyMine: energyMineIntents,
  energyStorage: energyStorageIntents,
  metalMine: metalMineIntents,
  metalStorage: metalStorageIntents,
  deuteriumSintetizer: deuteriumSintetizerIntents,
  deuteriumStorage: deuteriumStorageIntents,
  solarPlant: solarPlantIntents,
  fusionPlant: fusionPlantIntents,
}

export const getIntentHandler = (object: StructureType, type: string) => {
  const intents = intentsMap[object.id as keyof typeof intentsMap]
  if (!intents) {
    return
  }

  return intents[type as keyof typeof intents]
}

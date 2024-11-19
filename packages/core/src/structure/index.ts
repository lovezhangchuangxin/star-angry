import { DeuteriumSintetizer } from './deuterium-sintetizer'
import { DeuteriumStorage } from './deuterium-storage'
import { EnergyMine } from './energy-mine'
import { EnergyStorage } from './energy-storage'
import { FusionPlant } from './fusion-plant'
import { MetalMine } from './metal-mine'
import { MetalStorage } from './metal-storage'
import { SolarPlant } from './solar-plant'

export {
  EnergyMine,
  EnergyStorage,
  MetalMine,
  MetalStorage,
  DeuteriumSintetizer,
  DeuteriumStorage,
  SolarPlant,
  FusionPlant,
}
export * from './structure'

export type StructureType =
  | EnergyMine
  | EnergyStorage
  | MetalMine
  | MetalStorage
  | DeuteriumSintetizer
  | DeuteriumStorage
  | SolarPlant
  | FusionPlant

export const structuresMap = {
  energyMine: EnergyMine,
  energyStorage: EnergyStorage,
  metalMine: MetalMine,
  metalStorage: MetalStorage,
  deuteriumSintetizer: DeuteriumSintetizer,
  deuteriumStorage: DeuteriumStorage,
  solarPlant: SolarPlant,
  fusionPlant: FusionPlant,
}

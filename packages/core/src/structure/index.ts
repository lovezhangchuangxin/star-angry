import { EnergyMine } from './energy-mine'
import { EnergyStorage } from './energy-storage'
import { MetalMine } from './metal-mine'
import { MetalStorage } from './metal-storage'

export { EnergyMine, EnergyStorage, MetalMine, MetalStorage }
export * from './structure'

export type StructureType =
  | EnergyMine
  | EnergyStorage
  | MetalMine
  | MetalStorage

export const structuresMap = {
  energyMine: EnergyMine,
  energyStorage: EnergyStorage,
  metalMine: MetalMine,
  metalStorage: MetalStorage,
}

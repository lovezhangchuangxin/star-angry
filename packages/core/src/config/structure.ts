import { StructureConfig } from '../structure/types'
import { ResourceType } from './resource'

export const StructureConfigs: StructureConfig = {
  solarPlant: {
    id: 'solarPlant',
    name: '太阳能电站',
    description: '太阳能电站，可以生产电能',
    type: 'producer',
    getUpgradeCost: (level) => ({
      energy: Math.floor(30 * Math.pow(1.5, level)),
      metal: Math.floor(75 * Math.pow(1.5, level)),
    }),
    getProduceSpeed: (level) => ({
      electricity: Math.floor(20 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
    priority: 100,
  },

  energyMine: {
    id: 'energyMine',
    name: '能量矿场',
    description: '能量矿场，可以生产能量',
    type: 'producer',
    getUpgradeCost: (level) => ({
      energy: Math.floor(24 * Math.pow(1.5, level)),
      metal: Math.floor(48 * Math.pow(1.5, level)),
    }),
    getProduceSpeed: (level) => ({
      energy: Math.floor(20 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
    getConsumeSpeed: (level) => ({
      electricity: Math.ceil(10 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
  },

  energyStorage: {
    id: 'energyStorage',
    name: '能量仓库',
    description: '能量仓库，用于存储能量',
    type: 'storage',
    resource: ResourceType.Energy,
    getUpgradeCost: (level) => ({
      energy: Math.floor(1000 * Math.pow(2, level)),
      metal: Math.floor(2000 * Math.pow(2, level)),
    }),
    capacity: (level) =>
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 1000,
  },

  metalMine: {
    id: 'metalMine',
    name: '金属矿场',
    description: '金属矿场，可以生产金属',
    type: 'producer',
    getUpgradeCost: (level) => ({
      energy: Math.floor(15 * Math.pow(1.5, level)),
      metal: Math.floor(60 * Math.pow(1.5, level)),
    }),
    getProduceSpeed: (level) => ({
      metal: Math.floor(30 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
    getConsumeSpeed: (level) => ({
      electricity: Math.ceil(10 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
  },

  metalStorage: {
    id: 'metalStorage',
    name: '金属仓库',
    description: '金属仓库，用于存储金属',
    type: 'storage',
    resource: ResourceType.Metal,
    getUpgradeCost: (level) => ({
      energy: 0,
      metal: Math.floor(2000 * Math.pow(2, level)),
    }),
    capacity: (level) =>
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 1000,
  },

  deuteriumSintetizer: {
    id: 'deuteriumSintetizer',
    name: '重氢精炼厂',
    description: '重氢精炼厂，可以生产重氢',
    type: 'producer',
    getUpgradeCost: (level) => ({
      energy: Math.floor(75 * Math.pow(1.5, level)),
      metal: Math.floor(225 * Math.pow(1.5, level)),
    }),
    getProduceSpeed: (level) => ({
      deuterium: Math.floor(
        10 * level * Math.pow(1.1, level) * (-0.002 * 30 + 1.28) * (0.1 * 11),
      ),
    }),
    getConsumeSpeed: (level) => ({
      electricity: Math.ceil(30 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
  },

  deuteriumStorage: {
    id: 'deuteriumStorage',
    name: '重氢仓库',
    description: '重氢仓库，用于存储重氢',
    type: 'storage',
    resource: ResourceType.Deuterium,
    getUpgradeCost: (level) => ({
      energy: Math.floor(2000 * Math.pow(2, level)),
      metal: Math.floor(2000 * Math.pow(2, level)),
    }),
    capacity: (level) =>
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 1000,
  },

  planetaryEngine: {
    id: 'planetaryEngine',
    name: '行星发动机',
    description: '行星发动机，用于驾驶行星',
    type: 'producer',
    getUpgradeCost: (level) => ({
      energy: Math.floor(360 * Math.pow(2, level)),
      metal: Math.floor(900 * Math.pow(2, level)),
      deuterium: Math.floor(180 * Math.pow(2, level)),
    }),
    getProduceSpeed: (level) => ({
      electricity: Math.floor(
        30 * level * Math.pow(1.05, level) * (0.1 * 11) * 100,
      ),
    }),
    getConsumeSpeed: (level) => ({
      deuterium: Math.ceil(10 * level * Math.pow(1.1, level) * (0.1 * 11)),
    }),
    priority: 120,
  },
}

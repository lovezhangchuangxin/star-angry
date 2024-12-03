import { StructureConfig } from '../structure/types'
import { AttackType } from './combat'
import { ResourceType } from './resource'

/**
 * 基地建筑
 */
export const BaseStructureConfigs: StructureConfig = {
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
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 50,
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
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 50,
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
      Math.floor(2.5 * Math.pow(1.8331954764, level)) * 5000 * 50,
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

/**
 * 科技建筑
 */
export const TechnologyStructureConfigs: StructureConfig = {
  'spy-technology': {
    id: 'spy-technology',
    name: '间谍技术',
    description: '间谍技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'computer-technology': {
    id: 'computer-technology',
    name: '计算机技术',
    description: '计算机技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'weapons-technology': {
    id: 'weapons-technology',
    name: '武器技术',
    description: '武器技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'shield-technology': {
    id: 'shield-technology',
    name: '护盾技术',
    description: '护盾技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'armor-technology': {
    id: 'armor-technology',
    name: '装甲技术',
    description: '装甲技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'energy-technology': {
    id: 'energy-technology',
    name: '能量技术',
    description: '能量技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'hyperspace-technology': {
    id: 'hyperspace-technology',
    name: '超空间技术',
    description: '超空间技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'combustion-technology': {
    id: 'combustion-technology',
    name: '燃烧技术',
    description: '燃烧技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'laser-technology': {
    id: 'laser-technology',
    name: '激光技术',
    description: '激光技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'ion-technology': {
    id: 'ion-technology',
    name: '离子技术',
    description: '离子技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
  'plasma-technology': {
    id: 'plasma-technology',
    name: '等离子技术',
    description: '等离子技术',
    type: 'technology',
    getUpgradeCost: (level) => ({
      energy: Math.floor(100 * Math.pow(1.5, level)),
      metal: Math.floor(200 * Math.pow(1.5, level)),
    }),
  },
}

/**
 * 防御建筑
 */
export const DefenseStructureConfigs: StructureConfig = {
  'standard-tower': {
    id: 'standard-tower',
    name: '普通炮塔',
    description: '普通炮塔',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 15000,
      metal: 5000,
    }),
    health: 1000,
    shield: 500,
    attack: {
      [AttackType.Ballistic]: 100,
    },
  },
  'heavy-tower': {
    id: 'heavy-tower',
    name: '重型炮塔',
    description: '重型炮塔',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 100000,
      metal: 50000,
    }),
    health: 3000,
    shield: 2000,
    attack: {
      [AttackType.Ballistic]: 1000,
    },
  },
  'missile-launcher': {
    id: 'missile-launcher',
    name: '导弹发射器',
    description: '导弹发射器',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 300000,
      metal: 200000,
    }),
    health: 10000,
    shield: 10000,
    attack: {
      [AttackType.Missile]: 5000,
    },
  },
  'ion-cannon': {
    id: 'ion-cannon',
    name: '离子炮',
    description: '离子炮',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 50000,
      metal: 100000,
    }),
    health: 2000,
    shield: 2000,
    attack: {
      [AttackType.Ion]: 2000,
    },
  },
  'plasma-cannon': {
    id: 'plasma-cannon',
    name: '等离子炮',
    description: '等离子炮',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 80000,
      metal: 200000,
    }),
    health: 8000,
    shield: 8000,
    attack: {
      [AttackType.Plasma]: 3000,
    },
  },
  'light-laser-tower': {
    id: 'light-laser-tower',
    name: '轻型激光塔',
    description: '轻型激光塔',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 5000,
      metal: 1000,
    }),
    health: 100,
    shield: 50,
    attack: {
      [AttackType.Laser]: 10,
    },
  },
  'heavy-laser-tower': {
    id: 'heavy-laser-tower',
    name: '重型激光塔',
    description: '重型激光塔',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 50000,
      metal: 10000,
    }),
    health: 300,
    shield: 200,
    attack: {
      [AttackType.Laser]: 400,
    },
  },
  'small-shield': {
    id: 'small-shield',
    name: '小型护盾',
    description: '小型护盾',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 10000000,
      metal: 5000000,
    }),
    health: 10000,
    shield: 50000,
  },
  'large-shield': {
    id: 'large-shield',
    name: '大型护盾',
    description: '大型护盾',
    type: 'defense',
    getUpgradeCost: () => ({
      energy: 100000000,
      metal: 500000000,
    }),
    health: 100000,
    shield: 500000,
  },
}

export const StructureConfigs: StructureConfig = {
  ...BaseStructureConfigs,
  ...TechnologyStructureConfigs,
  ...DefenseStructureConfigs,
}

// 基地建筑在前端的展示顺序，数字越小越靠前
export const BaseStructureOrder: {
  [structureId: string]: number
} = {
  metalStorage: 1,
  metalMine: 2,
  energyStorage: 3,
  energyMine: 4,
  deuteriumStorage: 5,
  deuteriumSintetizer: 6,
  solarPlant: 7,
  planetaryEngine: 8,
}

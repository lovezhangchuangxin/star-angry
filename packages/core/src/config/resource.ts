/**
 * 资源类型
 */
export enum ResourceType {
  Energy = 'energy',
  Metal = 'metal',
  Deuterium = 'deuterium',
  Electricity = 'electricity',
}

/**
 * 资源名称
 */
export const ResourceName: {
  [key in ResourceType]: string
} = {
  [ResourceType.Energy]: '能量',
  [ResourceType.Metal]: '金属',
  [ResourceType.Deuterium]: '重氢',
  [ResourceType.Electricity]: '电能',
}

/**
 * 瞬时的资源，如电能，不需要存储
 */
export const InstantResource: {
  [key in ResourceType]?: boolean
} = {
  [ResourceType.Electricity]: true,
}

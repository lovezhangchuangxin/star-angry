import {
  componentClassMap,
  ComponentDefaultConfigMap,
  ComponentType,
} from '../components'
import { Component } from '../components/types'
import { AnyObject } from '../utils/types'

/**
 * 建筑组件
 */
export type StructureComponentMap = Record<ComponentType, Component>

/**
 * 组件配置
 */
export type StructureComponentDataMap = Record<ComponentType, AnyObject>

/**
 * 建筑配置
 */
export interface StructureConfig {
  /**
   * 建筑名称
   */
  name: string
  /**
   * 建筑描述
   */
  desc: string
  /**
   * 建筑的图片地址
   */
  image?: string
  /**
   * 组件配置
   */
  componentConfig: Partial<ComponentDefaultConfigMap>
}

/**
 * 建筑存储数据
 */
export interface StructureData {
  /**
   * 组件数据
   */
  components: Partial<StructureComponentDataMap>
}

/**
 * 建筑基类
 */
export class Structure {
  /**
   * 建筑名称
   */
  name: string
  /**
   * 建筑描述
   */
  desc: string
  /**
   * 建筑的图片地址
   */
  image?: string
  /**
   * 组件
   */
  components: Partial<StructureComponentMap> = {}

  /**
   * @param componentData 组件数据
   */
  constructor(
    structureConfig: StructureConfig,
    structureData: StructureData = {
      components: {},
    },
  ) {
    this.name = structureConfig.name
    this.desc = structureConfig.desc
    this.image = structureConfig.image
    this.initComponents(
      structureConfig.componentConfig,
      structureData.components,
    )
  }

  /**
   * 初始化组件
   */
  initComponents(
    componentConfig: Partial<ComponentDefaultConfigMap>,
    componentData: Partial<StructureComponentDataMap>,
  ) {
    this.components = Object.keys(componentConfig).reduce((acc, key) => {
      const type = key as ComponentType
      const ctor = componentClassMap[type]
      acc[type] = new ctor(
        componentConfig[type] as any,
        componentData[type] as any,
      )
      return acc
    }, {} as StructureComponentMap)
  }

  /**
   * 获取指定类型组件
   */
  get<T extends Component>(type: ComponentType): T {
    return this.components[type] as T
  }

  /**
   * 添加组件
   */
  add<T extends Component>(component: T) {
    this.components[
      (component.constructor as typeof Component).type as ComponentType
    ] = component
  }

  /**
   * json 序列化
   */
  toJSON() {
    return {
      components: Object.keys(this.components).reduce((acc, key) => {
        const type = key as ComponentType
        acc[type] = this.components[type]!.toJSON()
        return acc
      }, {} as StructureComponentDataMap),
    } as StructureData
  }
}

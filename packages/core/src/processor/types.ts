import { Component } from '../components/types'
import { Structure } from '../structures/types'
import { AnyObject } from '../utils/types'

/**
 * 处理器类型
 *
 * @param params 参数
 * @param component 组件
 * @param structure 建筑
 * @param getUserStructures 获取用户建筑
 *
 * @returns 是否成功
 */
export type HandlerFuncType<T extends AnyObject, U extends Component> = (
  params: T,
  component: U,
  structure: Structure,
  getUserStructures: (userId: string) => Record<string, Structure>,
) => boolean

import fs from 'fs'
import { GameDB } from '@star-angry/db'
import {
  PlanetData,
  PlanetResource,
  ProducerData,
  ResourceType,
  StorageConfig,
  StructureConfigs,
} from '@star-angry/core'

/**
 * 建筑到资源的映射
 */
export const structureToResourceMap: Record<string, ResourceType> = {
  energyStorage: ResourceType.Energy,
  metalStorage: ResourceType.Metal,
  deuteriumStorage: ResourceType.Deuterium,
}

/**
 * 旧游戏数据迁移
 */
const migrate = async () => {
  try {
    const data = await GameDB.getDB().getData()
    data.version ||= '0.0.0'
    // 先保存一下
    const path = `dist/game@${data.version}.json`
    if (!fs.existsSync(path)) {
      console.log('备份数据')
      fs.writeFileSync(path, JSON.stringify(data))
    }

    console.log('开始迁移')
    if (data.version === '0.0.0') {
      if (!data.userDataMap) {
        data.userDataMap = {}
      }
      Object.keys((data as any).userData).forEach((userId) => {
        const oldUserData = (data as any).userData[userId]
        const structures = Object.keys(oldUserData.structure).reduce(
          (structureMap, structureId) => {
            const oldStructureData = oldUserData.structure[structureId]
            // 有个建筑改名了，处理一下，fusionPlant -> planetaryEngine
            const newStructureId =
              structureId === 'fusionPlant' ? 'planetaryEngine' : structureId
            structureMap[newStructureId] = {
              id: newStructureId,
              level: oldStructureData.level,
              lastUpdateTime: Date.now(),
            }
            // 生产类型的建筑
            if (StructureConfigs[newStructureId].type === 'producer') {
              ;(structureMap[newStructureId] as ProducerData).produceSpeed =
                StructureConfigs[newStructureId].getProduceSpeed?.(
                  oldStructureData.level,
                  data.userDataMap,
                ) || {}
              ;(structureMap[newStructureId] as ProducerData).consumeSpeed =
                StructureConfigs[newStructureId].getConsumeSpeed?.(
                  oldStructureData.level,
                ) || {}
            } else if (StructureConfigs[newStructureId].type === 'storage') {
              // 存储类型的建筑
              // 暂时没有其他数据
            }

            return structureMap
          },
          {} as PlanetData['structures'],
        )
        const resources = Object.keys(oldUserData.structure).reduce(
          (resourceMap, structureId) => {
            const oldStructureData = oldUserData.structure[structureId]
            if ('store' in oldStructureData) {
              const resourceType = structureToResourceMap[structureId]
              if (resourceType) {
                resourceMap[resourceType] = {
                  amount: oldStructureData.store,
                  capacity: (
                    StructureConfigs[structureId] as StorageConfig
                  ).capacity(oldStructureData.level),
                }
              }
            }
            return resourceMap
          },
          {} as PlanetResource,
        )

        data.userDataMap[userId] = {
          globals: {
            money: 0,
            xnc: 0,
          },
          planets: {
            0: {
              name: '星球1',
              level: 1,
              speed: 0,
              position: {
                x: 0,
                y: 0,
              },
              targetPosition: {
                x: 0,
                y: 0,
              },
              resources,
              structures,
            },
          },
        }
      })

      data.version = '0.0.1'
    }

    await GameDB.getDB().setData(data)
    console.log('迁移完成')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

migrate()

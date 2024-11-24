import { GameDB } from '@star-angry/db'
import {
  PlanetData,
  PlanetResource,
  ProducerData,
  ResourceType,
  StorageConfig,
  StructureConfigs,
} from '@star-angry/core'
import fs from 'fs'

/**
 * 建筑到资源的映射
 */
export const structureToResourceMap: Record<string, ResourceType> = {
  energyStorage: ResourceType.Energy,
  metalStorage: ResourceType.Metal,
  deuteriumStorage: ResourceType.Deuterium,
}

/**
 * 比较两个版本号
 * @param version1 - 第一个版本号
 * @param version2 - 第二个版本号
 * @returns - 如果 version1 > version2 返回 1，如果 version1 < version2 返回 -1，如果相等返回 0
 */
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)

  const maxLength = Math.max(v1Parts.length, v2Parts.length)

  for (let i = 0; i < maxLength; i++) {
    const v1 = v1Parts[i] || 0
    const v2 = v2Parts[i] || 0

    if (v1 > v2) {
      return 1
    } else if (v1 < v2) {
      return -1
    }
  }

  return 0
}

/**
 * 旧游戏数据迁移
 */
const transfromData = async () => {
  try {
    const data = await GameDB.getDB().getData()
    if (compareVersions(data.version || '0.0.0', '0.0.1') >= 0) {
      console.log('已是最新版本，无需迁移')
      process.exit(0)
    }

    console.log('开始迁移')
    data.version = '0.0.1'

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
          1: {
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
    await GameDB.getDB().setData(data)
    // 顺便写到文件看一下效果
    fs.writeFileSync('dist/game.json', JSON.stringify(data, null, 2))
    console.log('迁移完成')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

transfromData()

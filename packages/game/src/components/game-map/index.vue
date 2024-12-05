<template>
  <div id="universe"></div>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { inject, onMounted, Ref, ref } from 'vue'
import { Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import { PlanetData, UniverseMap } from '@star-angry/core'
import { debounce } from '@star-angry/shared'
import { ElMessageBox } from 'element-plus'

interface MapObjectData {
  seed: number
  chunkObjects: {
    [chunkId: number]: {
      userId?: string
      userName?: string
      planet: PlanetData
    }[]
  }
  occupiedPlanets: Record<number, number[]>
}

const socket = inject<Ref<Socket>>('socket')
const mapObjectData = ref<MapObjectData>()
const myPlanets = ref<Record<string, PlanetData>>()
// 仅用于提供一些操作方法，不用于真实的地图渲染
const blankMap = new UniverseMap(0)

onMounted(() => {
  getMyPlanets()

  const stage = new Konva.Stage({
    container: 'universe',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
    scale: {
      x: 6,
      y: 6,
    },
  })

  const layer = new Konva.Layer()
  stage.add(layer)

  render(stage, layer)
  stage.on('dragmove', () => {
    render(stage, layer)
  })

  layer.on('mouseenter', function (evt) {
    const target = evt.target
    if (target.id().startsWith('planet') && target instanceof Konva.Circle) {
      stage.container().style.cursor = 'pointer'
    }
  })

  layer.on('mouseleave', function (evt) {
    const target = evt.target
    if (target.id().startsWith('planet') && target instanceof Konva.Circle) {
      stage.container().style.cursor = 'default'
    }
  })

  layer.on('dblclick', function (evt) {
    const target = evt.target
    if (target.id().startsWith('planet') && target instanceof Konva.Circle) {
      if (!myPlanets.value) {
        toast.warn('正在获取我的星球数据，请稍后再试')
        return
      }
      if (Object.keys(myPlanets.value).length) {
        return
      }
      const planetId = +target.id().split('-')[1]
      registerPlanet(planetId.toString())
    }
  })

  window.addEventListener('resize', () => {
    stage.width(window.innerWidth)
    stage.height(window.innerHeight)
    render(stage, layer)
  })

  window.addEventListener('wheel', (e) => {
    const pointerPos = stage.getPointerPosition()
    if (!pointerPos) {
      return
    }

    const scaleBy = 1.1
    const oldScale = stage.scaleX()
    const mousePointTo = {
      x: pointerPos.x / oldScale - stage.x() / oldScale,
      y: pointerPos.y / oldScale - stage.y() / oldScale,
    }

    let newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    newScale = Math.min(10, Math.max(2, newScale))
    stage.scale({ x: newScale, y: newScale })

    const newPos = {
      x: -(mousePointTo.x - pointerPos.x / newScale) * newScale,
      y: -(mousePointTo.y - pointerPos.y / newScale) * newScale,
    }
    stage.position(newPos)
    // 缩小才重新渲染，放大不用
    if (e.deltaY > 0) {
      render(stage, layer)
    }
  })
})

/**
 * 获取指定区块的物体
 */
const getMapObject = (
  chunkIds: number[],
  callback: (mapObjectData: MapObjectData) => void,
) => {
  if (!socket?.value) {
    return
  }

  socket.value
    .timeout(5000)
    .emit('getObjectsFromChunks', chunkIds, (err: any, response: any) => {
      if (err) {
        toast.error('获取地图数据失败')
        console.log(err)
      } else if (response.code === 0) {
        mapObjectData.value = response.data
        callback(mapObjectData.value!)
      } else {
        toast.error(response.msg)
      }
    })
}

/**
 * 获取我的星球
 */
const getMyPlanets = () => {
  if (!socket?.value) {
    return
  }

  socket.value.timeout(5000).emit('getMyPlanets', (err: any, response: any) => {
    if (err) {
      toast.error('获取我的星球失败')
    } else if (response.code === 0) {
      myPlanets.value = response.data
      if (!Object.keys(myPlanets.value || {}).length) {
        ElMessageBox.alert(
          '您暂无星球，请在地图上挑选星球，双击该星球即可确认',
          '',
          {
            autofocus: false,
            confirmButtonText: '确认',
          },
        )
      }
    } else {
      toast.error(response.msg)
    }
  })
}

/**
 * 注册星球
 */
const registerPlanet = (planetId: string) => {
  if (!socket?.value) {
    return
  }

  socket.value
    .timeout(5000)
    .emit('registerPlanet', planetId, (err: any, response: any) => {
      if (err) {
        toast.error('注册星球失败')
      } else if (response.code === 0) {
        toast.success('注册星球成功')
      } else {
        toast.error(response.msg)
      }
    })
}

/**
 * 渲染可视区的物体
 */
const render = debounce((stage: Konva.Stage, layer: Konva.Layer) => {
  // 先获取可视区域的坐标范围
  const scale = stage.scaleX()
  const x = -stage.x() / scale
  const y = -stage.y() / scale
  const width = stage.width() / scale
  const height = stage.height() / scale
  // 多取一些
  const chunkIds = blankMap.getChunks(
    Math.floor(x - width / 3),
    Math.floor(y - width / 3),
    Math.floor(x + (width * 4) / 3),
    Math.floor(y + (height * 4) / 3),
  )

  getMapObject(chunkIds, (mapObjectData) => {
    const { seed, chunkObjects, occupiedPlanets } = mapObjectData
    const universeMap = new UniverseMap(seed)
    chunkIds.forEach((chunkId) => {
      // 先判断是否已经存在
      const chunkGroup = layer.find(`#${chunkId}`)[0]
      if (chunkGroup) {
        return
      }

      const group = new Konva.Group({
        id: chunkId.toString(),
      })

      const planets = universeMap.getPlanets(chunkId)
      const occupiedPlanetSets = new Set(occupiedPlanets[chunkId])
      planets.forEach((planet) => {
        const planetX = planet[0]
        const planetY = planet[1]
        const planetId = universeMap.getBlockId(planetX, planetY)

        if (occupiedPlanetSets?.has(planetId)) {
          return
        }

        const [circle, text] = getPlanetObject(
          layer,
          planetId,
          planetX,
          planetY,
        )
        group.add(circle, text)
      })

      chunkObjects[chunkId]?.forEach((data) => {
        const { planet, userId, userName } = data
        const [circle, text] = getPlanetObject(
          layer,
          +planet.id,
          planet.position[0],
          planet.position[1],
          userName,
        )
        circle.fill(userId ? '#f4d2d2' : '#e1d2f4')
        group.add(circle, text)
      })

      layer.add(group)
    })
  })

  // 移除不在可视区域的chunk
  const chunkIdsSet = new Set(chunkIds.map((id) => id.toString()))
  layer.children.forEach((child) => {
    if (!chunkIdsSet.has(child.id())) {
      child.destroy()
    }
  })
}, 100)

function getPlanetObject(
  layer: Konva.Layer,
  planetId: number,
  planetX: number,
  planetY: number,
  username?: string,
) {
  const circle =
    layer.find<Konva.Circle>(`#planet-${planetId}`)[0] ??
    new Konva.Circle({
      id: `planet-${planetId}`,
      radius: 2,
      fill: '#e1d2f4',
      stroke: 'black',
      strokeWidth: 0.1,
    })
  circle.x(planetX)
  circle.y(planetY)

  const text =
    layer.find<Konva.Text>(`#planet-${planetId}-label`)[0] ??
    new Konva.Text({
      id: `planet-${planetId}-label`,
      text: `${planetX},${planetY}${username ? `(${username})` : ''}`,
      fontSize: 3,
      fontFamily: 'Calibri',
      fill: username ? 'purple' : 'green',
    })
  text.x(planetX + 3)
  text.y(planetY - 1)
  return [circle, text]
}
</script>

<style scoped lang="less">
#universe {
  background-color: #1c1f2b;
}
</style>

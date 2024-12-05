<template>
  <div id="universe"></div>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { onMounted, toRefs } from 'vue'
import { UniverseMap } from '@star-angry/core'
import { throttle } from '@star-angry/shared'

interface GameMapProps {
  seed: number
}

const props = defineProps<GameMapProps>()
const { seed } = toRefs(props)
const universeMap = new UniverseMap(seed.value)

onMounted(() => {
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
  stage.on('dragend', () => {
    render(stage, layer)
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

    let newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy
    newScale = Math.min(10, Math.max(1, newScale))
    stage.scale({ x: newScale, y: newScale })

    const newPos = {
      x: -(mousePointTo.x - pointerPos.x / newScale) * newScale,
      y: -(mousePointTo.y - pointerPos.y / newScale) * newScale,
    }
    stage.position(newPos)
    // 缩小才重新渲染，放大不用
    if (e.deltaY < 0) {
      render(stage, layer)
    }
  })
})

const render = throttle(
  (stage: Konva.Stage, layer: Konva.Layer) => {
    // 先获取可视区域的坐标范围
    const scale = stage.scaleX()
    const x = -stage.x() / scale
    const y = -stage.y() / scale
    const width = stage.width() / scale
    const height = stage.height() / scale

    const chunkIds = universeMap.getChunks(
      Math.floor(x - width / 3),
      Math.floor(y - width / 3),
      Math.floor(x + (width * 4) / 3),
      Math.floor(y + (height * 4) / 3),
    )
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

      planets.forEach((planet) => {
        const planetX = planet[0]
        const planetY = planet[1]

        const circle = new Konva.Circle({
          x: planetX,
          y: planetY,
          radius: 2,
          fill: '#e1d2f4',
          stroke: 'black',
          strokeWidth: 0.1,
        })
        const text = new Konva.Text({
          x: planetX,
          y: planetY,
          text: `${planetX},${planetY}(keqing)`,
          fontSize: 3,
          fontFamily: 'Calibri',
          fill: 'green',
        })
        text.offset({
          x: -3,
          y: 1,
        })
        group.add(circle, text)
      })

      layer.add(group)
    })

    // 移除不在可视区域的chunk
    const chunkIdsSet = new Set(chunkIds.map((id) => id.toString()))
    layer.children.forEach((child) => {
      if (!chunkIdsSet.has(child.id())) {
        child.destroy()
      }
    })
  },
  200,
  true,
)
</script>

<style scoped lang="less">
#universe {
  background-color: #1c1f2b;
}
</style>

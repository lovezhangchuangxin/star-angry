<template>
  <div id="universe"></div>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { onMounted, toRefs } from 'vue'
import { Universe } from '@star-angry/core'
import { throttle } from '@star-angry/shared'

interface GameMapProps {
  seed: number
}

const props = defineProps<GameMapProps>()
const { seed } = toRefs(props)
const universe = new Universe(seed.value)

onMounted(() => {
  const stage = new Konva.Stage({
    container: 'universe',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
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
})

const render = throttle(
  (stage: Konva.Stage, layer: Konva.Layer) => {
    // 先获取可视区域的坐标范围
    const [x, y, width, height] = [
      -stage.x(),
      -stage.y(),
      stage.width(),
      stage.height(),
    ]

    const galaxies = universe.getGalaxies(x, y, x + width, y + height)
    galaxies.forEach((galaxy) => {
      // 先判断是否已经存在
      const galaxyGroup = layer.find(`#${galaxy.id}`)[0] as Konva.Circle
      if (galaxyGroup) {
        return
      }

      const group = new Konva.Group({
        id: `#${galaxy.id}`,
      })

      galaxy.planets.forEach((planet) => {
        const circle = new Konva.Circle({
          x: planet.x,
          y: planet.y,
          radius: planet.size,
          fill: planet.color,
          stroke: 'black',
          strokeWidth: 1,
        })
        group.add(circle)
      })

      layer.add(group)
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

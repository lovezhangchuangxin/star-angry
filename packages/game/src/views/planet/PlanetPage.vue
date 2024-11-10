<template>
  <div class="planet">
    <div class="box">
      <div v-for="structure in structures" :key="structure!.id" class="card">
        <template v-if="structure">
          <p>名称：{{ structure.name }}</p>
          <p>等级：{{ structure.level }}</p>
          <p v-if="'store' in structure">
            存储：{{ structure.store }} /
            {{ structure.calcCapacity(structure.level) }}
          </p>
          <p @click="() => upgradeStructure(structure.id)" class="upgrade">
            升级 {{ structure.calcUpgradeCost(structure.level) }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import { structuresMap, StructureType } from '@star-angry/core'

const socket = ref<Socket | null>(null)
const structures = ref<StructureType[]>([])

onMounted(() => {
  socket.value = io('http://localhost:7788', {
    query: {
      token: localStorage.getItem('token'),
    },
  })

  socket.value.on('connect', () => {
    console.log('connect')
  })

  setInterval(() => {
    getStructures()
  }, 1000)
})

onUnmounted(() => {
  socket.value?.disconnect()
})

// 获取建筑
const getStructures = () => {
  socket.value
    ?.timeout(5000)
    .emit('getStructures', (err: any, response: any) => {
      if (err) {
        toast.error('获取建筑列表失败')
      } else if (response.code === 0) {
        const data = response.data
        Object.keys(data).forEach((key) => {
          const constructor = structuresMap[key as keyof typeof structuresMap]
          if (!constructor) return
          data[key] = new constructor(data[key])
        })
        Object.keys(structuresMap).forEach((key) => {
          const constructor = structuresMap[key as keyof typeof structuresMap]
          if (!constructor) return
          if (key in data) {
            data[key] = new constructor(data[key])
          } else {
            data[key] = new constructor()
          }
        })

        structures.value = Object.values(data)
      } else {
        toast.error(response.msg)
      }
    })
}

// 升级建筑
const upgradeStructure = (id: string) => {
  addIntent(id, 'upgrade', '升级成功', '升级失败')
}

// 添加意图
const addIntent = (
  id: string,
  type: string,
  successMsg: string,
  errorMsg: string,
) => {
  socket.value
    ?.timeout(5000)
    .emit('addIntent', id, type, (err: any, response: any) => {
      if (err) {
        toast.error(errorMsg)
      } else if (response.code === 0) {
        if (response.data) {
          toast.success(successMsg)
        } else {
          toast.error(errorMsg)
        }
      } else {
        toast.error(response.msg)
      }
    })
}
</script>

<style scoped lang="less">
.planet {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-top: 50px;
  overflow: auto;
  scrollbar-width: none;

  .box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .card {
      flex: 1;
      min-width: 200px;
      padding: 20px;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: #181623;

      p {
        margin: 0;
      }

      .upgrade {
        cursor: pointer;
        color: #fff;
        background: #263544;
        padding: 5px 10px;
        border-radius: 5px;
        margin-top: 10px;
      }
    }
  }
}
</style>

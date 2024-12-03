<template>
  <div class="planet">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基地建筑" name="base">
        <ShowPanel
          :user-data="userData"
          :types="['producer', 'storage']"
          :add-operation="addOperation"
        />
      </el-tab-pane>

      <el-tab-pane label="科技建设" name="technology">
        <ShowPanel
          :user-data="userData"
          :types="['technology']"
          :add-operation="addOperation"
        />
      </el-tab-pane>

      <el-tab-pane label="防御设施" name="defense">
        <ShowPanel
          :user-data="userData"
          :types="['defense']"
          :add-operation="addOperation"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { io, Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import {
  AllStructureData,
  PlanetData,
  BaseStructureOrder,
  UserData,
  StructureOperationParams,
} from '@star-angry/core'
import ShowPanel from './ShowPanel.vue'

const socket = ref<Socket | null>(null)
const userData = ref<UserData>()
const planetId = ref('')
const planetData = ref<PlanetData>()
const structures = ref<AllStructureData[]>([])
const timerId = ref<number | null>(null)
const activeName = ref('base')

onMounted(() => {
  socket.value = io('', {
    query: {
      token: localStorage.getItem('token'),
    },
    path: '/ws',
  })

  socket.value.on('connect', () => {
    console.log('connect')
  })

  timerId.value = setInterval(() => {
    getMyData()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(timerId.value!)
  socket.value?.disconnect()
})

// 获取我的游戏数据
const getMyData = () => {
  socket.value?.timeout(5000).emit('getMyData', (err: any, response: any) => {
    if (err) {
      toast.error('获取游戏数据失败')
    } else if (response.code === 0) {
      const data = response.data as UserData
      userData.value = data
      // 暂时只考虑一个星球
      planetId.value = Object.keys(data.planets)[0]
      planetData.value = data.planets[planetId.value]
      structures.value = Object.values(
        data.planets[planetId.value].structures,
      ).sort((a, b) => {
        return BaseStructureOrder[a.id] - BaseStructureOrder[b.id]
      })
    } else {
      toast.error(response.msg)
    }
  })
}

// 添加操作
const addOperation = (
  params: Omit<StructureOperationParams, 'userId'>,
  successMsg: string,
  errorMsg: string,
) => {
  if (!params.planetId) {
    toast.error('未获取到星球信息')
    return
  }

  socket.value
    ?.timeout(5000)
    .emit('addOperation', params, (err: any, response: any) => {
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
  height: 100%;
  padding: 10px 40px;
}

:deep(.el-tabs) {
  height: 100%;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>

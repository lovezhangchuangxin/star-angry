<template>
  <div class="planet">
    <div class="resource">
      <span v-for="{ type, name, amount } in allResources" :key="type">
        <span class="label">{{ name }}</span>
        <span>
          <span>{{ amount < 0 ? ' -' : '' }}</span>
          <NumberFormat :value="Math.abs(amount)" />
        </span>
      </span>
    </div>

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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { io, Socket } from 'socket.io-client'
import {
  AllStructureData,
  PlanetData,
  BaseStructureOrder,
  UserData,
  StructureOperationParams,
  StructureConfigs,
  ResourceName,
  ResourceType,
} from '@star-angry/core'
import { message as toast } from '@/utils/message'
import NumberFormat from '@/components/number/NumberFormat.vue'
import ShowPanel from './ShowPanel.vue'

const socket = ref<Socket | null>(null)
const userData = ref<UserData>()
const planetId = ref('')
const planetData = ref<PlanetData>()
const structures = ref<AllStructureData[]>([])
const timerId = ref<number | null>(null)
const activeName = ref('base')
const allStructureIdSet = new Set(Object.keys(StructureConfigs))

const allResources = computed(() => {
  if (!planetData.value) {
    return []
  }
  const res: { type: string; name: string; amount: number }[] = []
  for (const [type, item] of Object.entries(planetData.value.resources)) {
    const name = ResourceName[type as ResourceType]
    if (type === 'electricity') {
      // 注意电能的 amount 表示已使用的电能，是负数
      res.push({ type, name, amount: item.capacity + item.amount })
    } else {
      res.push({ type, name, amount: item.amount })
    }
  }

  return res
})

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
      if (!planetId.value) {
        toast.error('请先挑选星球')
        socket.value?.disconnect()
        return
      }
      planetData.value = data.planets[planetId.value]
      structures.value = Object.values(data.planets[planetId.value].structures)
        .filter((s) => allStructureIdSet.has(s.id))
        .sort((a, b) => {
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

  .resource {
    display: flex;
    gap: 20px;
    padding: 2px 0;
    font-size: 12px;
    color: #b99ddc;
    overflow-x: auto;
    scrollbar-width: none;

    .label {
      padding: 0 5px;
      border: 1px solid #e9ba5d;
      border-radius: 5px;
      color: #e9ba5d;
    }
  }
}

:deep(.el-tabs) {
  height: 100%;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>

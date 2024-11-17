<template>
  <div class="planet">
    <el-space fill wrap :size="20" :fill-ratio="23" direction="horizontal">
      <el-card
        v-for="structure in structures"
        :key="structure!.id"
        class="box-card"
      >
        <template #header>
          <div class="card-header">
            <el-row justify="space-between">
              <el-text class="structure-name" size="large">
                {{ structure.name }}
              </el-text>
              <el-tag type="info" color="#613e3b" effect="dark">
                lv.{{ structure.level }}
              </el-tag>
            </el-row>
          </div>
        </template>
        <div class="structure-body">
          <div v-if="'calcOutput' in structure">
            <el-row class="structure-desc">
              产量:
              {{ numberWithCommas(structure.calcOutput(structure.level)) }}/s
            </el-row>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="100"
              :format="() => ''"
              :indeterminate="true"
              :duration="1"
              color="#f7e085"
            />
          </div>
          <div v-if="'store' in structure">
            <el-row class="structure-desc">
              储量: {{ numberWithCommas(structure.store) }} /
              {{ numberWithCommas(structure.calcCapacity(structure.level)) }}
            </el-row>
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="calcCapacityPercentage(structure)"
              striped
              striped-flow
              :duration="30"
              :status="calcProcessColor(structure)"
            />
          </div>
          <el-row class="structure-desc">
            <el-row>
              <el-col :span="24">
                <el-text type="info"> 升级需求: </el-text>
              </el-col>
              <el-col
                :span="24"
                v-for="(value, key) in structure.calcUpgradeCost(
                  structure.level,
                )"
                :key="key"
              >
                <el-text type="info">
                  {{ resourceName[key] }}: {{ numberWithCommas(value) }}
                </el-text>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <template #footer>
          <el-button
            class="upgrade-btn"
            @click="() => upgradeStructure(structure.id)"
            type="primary"
            round
            dark
            color="#41bfda"
          >
            升级
          </el-button>
        </template>
      </el-card>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import {
  EnergyStorage,
  MetalStorage,
  structuresMap,
  StructureType,
} from '@star-angry/core'
import { numberWithCommas } from '@/utils/number'

const socket = ref<Socket | null>(null)
const structures = ref<StructureType[]>([])
const timerId = ref<number | null>(null)
const resourceName = {
  metal: '金属',
  energy: '能量',
}

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
    getStructures()
  }, 1000) as unknown as number
})

onUnmounted(() => {
  clearInterval(timerId.value!)
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

// 储量百分比
const calcCapacityPercentage = (
  structure: MetalStorage | EnergyStorage,
): number => {
  return (structure.store * 100) / structure.calcCapacity(structure.level)
}

// 储量进度条颜色
const processStatus: string[] = ['success', '', '', 'warning', 'exception']
const calcProcessColor = (structure: MetalStorage | EnergyStorage): string => {
  const level = Math.ceil(
    Math.max(0, calcCapacityPercentage(structure) - 60) / 10,
  )
  return processStatus[level]
}
</script>

<style scoped lang="less">
.planet {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 100px);
  padding: 20px;
  margin-top: 50px;
  overflow: auto;
  scrollbar-width: none;

  .el-space {
    height: 100%;
    .box-card {
      min-width: 300px;
      .structure-name {
        color: #cbc0aa;
      }

      .structure-body {
        .structure-desc {
          margin: 10px 0;
        }
      }

      .upgrade-btn {
        width: 100%;
      }
    }
  }
}
</style>

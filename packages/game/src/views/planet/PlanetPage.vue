<template>
  <el-scrollbar class="planet-scrollbar">
    <el-row class="planet" :gutter="20" align="top">
      <el-col
        :xs="24"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="4"
        v-for="structure in structures"
        :key="structure!.id"
      >
        <el-card v-if="structure.id" class="box-card">
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
            <div v-if="structure.id === 'solarPlant'">
              <el-row class="structure-desc">
                产电量:
                <NumberFormat :value="structure.elecProd" />
              </el-row>
              <el-progress
                v-if="structure.totalProd >= structure.totalUsed"
                :text-inside="true"
                :stroke-width="20"
                :percentage="calcEmptyPercentage(structure)"
                :format="() => structure.totalProd - structure.totalUsed"
                color="#CFCC38"
              />
              <el-progress
                v-else
                class="negative-process"
                :text-inside="true"
                :stroke-width="20"
                :percentage="calcEmptyPercentage(structure)"
                :format="() => structure.totalProd - structure.totalUsed"
                color="#C22139"
              />
            </div>
            <div v-else-if="structure.id === 'fusionPlant'">
              <el-row class="structure-desc">
                产电量:
                <NumberFormat :value="structure.elecProd" />
                <span class="elec-used"
                  >(耗氢量: {{ structure.calcInput(structure.level) }})</span
                >
              </el-row>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="100"
                :format="() => (structure.level ? '产电中' : '停止运转')"
                :indeterminate="true"
                :duration="structure.level ? 10 : 0"
                :striped="!!structure.level"
                :striped-flow="!!structure.level"
                :color="structure.level ? '#87C025' : '#C22139'"
              />
            </div>
            <div v-else-if="'output' in structure">
              <el-row class="structure-desc">
                产量:
                <NumberFormat :value="structure.output" />/s
                <span class="elec-used"
                  >(耗电量: {{ structure.elecUsed }})</span
                >
              </el-row>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="100"
                :format="() => (structure.level ? '生产中' : '停止运转')"
                :indeterminate="true"
                :duration="structure.level ? 10 : 0"
                :striped="!!structure.level"
                :striped-flow="!!structure.level"
                :color="structure.level ? '#87C025' : '#C22139'"
              />
            </div>
            <div v-else-if="'store' in structure">
              <el-row class="structure-desc">
                储量: <NumberFormat :value="structure.store" /> /
                <NumberFormat :value="structure.storeLimit" />
              </el-row>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="calcCapacityPercentage(structure)"
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
                  <el-text v-if="value > 0" type="info">
                    {{ resourceName[key] }}: <NumberFormat :value="value" />
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
              :disabled="!canUpgrade(structure)"
              :color="canUpgrade(structure) ? '#41bfda' : '#e45865'"
            >
              升级
            </el-button>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import {
  DeuteriumStorage,
  EnergyStorage,
  MetalStorage,
  SolarPlant,
  structuresMap,
  StructureType,
} from '@star-angry/core'
import NumberFormat from '@/components/number/NumberFormat.vue'

const socket = ref<Socket | null>(null)
const structures = ref<StructureType[]>([])
const timerId = ref<number | null>(null)
const resourceName = {
  metal: '金属',
  energy: '能量',
  deuterium: '重氢气',
}
const resourceNum = {
  metal: 0,
  energy: 0,
  deuterium: 0,
}
// ref<Record<ResourceType, number>>({
//   [ResourceType.metal]: 0,
//   [ResourceType.energy]: 0,
//   [ResourceType.deuterium]: 0,
// })
const structureSort = [
  'metalStorage',
  'metalMine',
  'energyStorage',
  'energyMine',
  'deuteriumStorage',
  'deuteriumSintetizer',
  'solarPlant',
  'fusionPlant',
]

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
          if (data[key].store) {
            if (data[key] instanceof MetalStorage)
              resourceNum.metal = data[key].store
            else if (data[key] instanceof EnergyStorage)
              resourceNum.energy = data[key].store
            else if (data[key] instanceof DeuteriumStorage)
              resourceNum.deuterium = data[key].store
          }
        })

        structures.value = Object.values(
          structureSort.map((e) => data[e] || {}),
        )
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
  structure: MetalStorage | EnergyStorage | DeuteriumStorage,
): number => {
  return +((structure.store * 100) / structure.storeLimit).toFixed(2)
}

const calcEmptyPercentage = (structure: SolarPlant): number => {
  structure.totalProd = structure.totalProd || 0
  if (!structure.totalProd && !structure.totalUsed) return 0
  return +Math.min(
    100,
    Math.abs(
      ((structure.totalProd - structure.totalUsed) * 100) / structure.totalProd,
    ),
  ).toFixed(2)
}

// 储量进度条颜色
const processStatus: string[] = ['success', '', '', 'warning', 'exception']
const calcProcessColor = (
  structure: MetalStorage | EnergyStorage | DeuteriumStorage,
): string => {
  const level = Math.ceil(
    Math.max(0, calcCapacityPercentage(structure) - 60) / 10,
  )
  return processStatus[level]
}

// 能否升级
const canUpgrade = (structure: StructureType): boolean => {
  const upgradeCost = structure.calcUpgradeCost(structure.level)
  if (upgradeCost.metal > resourceNum.metal) return false
  if (upgradeCost.energy > resourceNum.energy) return false
  if (upgradeCost.deuterium > resourceNum.deuterium) return false
  return true
}
</script>

<style scoped lang="less">
.planet {
  padding: 40px;
  margin-top: 50px;
  overflow: auto;
  scrollbar-width: none;

  .box-card {
    margin: 10px 0;
    .structure-name {
      color: #cbc0aa;
    }

    .structure-body {
      height: 150px;
      .structure-desc {
        align-items: baseline;
        margin: 10px 0;
        .elec-used {
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }

    .upgrade-btn {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.el-scrollbar.planet-scrollbar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
    .el-scrollbar__view {
      overflow-x: hidden;
    }
  }
}
.el-progress.negative-process {
  .el-progress-bar__inner {
    left: auto;
    right: 0;
  }
}
</style>

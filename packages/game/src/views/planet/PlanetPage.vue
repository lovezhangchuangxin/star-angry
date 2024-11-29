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
        :key="structure.id"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <el-row justify="space-between">
                <div>
                  <el-text class="structure-name" size="large">
                    {{ StructureConfigs[structure.id].name }}
                  </el-text>
                  <el-switch
                    v-if="StructureConfigs[structure.id].type === 'producer'"
                    @click="() => togglePause(structure.id)"
                    :model-value="!structure.pause"
                    size="small"
                    class="pause-btn"
                  />
                </div>
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
                <NumberFormat
                  :value="(structure as ProducerData).produceSpeed?.electricity"
                />
              </el-row>
              <el-progress
                v-if="electricityTotal >= electricityUsed"
                :text-inside="true"
                :stroke-width="20"
                :percentage="calcEmptyPercentage()"
                :format="() => electricityTotal - electricityUsed"
                color="#CFCC38"
              />
              <el-progress
                v-else
                class="negative-process"
                :text-inside="true"
                :stroke-width="20"
                :percentage="calcEmptyPercentage()"
                :format="() => electricityTotal - electricityUsed"
                color="#C22139"
              />
            </div>
            <div v-else-if="structure.id === 'planetaryEngine'">
              <el-row class="structure-desc">
                产电量:
                <NumberFormat
                  :value="(structure as ProducerData).produceSpeed?.electricity"
                />
                <span class="elec-used">
                  (耗氢量:
                  {{
                    (structure as ProducerData).consumeSpeed?.deuterium || 0
                  }})
                </span>
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
            <div v-else-if="StructureConfigs[structure.id].type === 'producer'">
              <el-row class="structure-desc">
                产量:
                <NumberFormat
                  :value="
                    Object.values(
                      (structure as ProducerData).produceSpeed || {},
                    )[0]
                  "
                />/s
                <span class="elec-used">
                  (耗电量:
                  {{
                    (structure as ProducerData).consumeSpeed?.electricity || 0
                  }})
                </span>
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
            <div v-else-if="StructureConfigs[structure.id].type === 'storage'">
              <el-row class="structure-desc">
                储量:
                <NumberFormat
                  :value="
                    planetData?.resources[
                      (StructureConfigs[structure.id] as StorageConfig).resource
                    ]?.amount
                  "
                />
                /
                <NumberFormat
                  :value="
                    planetData?.resources[
                      (StructureConfigs[structure.id] as StorageConfig).resource
                    ]?.capacity
                  "
                />
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
                  <el-text type="info">
                    {{ `${structure.level ? '升级' : '建造'}需求:` }}
                  </el-text>
                </el-col>
                <el-col
                  :span="24"
                  v-for="(value, key) in StructureConfigs[
                    structure.id
                  ].getUpgradeCost(structure.level)"
                  :key="key"
                >
                  <el-text type="info">
                    {{ ResourceName[key] }}: <NumberFormat :value="value" />
                  </el-text>
                </el-col>
              </el-row>
            </el-row>
          </div>
          <template #footer>
            <div class="button-group">
              <el-button
                @click="() => upgradeStructure(structure.id)"
                type="primary"
                round
                dark
                :disabled="!canUpgrade(structure)"
                :color="canUpgrade(structure) ? '#41bfda' : '#e45865'"
              >
                {{ `${structure.level ? '升级' : '建造'}` }}
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import { message as toast } from '@/utils/message'
import NumberFormat from '@/components/number/NumberFormat.vue'
import {
  AllStructureData,
  isResourceEnough,
  PlanetData,
  ProducerData,
  ResourceName,
  StorageConfig,
  StructureConfigs,
  UserData,
} from '@star-angry/core'

const socket = ref<Socket | null>(null)
const userData = ref<UserData>()
const planetId = ref('')
const planetData = ref<PlanetData>()
const structures = ref<AllStructureData[]>([])
const timerId = ref<number | null>(null)

// 已经使用的电力
const electricityUsed = computed(() => {
  const data = planetData.value?.resources.electricity
  if (!data) return 0
  return -data.amount
})
// 总电力
const electricityTotal = computed(() => {
  const data = planetData.value?.resources.electricity
  if (!data) return 0
  return data.capacity
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
      planetData.value = data.planets[planetId.value]
      structures.value = Object.values(data.planets[planetId.value].structures)
    } else {
      toast.error(response.msg)
    }
  })
}

// 升级建筑
const upgradeStructure = (id: string) => {
  addOperation(
    {
      planetId: planetId.value,
      structureId: id,
      operation: 'upgrade',
    },
    '升级成功',
    '升级失败',
  )
}

const togglePause = (id: string) => {
  addOperation(
    {
      planetId: planetId.value,
      structureId: id,
      operation: 'togglePause',
    },
    '操作成功',
    '操作失败',
  )
}

// 添加操作
const addOperation = (
  params: {
    planetId: string
    structureId: string
    operation: string
  },
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

// 储量百分比
const calcCapacityPercentage = (structure: AllStructureData): number => {
  const resource =
    planetData.value?.resources[
      (StructureConfigs[structure.id] as StorageConfig).resource
    ]
  if (!resource) return 0
  return +Math.min(100, (resource.amount * 100) / resource.capacity).toFixed(2)
}

const calcEmptyPercentage = (): number => {
  if (!electricityTotal.value && !electricityUsed.value) return 0
  return +Math.min(
    100,
    Math.abs(
      ((electricityTotal.value - electricityUsed.value) * 100) /
        electricityTotal.value,
    ),
  ).toFixed(2)
}

// 储量进度条颜色
const processStatus: string[] = ['success', '', '', 'warning', 'exception']
const calcProcessColor = (structure: AllStructureData): string => {
  const level = Math.ceil(
    Math.max(0, calcCapacityPercentage(structure) - 60) / 10,
  )
  return processStatus[level]
}

// 能否升级
const canUpgrade = (structure: AllStructureData): boolean => {
  if (!planetData.value) return false

  const config = StructureConfigs[structure.id]
  // 是否已经是最大等级
  if (config.maxLevel && structure.level >= config.maxLevel) {
    return false
  }

  // 获取升级依赖的前置建筑
  const preStructure = config.preDepend
  // 检查这些建筑的等级是否满足
  if (preStructure) {
    for (const [id, level] of Object.entries(preStructure)) {
      if (planetData.value.structures[id].level < level) {
        return false
      }
    }
  }

  // 获取升级所需资源
  const cost = config.getUpgradeCost(structure.level)
  // 检查资源是否足够
  if (!isResourceEnough(planetData.value.resources, cost)) {
    return false
  }

  return true
}
</script>

<style scoped lang="less">
.planet {
  padding: 20px 40px;
  overflow: auto;
  scrollbar-width: none;

  .box-card {
    margin: 10px 0;
    .structure-name {
      color: #cbc0aa;
    }
    .pause-btn {
      --el-switch-on-color: #13ce66;
      --el-switch-off-color: #ff4949;
      margin-left: 10px;
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

    .button-group {
      display: flex;

      button {
        flex: 1;
      }
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

<template>
  <el-scrollbar class="planet-scrollbar">
    <el-row class="planet-panel" :gutter="20" align="top">
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
                <template v-if="isRunning(structure as ProducerData)">
                  <NumberFormat
                    :value="
                      (structure as ProducerData).produceSpeed?.electricity
                    "
                  />
                </template>
                <template v-else>0</template>
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
                <template v-if="isRunning(structure as ProducerData)">
                  <NumberFormat
                    :value="
                      (structure as ProducerData).produceSpeed?.electricity
                    "
                  />
                  <span class="elec-used">
                    (耗氢量:
                    {{
                      (structure as ProducerData).consumeSpeed?.deuterium || 0
                    }})
                  </span>
                </template>
                <template v-else>0</template>
              </el-row>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="100"
                :format="
                  () =>
                    isRunning(structure as ProducerData) ? '产电中' : '停止运转'
                "
                :indeterminate="true"
                :duration="isRunning(structure as ProducerData) ? 10 : 0"
                :striped="isRunning(structure as ProducerData)"
                :striped-flow="isRunning(structure as ProducerData)"
                :color="
                  isRunning(structure as ProducerData) ? '#87C025' : '#C22139'
                "
              />
            </div>
            <div v-else-if="StructureConfigs[structure.id].type === 'producer'">
              <el-row class="structure-desc">
                产量:
                <template v-if="isRunning(structure as ProducerData)">
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
                      (structure as ProducerData).consumeSpeed?.electricity ||
                      0
                    }})
                  </span>
                </template>
                <template v-else>0/s</template>
              </el-row>
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="100"
                :format="
                  () =>
                    isRunning(structure as ProducerData) ? '生产中' : '停止运转'
                "
                :indeterminate="true"
                :duration="isRunning(structure as ProducerData) ? 10 : 0"
                :striped="isRunning(structure as ProducerData)"
                :striped-flow="isRunning(structure as ProducerData)"
                :color="
                  isRunning(structure as ProducerData) ? '#87C025' : '#C22139'
                "
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
              <el-row class="upgrade-desc">
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
                升级
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watchEffect } from 'vue'
import NumberFormat from '@/components/number/NumberFormat.vue'
import {
  AllStructureData,
  isResourceEnough,
  PlanetData,
  ProducerData,
  ResourceName,
  StorageConfig,
  StructureConfigs,
  BaseStructureOrder,
  UserData,
  StructureType,
} from '@star-angry/core'

interface ShowPanelProps {
  userData?: UserData
  types: StructureType[]
  addOperation: (
    params: {
      planetId: string
      structureId: string
      operation: string
    },
    successMsg: string,
    errorMsg: string,
  ) => void
}

const props = defineProps<ShowPanelProps>()
const { userData, types, addOperation } = toRefs(props)
const planetId = ref('')
const planetData = ref<PlanetData>()
const structures = ref<AllStructureData[]>([])

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

watchEffect(() => {
  if (!userData.value) {
    return
  }
  // 暂时只考虑一个星球
  planetId.value = Object.keys(userData.value.planets)[0]
  planetData.value = userData.value.planets[planetId.value]
  structures.value = Object.values(
    userData.value.planets[planetId.value].structures,
  )
    .filter(({ id }) => {
      return types.value.includes(StructureConfigs[id].type)
    })
    .sort((a, b) => {
      return BaseStructureOrder[a.id] - BaseStructureOrder[b.id]
    })
})

// 升级建筑
const upgradeStructure = (id: string) => {
  addOperation.value(
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
  addOperation.value(
    {
      planetId: planetId.value,
      structureId: id,
      operation: 'togglePause',
    },
    '操作成功',
    '操作失败',
  )
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

// 是否运行中
const isRunning = (structure: ProducerData): boolean => {
  return !!structure.level && !structure.pause
}
</script>

<style scoped lang="less">
.planet-panel {
  padding-bottom: 20px;
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
      .structure-desc {
        align-items: baseline;
        margin: 10px 0;
        .elec-used {
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }

    .upgrade-desc {
      height: 70px;
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

<template>
  <!-- 建筑详情弹窗 -->
  <div>
    <el-dialog
      v-model="visible"
      :title="StructureConfigs[id]?.name"
      :width="width"
    >
      <div class="detail-box" v-if="StructureConfigs[id]">
        <p class="desc">{{ StructureConfigs[id].description }}</p>
        <div class="params">
          <div v-if="['defense'].includes(type)">
            <p>生命值：{{ (StructureConfigs[id] as DefenseConfig).health }}</p>
            <p>护盾值：{{ (StructureConfigs[id] as DefenseConfig).shield }}</p>
            <template v-if="(StructureConfigs[id] as DefenseConfig).attack">
              <p>攻击力：</p>
              <p
                v-for="[key, value] in Object.entries(
                  (StructureConfigs[id] as DefenseConfig).attack!,
                )"
                :key="key"
              >
                {{ AttackTypeName[+key as AttackType] }}: {{ value }}
              </p>
            </template>
          </div>
          <div v-else-if="['storage', 'producer'].includes(type)">
            <el-table
              :data="tableData"
              style="width: 100%"
              max-height="400"
              :row-class-name="getRowClassName"
            >
              <el-table-column prop="level" label="等级" width="60" fixed />
              <el-table-column
                v-for="({ prop, label, minWidth }, index) in columnData"
                :key="index"
                :prop="prop"
                :label="label"
                :min-width="minWidth"
              />
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElDialog, ElTable } from 'element-plus'
import { useDialog } from '@/hooks/useDialog'
import {
  DefenseConfig,
  ProducerConfig,
  ResourceName,
  ResourceType,
  StorageConfig,
  StructureConfigs,
  StructureData,
} from '@star-angry/core'
import { AttackType, AttackTypeName } from '@star-angry/core/src/config/combat'

const { visible, closeDialog } = useDialog()
const width = ref('600px')
const objectData = ref<StructureData>()

onMounted(() => {
  updateDialogWidth()
  window.addEventListener('resize', updateDialogWidth)
})
const id = computed(() => objectData.value?.id || '')
const type = computed(() => {
  return StructureConfigs[id.value]?.type
})

const columnData = computed(() => {
  if (!objectData.value) return []
  const columns: { prop: string; label: string; minWidth?: string }[] = []

  if (type.value === 'storage') {
    columns.push(
      { prop: 'store', label: '存储', minWidth: '240' },
      { prop: 'diff', label: '差异', minWidth: '240' },
    )
  } else if (type.value === 'producer') {
    const config = StructureConfigs[id.value] as ProducerConfig
    Object.keys(config.getProduceSpeed?.(1) || {}).forEach((key) => {
      columns.push({ prop: key, label: ResourceName[key as ResourceType] })
    })
    Object.keys(config.getConsumeSpeed?.(1) || {}).forEach((key) => {
      columns.push({ prop: key, label: ResourceName[key as ResourceType] })
    })
  }

  return columns
})

const tableData = computed(() => {
  if (!objectData.value) return []

  const config = StructureConfigs[id.value]
  const minLevel = 1,
    maxLevel = config.maxLevel || 63,
    nowLevel = objectData.value.level
  if (type.value === 'storage') {
    const nowStore = (config as StorageConfig).capacity(nowLevel)
    return Array.from({ length: maxLevel - minLevel + 1 }).map((_, index) => {
      const level = index + minLevel
      const store = (config as StorageConfig).capacity(level)
      const diff = store - nowStore
      return { level, store, diff }
    })
  } else if (type.value === 'producer') {
    return Array.from({ length: maxLevel - minLevel + 1 }).map((_, index) => {
      const level = index + minLevel
      const data: Record<string, number> = { level }
      Object.entries(
        (config as ProducerConfig).getProduceSpeed?.(level) || {},
      ).forEach(([key, value]) => {
        data[key] = value
      })
      Object.entries(
        (config as ProducerConfig).getConsumeSpeed?.(level) || {},
      ).forEach(([key, value]) => {
        data[key] = -value
      })
      return data
    })
  } else {
    return []
  }
})

const getRowClassName = ({ row }: { row: { level: number } }) => {
  if (row.level === objectData.value?.level) {
    return 'current-row'
  }
  return ''
}

function updateDialogWidth() {
  if (window.innerWidth < 720) {
    width.value = '90%'
  } else {
    width.value = '600px'
  }
}

const openDialog = (data: StructureData) => {
  objectData.value = data
  visible.value = true
}

defineExpose({
  openDialog,
  closeDialog,
})
</script>

<style scoped lang="less">
.detail-box {
  .desc {
    color: #c2b4da;
    margin-bottom: 20px;
  }

  :deep(.current-row) {
    color: #409eff;
  }
}

:deep(.el-dialog) {
  --el-dialog-bg-color: #252a37;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: #373e51;
  --el-table-current-row-bg-color: #373e51;
  --el-table-header-bg-color: #2b3445;
  --el-table-tr-bg-color: #252a37;
}
</style>

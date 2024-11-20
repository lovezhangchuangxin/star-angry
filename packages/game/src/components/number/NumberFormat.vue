<template>
  <el-tooltip
    class="box-item"
    effect="light"
    :content="valueFullFormat"
    placement="bottom-start"
  >
    <span>{{ valueFormat }}{{ unit }}</span>
  </el-tooltip>
</template>

<script setup lang="ts">
import { numberWithCommas } from '@/utils/number'
import { onMounted, ref } from 'vue'

const { value = 0 } = defineProps({
  value: Number,
})
const unit = ref<string>('')
const valueFormat = ref<string>('0')
const valueFullFormat = ref<string>('0')
const unitName = [
  '',
  'K',
  'M',
  'B',
  'T',
  'AA',
  'AB',
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AH',
]

onMounted(() => {
  let tempValue = value
  const bit = Math.log10(tempValue)
  const hideUnit = Math.ceil((bit - 6) / 3)
  if (hideUnit > 0) {
    unit.value = unitName[hideUnit]
    tempValue = Math.floor(tempValue / Math.pow(10, hideUnit * 3))
  }
  valueFullFormat.value = numberWithCommas(value)
  valueFormat.value = numberWithCommas(tempValue)
})
</script>
<style scoped lang="less"></style>

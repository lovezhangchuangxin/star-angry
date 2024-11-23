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
import { ref, toRefs, watchEffect } from 'vue'

interface NumberFormatProps {
  value?: number
}

const props = defineProps<NumberFormatProps>()
const { value } = toRefs(props)
const unit = ref('')
const valueFormat = ref('0')
const valueFullFormat = ref('0')
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

watchEffect(() => {
  format(value.value)
})

function format(value: number = 0) {
  let tempValue = value
  const bit = Math.log10(tempValue)
  const hideUnit = Math.ceil((bit - 6) / 3)
  if (hideUnit > 0) {
    unit.value = unitName[hideUnit]
    tempValue = Math.floor(tempValue / Math.pow(10, hideUnit * 3))
  } else {
    unit.value = unitName[0]
  }
  valueFullFormat.value = numberWithCommas(value)
  valueFormat.value = numberWithCommas(tempValue)
}
</script>

<style scoped lang="less"></style>

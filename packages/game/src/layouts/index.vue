<template>
  <component :is="layoutMode"></component>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Default from '@/layouts/container/default.vue'

defineOptions({
  components: { Default },
})

const layoutMode = ref('default')
</script>

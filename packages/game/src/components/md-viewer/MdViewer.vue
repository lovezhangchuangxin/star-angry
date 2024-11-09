<template>
  <Viewer :value="value" :plugins="plugins" class="markdown-viewer"></Viewer>
</template>

<script setup lang="ts">
// @ts-ignore
import { Viewer } from '@bytemd/vue-next'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import 'bytemd/dist/index.css'
import 'github-markdown-css/github-markdown-light.css'

const plugins = [gfm(), highlight()]

interface ViewerProps {
  value: string
}

withDefaults(defineProps<ViewerProps>(), {
  value: '',
})
</script>
<style scoped lang="less"></style>

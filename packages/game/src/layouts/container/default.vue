<template>
  <div class="container">
    <NavHeader />
    <router-view class="content"></router-view>
  </div>
</template>

<script setup lang="ts">
import NavHeader from '@/layouts/components/NavHeader.vue'
</script>

<style>
.container {
  height: calc(100% - 50px);
}
</style>

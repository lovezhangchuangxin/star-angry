<template>
  <div class="home">
    <GameMap />
  </div>
</template>

<script setup lang="ts">
import GameMap from '@/components/game-map/index.vue'
</script>

<style scoped lang="less">
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #333;
}
</style>

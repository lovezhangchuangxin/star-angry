<template>
  <div class="home">
    <GameMap :seed="0.63" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import GameMap from '@/components/game-map/index.vue'

const userStore = useUserStore()
console.log(userStore.username)
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

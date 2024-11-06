<template>
  <div class="home">{{ userStore.username }} 登录成功！速速帮忙写代码！</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'

const userStore = useUserStore()
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

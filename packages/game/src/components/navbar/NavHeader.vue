<template>
  <!-- 头部导航 -->
  <div class="nav-header">
    <div class="left">
      <span class="expand" @click="toggleExpand">
        <Expand v-if="!isExpand" />
        <CloseBold v-else />
      </span>
      <span style="cursor: pointer" @click="router.push('/')">星怒</span>
    </div>

    <div class="right">
      {{ useStore.username }}
    </div>
  </div>
  <NavSide :expand="isExpand" @go="handleGo" @close="toggleExpand" />
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { CloseBold, Expand } from '@element-plus/icons-vue'
import { ref } from 'vue'
import NavSide from './NavSide.vue'
import { useRouter } from 'vue-router'

const useStore = useUserStore()
const router = useRouter()
const isExpand = ref(false)

const toggleExpand = () => {
  isExpand.value = !isExpand.value
}

const handleGo = (path: string) => {
  isExpand.value = false
  router.push(path)
}
</script>

<style scoped lang="less">
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 20px;
  height: 50px;
  background-color: #161a2a;
  color: #e9e9e9;
  font-size: 16px;
  z-index: 100;

  & > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .expand {
    display: flex;
    align-items: center;
    width: 20px;
    cursor: pointer;
  }
}
</style>

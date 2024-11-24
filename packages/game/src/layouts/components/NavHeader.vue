<template>
  <!-- 头部导航 -->
  <div class="nav-header">
    <div class="left">
      <span class="expand" @click="toggleExpand">
        <Expand v-if="!isExpand" />
        <CloseBold v-else />
      </span>
      <span style="cursor: pointer" @click="router.push('/')">星怒</span>
      <span
        style="margin-left: 50px; cursor: pointer"
        @click="router.push('/planet')"
      >
        我的星球
      </span>
    </div>

    <div class="right">
      <span>{{ userStore.username }}</span>
      <span
        v-if="userStore.role === 1"
        class="admin"
        @click="router.push('/admin/redeem-code')"
      >
        管理员
      </span>
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

const userStore = useUserStore()
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
  padding: 0 20px;
  height: 50px;
  background-color: #161a2a;
  color: #e9e9e9;
  font-size: 16px;
  z-index: 1000;

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

  .admin {
    color: #9a5de9;
    padding: 0 5px;
    border: 1px solid #9a5de9;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>

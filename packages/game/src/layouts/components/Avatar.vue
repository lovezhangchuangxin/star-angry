<template>
  <div>
    <el-popover
      placement="bottom"
      :width="130"
      trigger="click"
      :show-arrow="false"
      popper-class="avatar-popover"
    >
      <template #reference>
        <div class="avatar">
          <span>{{ userStore.username }}</span>
        </div>
      </template>
      <template #default>
        <div class="menu">
          <div v-if="isAdmin"><Apple width="20" />后台管理</div>
          <div @click="logout"><CircleClose width="20" />退出账号</div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ElPopover } from 'element-plus'
import { Apple, CircleClose } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.role === 1)

// 退出登录
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped lang="less">
.avatar {
  cursor: pointer;
}

.menu {
  width: 125px;
  div {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;

    &:hover {
      cursor: pointer;
      background-color: #262335;
    }
  }
}
</style>
<style>
.avatar-popover {
  background: #1e1c2b !important;
}
</style>

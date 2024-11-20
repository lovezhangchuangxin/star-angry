<template>
  <!-- 侧边导航 -->
  <transition name="slide">
    <ul class="nav-side" v-show="expand">
      <li
        v-for="(item, index) in data"
        :key="index"
        @click="emit('go', item.path)"
      >
        <component :is="item.icon" class="icon" />
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </transition>
</template>

<script setup lang="ts">
import { Basketball, ChatDotRound, Memo } from '@element-plus/icons-vue'
import { onMounted, toRefs } from 'vue'
import type { Component } from 'vue'

interface NavSideProps {
  expand: boolean
}

interface NavSideDataItem {
  title: string
  icon: Component
  path: string
}

const props = defineProps<NavSideProps>()
const { expand } = toRefs(props)
const emit = defineEmits<{
  go: [path: string]
  close: []
}>()

const data: NavSideDataItem[] = [
  {
    title: '我的星球',
    icon: Basketball,
    path: '/planet',
  },
  {
    title: '聊天',
    icon: ChatDotRound,
    path: '/chat',
  },
  {
    title: '排行榜',
    icon: Memo,
    path: '/rank',
  },
]

onMounted(() => {
  document.body.addEventListener('click', (e) => {
    // 点击侧边导航以外的区域，关闭侧边导航
    if (e.x > 160 && expand.value) {
      emit('close')
    }
  })
})
</script>

<style scoped lang="less">
.nav-side {
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 0;
  width: 160px;
  background: linear-gradient(90deg, #161a2a 0%, #1c1f2b 100%);
  color: #e9e9e9;
  font-size: 16px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    cursor: pointer;

    .icon {
      width: 20px;
    }

    &:hover {
      background: linear-gradient(90deg, #1a1f30 0%, #1c1f2b 100%);
      color: #7670ac;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>

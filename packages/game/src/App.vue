<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { UserApi } from '@star-angry/api'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import io from 'socket.io-client'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const refreshToken = async () => {
  // const res = await UserApi.refreshToken()
  // if (res.code === 0) {
  //   localStorage.setItem('token', res.data)
  // }
}

onMounted(() => {
  // 初次加载时，请求用户信息
  const token = localStorage.getItem('token')
  if (!token) return router.replace('/login')

  UserApi.getUserInfo().then((res) => {
    if (res.code !== 0) {
      router.replace('/login')
      return
    }

    userStore.setUserInfo(res.data)

    if (route.path === '/login') {
      router.replace('/')
    }
  })

  const socket = io('http://localhost:7788')

  socket.on('connect', () => {
    console.log('connect')
  })

  // 每隔一定时间刷新 token
  setInterval(refreshToken, 5 * 60 * 1000)
  // 上线时立即刷新一次 token
  setTimeout(refreshToken, 10 * 1000)
})
</script>

<style scoped lang="less">
.app {
  height: 100vh;
}
</style>

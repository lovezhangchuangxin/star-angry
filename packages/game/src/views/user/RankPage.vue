<template>
  <div class="rank">
    <div class="rank-box">
      <p>排行榜</p>
      <ul>
        <li>
          <span>玩家名</span>
          <span>分数</span>
        </li>
        <li v-for="user in users" :key="user.id">
          <span>{{ user.username }}</span>
          <span>{{ user.score }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/message'
import { UserApi } from '@star-angry/api'
import { onMounted, ref } from 'vue'

const users = ref<
  {
    id: string
    username: string
    score: number
  }[]
>([])

onMounted(async () => {
  try {
    const res = await UserApi.getRank()
    if (res.code === 0) {
      users.value = res.data
    }
  } catch (error) {
    message.error('获取排行榜失败')
  }
})
</script>

<style scoped lang="less">
.rank {
  display: flex;
  justify-content: center;
  height: 100%;

  .rank-box {
    margin-top: 60px;
    width: 300px;
    height: 80%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: auto;
    scrollbar-width: none;

    p {
      font-size: 20px;
      text-align: center;
    }

    ul {
      margin-top: 10px;

      li {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
    }
  }
}
</style>

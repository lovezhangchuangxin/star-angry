<template>
  <el-row justify="space-evenly" class="rank">
    <el-col :xs="18" :sm="11" :md="6" :span="6" class="rank-box" ref="rankRef">
      <el-card body-style="padding: 0;">
        <template #header>
          <div class="card-header">
            <span>电力排行榜</span>
          </div>
        </template>
        <el-table
          :data="users"
          stripe
          class="rank-table"
          empty-text="无数据"
          :height="rankHeigth"
        >
          <el-table-column prop="username" label="玩家" />
          <el-table-column prop="score" label="发电量" align="right">
            <template v-slot="scoped">
              {{ numberWithCommas(scoped.row.score) }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { message } from '@/utils/message'
import { numberWithCommas } from '@/utils/number'
import { UserApi } from '@star-angry/api'
import { onMounted, ref } from 'vue'

const rankRef = ref()
let rankHeigth = ref(100)

const users = ref<
  {
    id: string
    username: string
    score: number
  }[]
>([])

onMounted(async () => {
  rankHeigth.value = rankRef.value.$el.clientHeight - 60
  UserApi.getElecRank()
    .then((res) => {
      if (res.code === 0) {
        users.value = res.data
      }
    })
    .catch(() => {
      message.error('获取排行榜失败')
    })
})
</script>

<style scoped lang="less">
.rank {
  height: 100%;

  .rank-box {
    margin: 20px 0;
    max-height: 95%;

    .rank-table {
      width: 100%;
      font-size: 16px;
      background-color: var(--el-table-header-bg-color);
      .max-level {
        margin-left: 10px;
        color: rgb(83, 83, 83);
        font-size: 14px;
      }
    }
  }
}
</style>

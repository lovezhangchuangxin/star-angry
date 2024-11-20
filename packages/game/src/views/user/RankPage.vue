<template>
  <el-row justify="space-evenly" class="rank">
    <el-col :span="20" :offset="2" class="rank-box" ref="rankRef">
      <el-card body-style="padding: 0;">
        <template #header>
          <div class="card-header">
            <span>排行榜</span>
          </div>
        </template>
        <el-table
          :data="users"
          stripe
          class="rank-table"
          empty-text="无数据"
          :height="rankHeigth"
          cell-class-name="rank-cell"
          fit
        >
          <el-table-column prop="username" label="玩家" min-width="100">
            <template v-slot="scoped">
              <span
                :class="
                  scoped.row.lastOnlineTime &&
                  Date.now() - scoped.row.lastOnlineTime < 60000
                    ? 'online'
                    : ''
                "
              >
                {{ scoped.row.username }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="elecProd"
            label="发电量"
            align="right"
            min-width="150"
            sortable
          >
            <template v-slot="scoped">
              {{ numberWithCommas(scoped.row.elecProd || 0) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="totalLevel"
            label="总等级"
            align="right"
            min-width="80"
            sortable
          >
            <template v-slot="scoped">
              {{ numberWithCommas(scoped.row.totalLevel || 0) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="store"
            label="资源"
            align="right"
            min-width="120"
            sortable
          >
            <template v-slot="scoped">
              <NumberFormat :value="scoped.row.store || 0" />
            </template>
          </el-table-column>
          <el-table-column
            prop="activeTime"
            label="活跃"
            align="right"
            min-width="120"
          >
            <template v-slot="scoped">
              <span v-if="scoped.row.activeTime">
                {{ timeFromNow(scoped.row.activeTime) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import NumberFormat from '@/components/number/NumberFormat.vue'
import { message } from '@/utils/message'
import { numberWithCommas, timeFromNow } from '@/utils/number'
import { UserApi } from '@star-angry/api'
import { onMounted, ref } from 'vue'

const rankRef = ref()
let rankHeigth = ref(100)

const users = ref<
  {
    id: string
    username: string
    lastOnlineTime: number
    activeTime: number
    store: number
    totalLevel: number
    maxLevel: number
    elecProd: number
  }[]
>([])

onMounted(async () => {
  rankHeigth.value = rankRef.value.$el.clientHeight - 60
  UserApi.getRank()
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
  padding-top: 50px;

  .rank-box {
    margin: 20px 0;
    max-height: 95%;

    .rank-table {
      width: 100%;
      font-size: 16px;
      background-color: var(--el-table-header-bg-color);
      .online {
        font-weight: bold;
        color: #00ff5f;
      }
      .max-level {
        margin-left: 10px;
        color: rgb(83, 83, 83);
        font-size: 14px;
      }
    }
  }
}
</style>
<style lang="less">
.rank-cell {
  .cell {
    white-space: nowrap;
  }
}
</style>

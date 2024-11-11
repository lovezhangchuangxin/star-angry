<template>
  <!-- 聊天窗 -->
  <div class="chat-window">
    <p class="title" :style="toName ? 'border-bottom: 1px solid #303543;' : ''">
      {{ toName }}
    </p>
    <!-- 内容区 -->
    <div class="content" ref="contentRef">
      <div
        v-for="message in data"
        :key="message.id"
        :class="message.fromId === useStore.id && 'me'"
      >
        <p>{{ message.fromName }}</p>
        <MdViewer :value="message.content" />
      </div>
    </div>
    <!-- 打字区 -->
    <div class="typing">
      <el-input
        v-model="message"
        style="width: 100%"
        :autosize="{ minRows: 2, maxRows: 5 }"
        type="textarea"
        resize="none"
        placeholder="请输入"
      />

      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, toRefs, watch } from 'vue'
import { ElInput, ElButton } from 'element-plus'
import { MessageInfo } from '@star-angry/db/src/model/message'
import MdViewer from '@/components/md-viewer/MdViewer.vue'
import { useUserStore } from '@/store'

interface ChatContentProps {
  toName: string
  data: MessageInfo[]
}

const props = defineProps<ChatContentProps>()
const { toName, data } = toRefs(props)
const emit = defineEmits<{
  sendMessage: [message: string, ok: () => void]
}>()
const useStore = useUserStore()
const message = ref('')
const contentRef = ref<HTMLElement | null>(null)

watch(props, () => {
  nextTick(() => {
    if (!contentRef.value) return
    // 滚动到底部
    contentRef.value!.scrollTop = contentRef.value.scrollHeight
  })
})

const clearMessage = () => {
  message.value = ''
}

const sendMessage = () => {
  emit('sendMessage', message.value, clearMessage)
}
</script>

<style scoped lang="less">
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;

  .title {
    margin: 0;
    padding: 12px;
    text-align: center;
  }

  .content {
    flex: 1;
    padding: 10px;
    overflow: auto;
    scrollbar-width: none;

    div {
      margin-bottom: 10px;

      p {
        margin: 0;
        color: #999;
      }

      &.me > p {
        color: #aba7f7;
      }
    }
  }

  .typing {
    display: flex;
    gap: 10px;
    padding: 10px;
    background: #1c1f2b;
    border-top: 1px solid #303543;
  }
}

:deep(.el-textarea__inner) {
  background-color: #343349;
  box-shadow: none;
  scrollbar-width: none;
  color: #e9e9e9;
}

:deep(.markdown-viewer) {
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #1c1f2b;
}

@media (max-width: 600px) {
  .chat-window {
    .title {
      padding: 8px;
      font-size: 16px;
    }

    .content {
      padding: 8px;
    }

    .typing {
      padding: 8px;
      gap: 8px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
  }

  :deep(.markdown-viewer) {
    padding: 4px 8px;
    font-size: 14px;
  }
}
</style>

<template>
  <!-- 聊天页 -->
  <div class="chat">
    <div class="content">
      <PersonList
        :data="personList"
        class="person-list"
        @select-person="handleSelectPerson"
      />
      <ChatWindow
        :to-name="toName"
        class="chat-window"
        :data="messages"
        @send-message="handleSendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import PersonList from './PersonList.vue'
import ChatWindow from './ChatWindow.vue'
import { message as toast } from '@/utils/message'
import { ResponseData } from '@star-angry/api'
import { MessageInfo } from '@star-angry/db/src/model/message'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const personList = ref<{ id: string; username: string }[]>([
  { id: '__room_keqing', username: '聊天大厅' },
])
const toId = ref('')
const toName = ref('')
const messages = ref<MessageInfo[]>([])
const socket = ref<Socket | null>(null)

onMounted(() => {
  socket.value = io('http://localhost:7788', {
    query: {
      token: localStorage.getItem('token'),
    },
  })

  socket.value.on('connect', () => {
    console.log('connect')
  })

  // 从本地存储中获取已聊天用户列表
  try {
    const chatPersonList = JSON.parse(
      localStorage.getItem('chatPersonList') || '[]',
    ) as string[]
    if (chatPersonList.length) {
      socket.value
        .timeout(5000)
        .emit(
          'queryUsers',
          chatPersonList,
          (
            err: any,
            response: ResponseData<{ id: string; username: string }[]>,
          ) => {
            if (err) {
              toast.error('获取聊天用户列表失败')
            } else {
              personList.value.push(...response.data)
            }
          },
        )
    }
    //  { id: 'room_keqing', username: '聊天大厅' },
  } catch (error) {
    localStorage.setItem('chatPersonList', '[]')
  }

  socket.value.on('receiveChat', (fromId: string, message: MessageInfo) => {
    if (fromId === userStore.id) {
      return
    }
    messages.value.push(message)
  })
})

onUnmounted(() => {
  socket.value?.disconnect()
})

const handleSelectPerson = (id: string, name: string) => {
  getChat(id, name)
}

const getChat = (id: string, name: string) => {
  socket.value
    ?.timeout(5000)
    .emit('getChat', id, (err: any, response: ResponseData<MessageInfo[]>) => {
      if (err) {
        toast.error('获取聊天记录失败')
      } else if (response.code === 0) {
        toId.value = id
        toName.value = name
        messages.value = response.data
      } else {
        toast.error(response.msg)
      }
    })
}

const handleSendMessage = (message: string, ok: () => void) => {
  if (!toId.value) {
    toast.error('请选择聊天对象')
    return
  }

  socket.value
    ?.timeout(5000)
    .emit(
      'sendChat',
      toId.value,
      message,
      (err: any, response: ResponseData<MessageInfo>) => {
        if (err) {
          toast.error('发送消息失败')
        } else if (response.code === 0) {
          ok()
          messages.value = [...messages.value, response.data]
        } else {
          toast.error(response.msg)
        }
      },
    )
}
</script>

<style scoped lang="less">
.chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .content {
    display: flex;
    width: calc(100% - 500px);
    height: calc(100% - 200px);
    min-width: 800px;
    background: #1c1f2b;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    // 移除间距
    gap: 0;
  }

  .person-list {
    width: 100px;
  }
}

@media (max-width: 700px) {
  .chat {
    .content {
      width: 100%;
      height: calc(100% - 100px);
      min-width: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .person-list {
      width: 80px;
    }

    .chat-window {
      width: calc(100% - 80px);
    }
  }
}
</style>

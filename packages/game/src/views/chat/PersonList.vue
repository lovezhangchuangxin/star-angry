<template>
  <!-- 聊天人员列表 -->
  <ul class="chat-person">
    <li
      v-for="item in data"
      :key="item.id"
      @click="emit('selectPerson', item.id, item.username)"
    >
      <span>{{ item.username }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

interface PersonListProps {
  data: {
    id: string
    username: string
  }[]
}

const props = defineProps<PersonListProps>()
const { data } = toRefs(props)
const emit = defineEmits<{
  selectPerson: [toId: string, toName: string]
}>()
</script>

<style scoped lang="less">
.chat-person {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: auto;
  border-right: 1px solid #303543;
  scrollbar-width: none;

  li {
    padding: 10px;
    padding-left: 16px;
    border-bottom: 1px solid #303543;
    color: #e9e9e9;
    cursor: pointer;

    &:hover {
      background: linear-gradient(90deg, #1a1f30 0%, #1c1f2b 100%);
      color: #7670ac;
    }

    span {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@media (max-width: 600px) {
  .chat-person {
    li {
      padding: 8px;
      padding-left: 12px;
      font-size: 14px;
    }
  }
}
</style>

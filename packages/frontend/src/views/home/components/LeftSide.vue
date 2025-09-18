<script setup lang="ts">
import type {ConversationsProps} from 'ant-design-x-vue'
import {Conversations,} from 'ant-design-x-vue'
import {computed, onMounted} from 'vue'
import {LogoutOutlined, PlusOutlined, UserOutlined} from '@ant-design/icons-vue'
import {Avatar, Button, Dropdown, Menu, MenuItem, theme} from 'ant-design-vue'
import {useUserStore} from '@stores/user.ts'
import {useChatStore} from '@stores/chat.ts'
import {useChatHistoryStore} from '@stores/chatHistory.ts'
import {storeToRefs} from 'pinia'
import {useRouter} from "vue-router";
import {toast} from "vue-sonner";


const {token} = theme.useToken()

const styles = computed(() => {
  return {
    'menu': {
      'background': `${token.value.colorBgLayout}80`
    },
  } as const
})


// ==================== State ====================
const {chats, activityChat} = storeToRefs(useChatStore())
const {getChatHistoriesByChatId, initChatHistory} = useChatHistoryStore()
const {getAllChats, chatSocketReconnect} = useChatStore()
const conversationsItems = computed(() => {
  return chats.value.map((chat) => {
    return {
      key: String(chat.id),
      label: chat.title,
    }
  })
})
const {account} =storeToRefs( useUserStore())
const {setUser}= useUserStore()
const router=useRouter()

// ==================== Event ====================
function onAddConversation() {
  if (!activityChat.value) {
    return
  }
  activityChat.value = null
  initChatHistory()
  chatSocketReconnect()
}

const onConversationClick: ConversationsProps['onActiveChange'] = (key) => {
  const chat = chats.value.find(chat => chat.id === Number(key))
  activityChat.value = chat ? chat : null
  if (activityChat.value) {
    getChatHistoriesByChatId(String(activityChat.value.id))
    chatSocketReconnect()
  }
}

const handleLogOut=()=>{
  setUser()
  router.replace('/login')
  toast.info('Info',{
    description:'User logged out',
  })
}

onMounted(async () => {
  await getAllChats()
})

</script>

<template>
  <div :style="styles.menu" class="w-64 h-full flex flex-col">
    <!-- 🌟 Logo -->
    <div class="space-x-2 flex h-16 justify-center items-center">
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable="false"
        alt="logo"
        class="inline-block w-4 h-4"
      >
      <span class="inline-block font-bold">Chat Demo</span>
    </div>

    <!-- 🌟 添加会话 -->
    <Button
      type="text"
      :style="{
        height:'40px',
        margin:'0 12px'
      }"
      @click="onAddConversation"
    >
      <PlusOutlined/>
      新聊天
    </Button>
    <!-- 🌟 会话管理 -->
    <Conversations
      :items="conversationsItems"
      class="flex-1 overflow-y-auto px-4"
      :active-key="activityChat?.id?.toString()"
      @active-change="onConversationClick"
    />

    <!--    用户区域-->
    <div class="border-t border-gray-200 my-4"></div>
    <Dropdown>
      <div
        class="w-full h-12 flex flex-row items-center  px-4 gap-2">
        <!--      头像-->
        <Avatar class="bg-gray" :size="32" shape="circle">
          <template #icon>
            <UserOutlined/>
          </template>
        </Avatar>
        <span>{{ account }}</span>
      </div>

      <template #overlay>
        <Menu>
          <MenuItem class="h-10 flex gap-4 justify-center items-center"
          @click="handleLogOut">
            <LogoutOutlined/>
            注销
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

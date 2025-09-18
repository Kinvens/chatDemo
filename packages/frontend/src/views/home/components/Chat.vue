<script setup lang="tsx">
import type {BubbleListProps} from 'ant-design-x-vue'
import {Bubble, type MessageStatus, Sender, useXAgent, useXChat} from 'ant-design-x-vue'
import {computed, h, nextTick, onMounted, ref, watch} from 'vue'
import {Space, theme} from 'ant-design-vue'
import {storeToRefs} from 'pinia'
import {type Chat, useChatStore} from '@stores/chat.ts'
import {useChatHistoryStore} from "@stores/chatHistory.ts";
import {UserOutlined} from '@ant-design/icons-vue'

type AgentHumanMessage = {
  role: 'human'
  content: string;
};

type AgentAIMessage = {
  role: 'ai';
  content?: string;
};
type AgentMessage = AgentHumanMessage | AgentAIMessage;

const {token} = theme.useToken()
const {activityChat,chatSocket} = storeToRefs(useChatStore())
const {chatHistories} = storeToRefs(useChatHistoryStore())
const {addChat,chatSocketReconnect,chatSocketConnection} = useChatStore()

onMounted(() => {
  console.log(import.meta.env.VITE_WEB_SOCKET_URL)
  chatSocketConnection()
})


const styles = computed(() => {
  return {
    'layout': {
      'width': '100%',
      'min-width': '970px',
      'height': '722px',
      'border-radius': `${token.value.borderRadius}px`,
      'display': 'flex',
      'background': `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    },
    'menu': {
      'background': `${token.value.colorBgLayout}80`,
      'width': '280px',
      'height': '100%',
      'display': 'flex',
      'flex-direction': 'column',
    },
    'conversations': {
      'padding': '0 12px',
      'flex': 1,
      'overflow-y': 'auto',
    },
    'chat': {
      'height': '100%',
      'width': '100%',
      'max-width': '700px',
      'margin': '0 auto',
      'box-sizing': 'border-box',
      'display': 'flex',
      'flex-direction': 'column',
      'padding': `${token.value.paddingLG}px`,
      'gap': '16px',
    },
    'placeholder': {
      'padding-top': '32px',
      'text-align': 'left',
      'flex': 1,
    },
    'sender': {
      'box-shadow': token.value.boxShadow,
    },
    'logo': {
      'display': 'flex',
      'height': '72px',
      'align-items': 'center',
      'justify-content': 'start',
      'padding': '0 24px',
      'box-sizing': 'border-box',
    },
    'logo-img': {
      width: '24px',
      height: '24px',
      display: 'inline-block',
    },
    'logo-span': {
      'display': 'inline-block',
      'margin': '0 8px',
      'font-weight': 'bold',
      'color': token.value.colorText,
      'font-size': '16px',
    },
    'addBtn': {
      background: '#1677ff0f',
      border: '1px solid #1677ff34',
      width: 'calc(100% - 24px)',
      margin: '0 12px 24px 12px',
    },
  } as const
})

const roles: BubbleListProps['roles'] = {
  ai: {
    placement: 'start',
    avatar: {
      icon: <UserOutlined/>, style: {
        color: '#f56a00',
        backgroundColor: '#fde3cf',
      }
    }
  },
  human: {
    placement: 'end', variant: 'shadow', avatar: {
      icon: <UserOutlined/>, style: {
        color: '#fff',
        backgroundColor: '#87d068',
      }
    }
  },
}

// ==================== State ====================
const content = ref('')
const agentRequestLoading = ref(false)
const bubbleBox = ref<HTMLDivElement | null>(null)

// ==================== Runtime ====================
const [agent] = useXAgent<AgentMessage, { message: AgentMessage }, Record<string, any>>({
  request: async ({message}, {onSuccess, onUpdate, onError}) => {
    agentRequestLoading.value = true
    chatSocket.value?.emit('chat_message', {
      chatId: activityChat.value?.id,
      text: message.content,
    }, (val: {
      connectId: string,
      text: string,
      chat?: Chat
    }) => {
      console.log(val, '------------')
      if (val.chat) {
        addChat(val.chat)
      }
    })

    let replay = ''
    // 流式 token
    const tokenHandler = (data: string) => {
      replay += data
      onUpdate({
        role: 'ai',
        content: replay,  // 每收到 token 增量更新
      })
    }

    const endHandler = (data: string) => {
      agentRequestLoading.value = false
      // 最终调用 onSuccess
      onSuccess([{
        role: 'ai',
        content: replay, // 或 data，如果服务端发送完整文本
      }])
      // 清理监听，避免重复注册
      chatSocket.value?.off('chat_message_token', tokenHandler)
      chatSocket.value?.off('chat_message_end', endHandler)
      chatSocket.value?.off('chat_message_error', errorHandler)
    }

    const errorHandler = (err: any) => {
      agentRequestLoading.value = false
      onError(new Error(err?.message || '流式失败'))
      chatSocket.value?.off('chat_message_token', tokenHandler)
      chatSocket.value?.off('chat_message_end', endHandler)
      chatSocket.value?.off('chat_message_error', errorHandler)
    }

    chatSocket.value?.on('chat_message_token', tokenHandler)
    chatSocket.value?.on('chat_message_end', endHandler)
    chatSocket.value?.on('chat_message_error', errorHandler)
  }
})

const {onRequest, messages, setMessages} = useXChat({
  agent: agent.value,
  defaultMessages: [
    {
      id: 'init',
      message: {
        role: 'ai',
        content: '请问我有什么可以帮您！',
      },
      status: 'success',
    },
  ],
})


// ==================== Event ====================
function onSubmit(nextContent: string) {
  if (!nextContent)
    return
  onRequest({
    message: {
      role: "human",
      content: nextContent
    }
  })
  content.value = ''
}

// ==================== Nodes ====================
const placeholderNode = computed(() => h(
  Space,
  {direction: "vertical", size: 16, style: styles.value.placeholder},
))

const items = computed<BubbleListProps['items']>(() => {
  if (messages.value.length === 0) {
    return [{content: placeholderNode, variant: 'borderless'}]
  }
  return messages.value.map(({id, message, status}) => ({
    key: id,
    loading: status === 'loading' && !message.content,
    role: message.role,
    content: message.content,
  }));
})
watch(chatHistories, (curChatHistories) => {
  const newMessages = curChatHistories.map((chatHistory) => {
    return {
      id: chatHistory.id,
      status: 'success' as MessageStatus,
      message: {
        role: chatHistory.role,
        content: chatHistory.content,
      },
    }
  })
  setMessages(newMessages)
  nextTick(() => {
    if (bubbleBox.value) {
      bubbleBox.value.scrollTop = bubbleBox.value.scrollHeight
    }
  })
})

watch(messages, () => {
  nextTick(() => {
    if (bubbleBox.value) {
      bubbleBox.value.scrollTo({
        top: bubbleBox.value.scrollHeight,
        behavior: "smooth",  // 🌟 平滑滚动
      })
    }
  })
})

// watch(activityChat, (curActivityChat) => {
//   reconnect(import.meta.env.VITE_WEB_SOCKET_URL, {
//     auth: {
//       token: localStorage.getItem('accessToken'),
//     },
//     query: {
//       chatId: curActivityChat?.id ? curActivityChat.id : '',
//     }
//   })
// })


</script>

<template>
  <div :style="styles.layout">
    <div :style="styles.chat">
      <!-- 🌟 消息列表 -->
      <div ref='bubbleBox' class="flex-1 overflow-auto">
        <Bubble.List
          :items="items"
          :roles="roles"
        />
      </div>

      <!-- 🌟 提示词 -->
      <!--      <Prompts-->
      <!--        :items="senderPromptsItems"-->
      <!--        @item-click="onPromptsItemClick"-->
      <!--      />-->

      <!-- 🌟 输入框 -->
      <Sender
        :value="content"
        :style="styles.sender"
        :loading="agentRequestLoading"
        submit-type="enter"
        @submit="onSubmit"
        @change="value => content = value"
      >
      </Sender>
    </div>
  </div>
</template>

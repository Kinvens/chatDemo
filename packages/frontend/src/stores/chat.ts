import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getAllChatByUser} from '@/apis/chat.ts'
import {useWebSocket} from "@/hooks";

export type Chat = {
  title: string,
  id: number
}

export const useChatStore = defineStore('chat', () => {

  const chats = ref<Chat[]>([])
  const activityChat = ref<Chat | null>(null)
  const {socket, connect, reconnect} = useWebSocket(import.meta.env.VITE_WEB_SOCKET_URL, {
    auth: {
      token: localStorage.getItem('accessToken'),
    },
    query: {
      chatId: activityChat.value?.id ? activityChat.value.id : '',
    }
  })

  const addChat = (chat: Chat) => {
    activityChat.value = chat
    chats.value.unshift(chat)
  }

  const getAllChats = async () => {
    chats.value = await getAllChatByUser()
  }

  return {
    chats,
    activityChat,
    addChat,
    getAllChats,
    chatSocket: socket,
    chatSocketReconnect: () => reconnect(import.meta.env.VITE_WEB_SOCKET_URL, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
      query: {
        chatId: activityChat.value?.id ? activityChat.value.id : '',
      }
    }),
    chatSocketConnection: connect,
  }
})

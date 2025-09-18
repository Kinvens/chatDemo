import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getAllChatHistoryByChatId} from "@/apis/chatHistory.ts";

export type ChatHistory = {
  id: number,
  role: 'human' | 'ai',
  content: string,
  createdAt?: string,
  updatedAt?: string,
}
export const useChatHistoryStore = defineStore('chatHistory', () => {
  const initialChatHistories: ChatHistory[] = [{
    id: -1,
    content: '请问我有什么可以帮您！',
    role: 'ai'
  }]
  const chatHistories = ref<ChatHistory[]>(initialChatHistories)

  const setChatHistory = (newChatHistories: ChatHistory[]) => {
    chatHistories.value = newChatHistories
  }

  const getChatHistoriesByChatId = async (chatId: string) => {
    const newChatHistories = await getAllChatHistoryByChatId(chatId)
    chatHistories.value = newChatHistories
    console.log(newChatHistories, '-----')
  }

  const initChatHistory = () => {
    chatHistories.value = initialChatHistories
  }

  return {
    chatHistories,
    getChatHistoriesByChatId,
    setChatHistory,
    initChatHistory
  }


})

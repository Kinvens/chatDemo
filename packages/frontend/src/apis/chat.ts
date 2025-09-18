import request from "@/apis/request.ts";
import type {Chat} from "@stores/chat.ts";

/**
 * 获取当前用户的所有聊天会话
 */
export async function getAllChatByUser(): Promise<Chat[]> {
  return await request.get("/chat/findAll").then(response => response.data);
}

/**
 * 删除聊天会话
 */
export async function deleteChatByChatId(chatId: string) {
  return await request.post("/chat/delete", {
    chatId,
  })
}

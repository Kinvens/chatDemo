import request from "@/apis/request.ts";

export async function getAllChatHistoryByChatId(chatId: string) {
  return await request.get("/chatHistory/findAll", {
    params: {chatId: chatId}
  }).then(res => res.data);
}

import { Chat } from "@/types/chat";
import { users } from "./users";
import { generateMessages } from "./messages";

export const generateChats = (): Chat[] => {
  return users.map((user) => {
    const messages = generateMessages(user.id);
    return {
      id: user.id,
      user,
      messages,
      unreadCount: messages.filter(m => m.senderId === user.id && !m.isRead).length,
      lastMessage: messages[messages.length - 1],
    };
  });
};
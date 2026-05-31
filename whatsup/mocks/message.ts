import { Message } from "@/types/chat";
import { currentUser, users, grokUser } from "./users";

export const generateMessages = (chatId: string): Message[] => {
  const user = users.find((u) => u.id === chatId) || users[0];
  
  // Special messages for Grok AI
  if (chatId === "grok-ai") {
    return [
      {
        id: `${chatId}-msg1`,
        text: `Hello! I'm Grok, your AI assistant. I'm here to help you with questions, creative tasks, coding, or just have a friendly conversation. What would you like to talk about?`,
        timestamp: "10:30 AM",
        senderId: grokUser.id,
        isRead: true,
      },
    ];
  }
  
  return [
    {
      id: `${chatId}-msg1`,
      text: `Hi there! How are you doing today?`,
      timestamp: "10:30 AM",
      senderId: user.id,
      isRead: true,
    },
    {
      id: `${chatId}-msg2`,
      text: "I'm doing well, thanks for asking! How about you?",
      timestamp: "10:32 AM",
      senderId: currentUser.id,
      isRead: true,
    },
    {
      id: `${chatId}-msg3`,
      text: "I'm great! Just wanted to check in. Do you have plans for the weekend?",
      timestamp: "10:33 AM",
      senderId: user.id,
      isRead: true,
    },
    {
      id: `${chatId}-msg4`,
      text: "Not yet, I'm thinking about going hiking. Would you like to join?",
      timestamp: "10:35 AM",
      senderId: currentUser.id,
      isRead: true,
    },
    {
      id: `${chatId}-msg5`,
      text: "That sounds fun! I'd love to join. What time were you thinking?",
      timestamp: "10:36 AM",
      senderId: user.id,
      isRead: false,
    },
  ];
};
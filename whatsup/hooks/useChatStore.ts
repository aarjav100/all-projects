import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Chat, Message } from "@/types/chat";
import { generateChats } from "@/mocks/chats";
import { currentUser, grokUser } from "@/mocks/users";

interface ChatState {
  chats: Chat[];
  currentUser: typeof currentUser;
  loading: boolean;
  isGrokTyping: boolean;
  
  // Actions
  sendMessage: (chatId: string, text: string) => void;
  sendGrokMessage: (chatId: string, text: string) => Promise<void>;
  markAsRead: (chatId: string) => void;
  getChat: (chatId: string) => Chat | undefined;
  initializeChats: () => void;
  setGrokTyping: (typing: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentUser,
      loading: true,
      isGrokTyping: false,

      initializeChats: () => {
        const chats = generateChats();
        set({ chats, loading: false });
      },

      getChat: (chatId: string) => {
        return get().chats.find((chat) => chat.id === chatId);
      },

      setGrokTyping: (typing: boolean) => {
        set({ isGrokTyping: typing });
      },

      sendMessage: (chatId: string, text: string) => {
        if (!text.trim()) return;

        const timestamp = new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit'
        });

        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          text,
          timestamp,
          senderId: get().currentUser.id,
          isRead: false,
        };

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: newMessage,
              };
            }
            return chat;
          }),
        }));

        // If sending to Grok, trigger AI response
        if (chatId === "grok-ai") {
          get().sendGrokMessage(chatId, text);
        }
      },

      sendGrokMessage: async (chatId: string, userText: string) => {
        const { setGrokTyping } = get();
        
        try {
          setGrokTyping(true);
          
          // Get chat history for context
          const chat = get().getChat(chatId);
          const messages = chat?.messages || [];
          
          // Prepare messages for AI API
          const aiMessages = [
            {
              role: "system" as const,
              content: "You are Grok, a helpful, witty, and engaging AI assistant. Keep responses conversational and friendly. Be concise but informative."
            },
            ...messages.slice(-10).map(msg => ({
              role: msg.senderId === currentUser.id ? "user" as const : "assistant" as const,
              content: msg.text
            })),
            {
              role: "user" as const,
              content: userText
            }
          ];

          const response = await fetch("https://toolkit.rork.com/text/llm/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages: aiMessages }),
          });

          if (!response.ok) {
            throw new Error("Failed to get AI response");
          }

          const data = await response.json();
          
          const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          });

          const grokMessage: Message = {
            id: `grok-msg-${Date.now()}`,
            text: data.completion,
            timestamp,
            senderId: grokUser.id,
            isRead: false,
          };

          set((state) => ({
            chats: state.chats.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, grokMessage],
                  lastMessage: grokMessage,
                };
              }
              return chat;
            }),
          }));

        } catch (error) {
          console.error("Error getting Grok response:", error);
          
          const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          });

          const errorMessage: Message = {
            id: `grok-error-${Date.now()}`,
            text: "Sorry, I'm having trouble connecting right now. Please try again later.",
            timestamp,
            senderId: grokUser.id,
            isRead: false,
          };

          set((state) => ({
            chats: state.chats.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, errorMessage],
                  lastMessage: errorMessage,
                };
              }
              return chat;
            }),
          }));
        } finally {
          setGrokTyping(false);
        }
      },

      markAsRead: (chatId: string) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                unreadCount: 0,
                messages: chat.messages.map((message) => ({
                  ...message,
                  isRead: true,
                })),
              };
            }
            return chat;
          }),
        }));
      },
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
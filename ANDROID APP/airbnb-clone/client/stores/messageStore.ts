import { create } from 'zustand';
import { messageService } from '../services';

interface MessageState {
  conversations: any[];
  messages: any[];
  isLoading: boolean;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  addMessage: (message: any) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  messages: [],
  isLoading: false,

  fetchConversations: async () => {
    try {
      set({ isLoading: true });
      const { data } = await messageService.getConversations();
      set({ conversations: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      set({ isLoading: true });
      const { data } = await messageService.getMessages(conversationId);
      set({ messages: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  sendMessage: async (conversationId, content) => {
    const { data } = await messageService.sendMessage(conversationId, content);
    set((state) => ({ messages: [...state.messages, data.data] }));
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));

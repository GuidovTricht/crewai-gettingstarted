import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
}

export interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
  lastUpdated: number
}

interface ChatState {
  currentChatId: string | null
  chatHistory: Record<string, ChatThread>
  isDarkMode: boolean
  setCurrentChat: (chatId: string | null) => void
  addMessage: (chatId: string, message: ChatMessage) => void
  createChat: (chatId: string, title?: string) => void
  deleteChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      currentChatId: null,
      chatHistory: {},
      isDarkMode: false,
      
      setCurrentChat: (chatId) => set({ currentChatId: chatId }),
      
      addMessage: (chatId, message) =>
        set((state) => {
          const chat = state.chatHistory[chatId]
          if (!chat) return state

          return {
            chatHistory: {
              ...state.chatHistory,
              [chatId]: {
                ...chat,
                messages: [...chat.messages, message],
                lastUpdated: Date.now(),
              },
            },
          }
        }),

      createChat: (chatId, title = 'New Chat') =>
        set((state) => {
          return {
            chatHistory: {
              ...state.chatHistory,
              [chatId]: {
                id: chatId,
                title,
                messages: [],
                lastUpdated: Date.now(),
              },
            },
          }
        }),

      deleteChat: (chatId) =>
        set((state) => {
          const { [chatId]: _, ...rest } = state.chatHistory
          return { chatHistory: rest }
        }),

      updateChatTitle: (chatId, title) =>
        set((state) => {
          const chat = state.chatHistory[chatId]
          if (!chat) return state

          return {
            chatHistory: {
              ...state.chatHistory,
              [chatId]: {
                ...chat,
                title,
              },
            },
          }
        }),
    }),
    {
      name: 'chat-storage',
    }
  )
) 
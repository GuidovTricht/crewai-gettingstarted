"use client";

import type { ReactNode } from "react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
  type TextContentPart,
} from "@assistant-ui/react";
import { useChatStore } from "~/lib/store";
import { useEffect, useState } from "react";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const convertMessage = (message: ThreadMessageLike) => {
  const textContent = message.content[0] as TextContentPart;
  if (!textContent || textContent.type !== "text") {
    throw new Error("Only text messages are supported");
  }
  
  return {
    role: message.role,
    content: textContent.text,
    timestamp: Date.now(),
  };
};

export function CrewAIChatUIRuntimeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isRunning, setIsRunning] = useState(false);
  const currentChatId = useChatStore((state) => state.currentChatId);
  const messages = useChatStore((state) => 
    currentChatId ? state.chatHistory[currentChatId]?.messages || [] : []
  );
  
  const onNew = async (message: AppendMessage) => {
    if (!currentChatId) return;
    const textContent = message.content[0] as TextContentPart;
    if (!textContent || textContent.type !== "text") {
      throw new Error("Only text messages are supported");
    }

    const userContent = textContent.text;
    const { addMessage, updateChatTitle, chatHistory } = useChatStore.getState();
    
    addMessage(currentChatId, {
      role: 'user',
      content: userContent,
      timestamp: Date.now(),
    });

    const chat = chatHistory[currentChatId]

    if (!chat.title || chat.title === "New Chat") {
      const updatedTitle = userContent.split(" ")[0];
      updateChatTitle(currentChatId, updatedTitle);
    }

    setIsRunning(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userContent,
          chat_id: currentChatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success" && data.content) {
        addMessage(currentChatId, {
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
        });
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages: messages.map(msg => ({
      role: msg.role,
      content: [{ type: "text" as const, text: msg.content }],
    })),
    convertMessage,
    onNew,
  });
  
  async function initializeChat() {
    setIsRunning(true);

    try {      
      const { createChat, setCurrentChat } = useChatStore.getState();
      const chatId = currentChatId || generateUUID();
      createChat(chatId);
      setCurrentChat(chatId);
    } catch (error) {
      console.error("Error initializing chat", error);
    } finally {
      setIsRunning(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeChat();
    }
  }, []);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useChatStore } from '~/lib/store'

export default function Index() {
  const navigate = useNavigate()
  const { createChat, setCurrentChat } = useChatStore()

  useEffect(() => {
    try {
      // Generate a new chat ID using a more secure method
      const chatId = Math.random().toString(36).substring(2, 15)

      // Create a new chat
      createChat(chatId)
      setCurrentChat(chatId)

      // Store chat ID in localStorage for the runtime
      localStorage.setItem('crewai_chat_id', chatId)

      // Redirect to the chat route with appropriate parameters
      navigate(`/chat/${chatId}`)
    } catch (error) {
      console.error('Error creating new chat:', error)
      // Redirect to home on error
      navigate('/')
    }
  }, [navigate, createChat, setCurrentChat])

  return null
} 
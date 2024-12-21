// src/hooks/useChat.ts
import { useState, useEffect } from 'react'

export function useChat() {
  interface Message {
    role: string
    content: string
    timestamp?: number
  }
  
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages')
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const clearMessages = () => {
    setMessages([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setIsLoading(true)
    try {
      const newUserMessage = { 
        role: 'user', 
        content: input,
        timestamp: Date.now()
      }
      setMessages((prevMessages) => [...prevMessages, newUserMessage])
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      })
      
      const text = await response.text()
      const newAIMessage = {
        role: 'model',
        content: text,
        timestamp: Date.now()
      }
      
      setMessages((prevMessages) => [...prevMessages, newAIMessage])
      setInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearMessages,
  }
}
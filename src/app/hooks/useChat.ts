'use client'

import { useState, useCallback, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  messages: Message[]
  input: string
  isLoading: boolean
}

interface ChatStorage {
  [chatId: string]: Message[]
}

export function useChat(chatId?: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    isLoading: false,
  })

  const resetChat = useCallback(() => {
    setState({
      messages: [],
      input: '',
      isLoading: false,
    })
  }, [])

  // Load messages from localStorage when chatId changes
  useEffect(() => {
    if (chatId) {
      const storedChats = localStorage.getItem('chatMessages')
      if (storedChats) {
        try {
          const chats: ChatStorage = JSON.parse(storedChats)
          setState(prev => ({
            ...prev,
            messages: chats[chatId] || [],
            input: '',
            isLoading: false
          }))
        } catch (error) {
          console.error('Error loading chat messages:', error)
          resetChat()
        }
      }
    } else {
      resetChat()
    }
  }, [chatId, resetChat])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      input: e.target.value
    }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!state.input.trim() || state.isLoading || !chatId) return

    const userMessage: Message = {
      role: 'user',
      content: state.input.trim()
    }

    const newMessages = [...state.messages, userMessage]
    
    // Update state immediately with user message
    setState(prev => ({
      ...prev,
      messages: newMessages,
      input: '',
      isLoading: true
    }))

    // Save to localStorage immediately
    try {
      const storedChats = localStorage.getItem('chatMessages')
      const chats: ChatStorage = storedChats ? JSON.parse(storedChats) : {}
      chats[chatId] = newMessages
      localStorage.setItem('chatMessages', JSON.stringify(chats))
    } catch (error) {
      console.error('Error saving chat messages:', error)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const text = await response.text()
      const assistantMessage: Message = {
        role: 'assistant',
        content: text
      }

      const updatedMessages = [...newMessages, assistantMessage]
      
      // Update state with assistant message
      setState(prev => ({
        ...prev,
        messages: updatedMessages,
        isLoading: false
      }))

      // Save updated messages to localStorage
      const storedChats = localStorage.getItem('chatMessages')
      const chats: ChatStorage = storedChats ? JSON.parse(storedChats) : {}
      chats[chatId] = updatedMessages
      localStorage.setItem('chatMessages', JSON.stringify(chats))
    } catch (error) {
      console.error('Error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false
      }))
    }
  }, [state.input, state.isLoading, state.messages, chatId])

  return {
    messages: state.messages,
    input: state.input,
    isLoading: state.isLoading,
    handleInputChange,
    handleSubmit,
    resetChat
  }
}

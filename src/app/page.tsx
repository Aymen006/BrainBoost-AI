'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useChat } from './hooks/useChat'
import { ChatSidebar } from './components/chat-sidebar'
import { TopNav } from './components/top-nav'
import { Bot, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { motion } from 'framer-motion'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function Home() {
  const [activeChatId, setActiveChatId] = useState<string>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [chats, setChats] = useState<Array<{ id: string; title: string; date: Date }>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, resetChat } = useChat(activeChatId)

  const handleNewChat = (title: string) => {
    const newChat = {
      id: Date.now().toString(),
      title,
      date: new Date()
    }
    setChats(prevChats => [newChat, ...prevChats])
    setActiveChatId(newChat.id)
    setIsSidebarOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    if (resetChat) {
      resetChat()
    }
    setActiveChatId(chatId)
    setIsSidebarOpen(false)
  }

  const handleDeleteChat = useCallback((chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(undefined)
      resetChat?.()
    }
    // Clean up chat messages from storage
    const storedChats = localStorage.getItem('chatMessages')
    if (storedChats) {
      const chats = JSON.parse(storedChats)
      delete chats[chatId]
      localStorage.setItem('chatMessages', JSON.stringify(chats))
    }
  }, [activeChatId, resetChat])

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chats')
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          date: new Date(chat.date)
        }))
        setChats(parsedChats)
        // If there are chats and no active chat, set the most recent one as active
        if (parsedChats.length > 0 && !activeChatId) {
          setActiveChatId(parsedChats[0].id)
        }
      } catch (error) {
        console.error('Error loading chats:', error)
        localStorage.removeItem('chats')
      }
    }
    setIsMounted(true)
  }, [])

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats))
    }
  }, [chats])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isMounted) {
    return null
  }

  return (
    <div className={`min-h-screen bg-black text-white ${spaceGrotesk.className}`}>
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#F3904F] to-[#3B4371] opacity-20" />

      {/* Top Navigation */}
      <TopNav 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Sidebar */}
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        activeChat={activeChatId}
        chats={chats}
      />

      {/* Main Content */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 relative h-[calc(100vh-4rem)] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div 
                className="text-8xl font-bold mb-2 opacity-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 0.2, y: 0 }}
              >
                02
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F3904F] to-[#3B4371] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Roseanna AI
              </motion.h1>
              <motion.p
                className="text-gray-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Experience the next generation of AI conversation
              </motion.p>
            </div>

            {/* Chat Messages */}
            <motion.div 
              className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 mb-4 h-[60vh] overflow-y-auto border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-3 mb-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    message.role === 'user' ? 'bg-gradient-to-r from-[#F3904F] to-[#3B4371]' : 'bg-white/10'
                  }`}>
                    {message.role === 'user' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 px-4 py-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-[#F3904F] to-[#3B4371]' 
                      : 'bg-white/10'
                  }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </motion.div>

            {/* Input Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                className="w-full bg-black/40 backdrop-blur-lg rounded-2xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#F3904F] placeholder-gray-500 border border-white/10"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#F3904F] to-[#3B4371] rounded-xl hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const googleMessages = messages.map((message: { role: string; content: string }) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }))

    const chat = model.startChat({
      history: googleMessages.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.9,
      },
    })

    const result = await chat.sendMessage(googleMessages[googleMessages.length - 1].parts[0].text)
    const response = await result.response
    const text = await response.text()
    console.log('API sending response:', text)

    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response('Error processing chat request', { status: 500 })
  }
}

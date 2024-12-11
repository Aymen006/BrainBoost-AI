'use client'

import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { motion } from 'framer-motion'
import { Bot, Send, Loader2, Sparkles, MessageSquare } from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'
import { ChatSidebar } from './components/chat-sidebar'
import { TopNav } from './components/top-nav'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleNewChat = () => {
    // Handle new chat creation here
    console.log('Creating new chat...')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
                  key={message.id}
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


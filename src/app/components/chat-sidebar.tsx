'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Menu } from 'lucide-react'
import { useState } from 'react'
import { ChatNameModal } from './chat-name-modal'

interface ChatHistory {
  id: string
  title: string
  date: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: (title: string) => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  activeChat?: string
  chats: ChatHistory[]
}

export function ChatSidebar({ 
  isOpen, 
  onClose, 
  onNewChat,
  onSelectChat,
  onDeleteChat,
  activeChat,
  chats
}: ChatSidebarProps) {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)

  const todayChats = chats.filter(chat => {
    const today = new Date()
    const chatDate = new Date(chat.date)
    return chatDate.toDateString() === today.toDateString()
  })

  const previousChats = chats.filter(chat => {
    const today = new Date()
    const chatDate = new Date(chat.date)
    return chatDate.toDateString() !== today.toDateString() && 
           (today.getTime() - chatDate.getTime()) <= 7 * 24 * 60 * 60 * 1000
  })

  const handleNewChat = () => {
    setIsNameModalOpen(true)
  }

  const handleCreateChat = (title: string) => {
    onNewChat(title)
    setIsNameModalOpen(false)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed left-0 top-0 w-80 h-screen bg-black/40 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col z-20"
            >
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-[#F3904F] to-[#3B4371] text-white rounded-xl p-3 flex items-center gap-2 hover:opacity-90 transition-opacity mb-6"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>

              {/* Chat History Sections */}
              <div className="flex-1 overflow-y-auto space-y-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Chats</div>
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="group relative"
                    >
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-sm ${
                          activeChat === chat.id ? 'bg-white/10' : ''
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-[#F3904F]" />
                        <span className="truncate">{chat.title}</span>
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Plan */}
              <button
                className="mt-auto w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <div className="font-medium">Upgrade plan</div>
                <div className="text-xs text-gray-400">Get access to GPT-5</div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ChatNameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onSubmit={handleCreateChat}
      />
    </>
  )
}

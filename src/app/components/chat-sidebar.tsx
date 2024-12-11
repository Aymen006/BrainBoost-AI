'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, Menu } from 'lucide-react'
import { useState } from 'react'

interface ChatHistory {
  id: string
  title: string
  date: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
}

export function ChatSidebar({ isOpen, onClose, onNewChat }: ChatSidebarProps) {
  // Mock data - in a real app, this would come from your database
  const todayChats: ChatHistory[] = [
    { id: '1', title: 'Design Ideas Discussion', date: new Date() },
    { id: '2', title: 'Project Timeline Planning', date: new Date() },
  ]

  const previousChats: ChatHistory[] = [
    { id: '3', title: 'Marketing Strategy', date: new Date(Date.now() - 86400000) },
    { id: '4', title: 'Content Calendar', date: new Date(Date.now() - 172800000) },
    { id: '5', title: 'Budget Analysis', date: new Date(Date.now() - 259200000) },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed left-0 top-0 w-80 h-screen bg-black/40 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col z-20"
        >
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-[#F3904F] to-[#3B4371] text-white rounded-xl p-3 flex items-center gap-2 hover:opacity-90 transition-opacity mb-6"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>

          {/* Chat History Sections */}
          <div className="flex-1 overflow-y-auto space-y-6">
            <div>
              <div className="text-sm text-gray-400 mb-2">Today</div>
              {todayChats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#F3904F]" />
                  {chat.title}
                </button>
              ))}
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Previous 7 Days</div>
              {previousChats.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#3B4371]" />
                  {chat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Upgrade Plan */}
          <button
            className="mt-auto w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
          >
            <div className="font-medium">Upgrade plan</div>
            <div className="text-xs text-gray-400">Get access to GPT-4</div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}



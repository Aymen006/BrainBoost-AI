'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ChatNameModal } from './chat-name-modal'

interface NewChatButtonProps {
  onNewChat: (title: string) => void
  className?: string
}

export function NewChatButton({ onNewChat, className = '' }: NewChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleNewChat = (title: string) => {
    onNewChat(title)
    setIsModalOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F3904F] to-[#3B4371] rounded-lg hover:opacity-90 transition-opacity text-sm ${className}`}
      >
        <Plus className="w-4 h-4" />
        New Chat
      </button>

      <ChatNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewChat}
      />
    </>
  )
}

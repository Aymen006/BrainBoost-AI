'use client'

import { Menu } from 'lucide-react'
import { NewChatButton } from './new-chat-button'

interface TopNavProps {
  onToggleSidebar: () => void
  onNewChat: (title: string) => void
  isSidebarOpen: boolean
}

export function TopNav({ onToggleSidebar, onNewChat, isSidebarOpen }: TopNavProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-lg border-b border-white/10 z-10">
      <div className="flex items-center h-full px-4 gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {!isSidebarOpen && (
          <NewChatButton onNewChat={onNewChat} />
        )}
      </div>
    </div>
  )
}

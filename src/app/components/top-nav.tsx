'use client'

import { Menu, Plus } from 'lucide-react'

interface TopNavProps {
  onToggleSidebar: () => void
  onNewChat: () => void
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
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#F3904F] to-[#3B4371] rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        )}
      </div>
    </div>
  )
}


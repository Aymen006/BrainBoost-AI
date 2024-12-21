'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'

interface ChatNameModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (title: string) => void
}

export function ChatNameModal({ isOpen, onClose, onSubmit }: ChatNameModalProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim())
      setTitle('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md mx-4 bg-black/80 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F3904F] to-[#3B4371] bg-clip-text text-transparent">
                Name Your Chat
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Give your chat a memorable name
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chat name..."
                  className="w-full bg-black/40 backdrop-blur-lg rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F3904F] placeholder-gray-500 border border-white/10"
                  autoFocus
                />
              </div>
              <motion.button
                type="submit"
                disabled={!title.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#F3904F] to-[#3B4371] text-white rounded-xl py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Chat
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

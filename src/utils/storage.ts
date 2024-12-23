import { ChatMessage, Chat } from '../types/chat';

export const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
export const MAX_MESSAGES_PER_CHAT = 100;

export const cleanupStorage = (chatId: string) => {
  const storedChats = localStorage.getItem('chats');
  if (!storedChats) return;

  const chats: Record<string, ChatMessage[]> = JSON.parse(storedChats);
  if (chats[chatId]?.length > MAX_MESSAGES_PER_CHAT) {
    chats[chatId] = chats[chatId].slice(-MAX_MESSAGES_PER_CHAT);
    localStorage.setItem('chats', JSON.stringify(chats));
  }
};

export const getStorageSize = () => {
  let size = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length * 2; // UTF-16 uses 2 bytes per character
    }
  }
  return size;
};

export const validateStorageQuota = () => {
  return getStorageSize() < MAX_STORAGE_SIZE;
};

export const saveChat = (chat: Chat) => {
  if (!validateStorageQuota()) {
    throw new Error('Storage quota exceeded');
  }
  const storedChats = localStorage.getItem('chats') || '{}';
  const chats = JSON.parse(storedChats);
  chats[chat.id] = chat;
  localStorage.setItem('chats', JSON.stringify(chats));
  cleanupStorage(chat.id);
};

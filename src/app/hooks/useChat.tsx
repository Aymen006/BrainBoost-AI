import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, ChatError } from '../../types/chat';
import { saveChat, cleanupStorage } from '../../utils/storage';
import { debounce } from 'lodash';

export function useChat(chatId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined' && chatId) {
      const storedChats = localStorage.getItem('chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        return chats[chatId] || [];
      }
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((messages: ChatMessage[]) => {
      if (chatId) {
        try {
          saveChat({
            id: chatId,
            messages,
            title: 'Chat',
            date: new Date(),
          });
        } catch (error) {
          setError({
            error: true,
            message: error instanceof Error ? error.message : 'Failed to save chat',
          });
        }
      }
    }, 1000),
    [chatId]
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && chatId && messages.length > 0) {
      debouncedSave(messages);
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [messages, chatId, debouncedSave]);

  const validateMessage = (message: Partial<ChatMessage>): boolean => {
    return Boolean(message.content && message.role);
  };

  const handleError = (error: Error): ChatError => {
    const chatError = {
      error: true,
      message: error.message,
    };
    setError(chatError);
    return chatError;
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    if (typeof window !== 'undefined' && chatId) {
      const storedChats = localStorage.getItem('chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        delete chats[chatId];
        localStorage.setItem('chats', JSON.stringify(chats));
      }
    }
  }, [chatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    if (!validateMessage(newMessage)) {
      handleError(new Error('Invalid message format'));
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      setMessages(prev => [...prev, newMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const text = await response.text();
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: text,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setInput('');

      if (chatId) {
        cleanupStorage(chatId);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        handleError(error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const getAllChatMessages = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to get messages');
      }
      const messages = await response.json();
      return messages;
    } catch (error) {
      if (error instanceof Error) {
        handleError(error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    getAllChatMessages().then(messages => {
      setMessages(messages);
    })
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearMessages,
    error,
  };
}
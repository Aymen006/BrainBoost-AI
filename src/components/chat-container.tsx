import { useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { ChatMessageComponent } from './chat-message';
import { Loading } from './ui/loading';
import { ErrorBoundary } from './error-boundary';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: { message: string } | null;
}

export const ChatContainer = ({ messages, isLoading, error }: ChatContainerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ErrorBoundary>
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-label="Chat messages"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <ChatMessageComponent message={messages[virtualRow.index]} />
            </div>
          ))}
        </div>
        
        {isLoading && <Loading className="py-4" />}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded">
            {error.message}
          </div>
        )}
        
        <div ref={endRef} />
      </div>
    </ErrorBoundary>
  );
};

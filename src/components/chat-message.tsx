import { memo } from 'react';
import { ChatMessage } from '../types/chat';
import { Bot } from 'lucide-react';

interface MessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent = memo(({ message }: MessageProps) => {
  const isBot = message.role === 'model';
  
  return (
    <div
      className={`flex items-start space-x-4 p-4 ${
        isBot ? 'bg-secondary' : 'bg-background'
      }`}
      role="listitem"
      aria-label={`${isBot ? 'Model' : 'User'} message`}
    >
      {isBot && (
        <div className="flex-shrink-0">
          <Bot className="h-6 w-6" aria-hidden="true" />
        </div>
      )}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {isBot ? 'Model' : 'You'}
        </p>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: message.content }}
        />
        <time 
          className="text-xs text-muted-foreground"
          dateTime={new Date(message.timestamp).toISOString()}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
});

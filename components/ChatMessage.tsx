'use client';

import { cn } from '@/utils/cn';

interface ChatMessageProps {
  message: {
    id: number;
    text: string;
    sender: 'user' | 'stranger';
    timestamp: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      'flex',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] rounded-lg px-4 py-2',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
      )}>
        <p className="text-sm">{message.text}</p>
        <time className={cn(
          'text-xs mt-1 block',
          isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(message.timestamp))}
        </time>
      </div>
    </div>
  );
}
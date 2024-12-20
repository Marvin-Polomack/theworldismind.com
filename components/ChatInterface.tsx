'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, UserRound, RefreshCw } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import { useToast } from '@/hooks/use-toast';

export default function ChatInterface() {
  interface Message {
    id: number;
    text: string;
    sender: "user" | "stranger"
    timestamp: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const { toast } = useToast();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user" as const, // explicitly typed as "user"
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    // Here you would also send the message through WebSocket
  };

  const findNewPartner = () => {
    toast({
      title: "Looking for a new partner...",
      description: "Please wait while we connect you with someone new.",
    });
    // Implementation for finding a new chat partner
  };

  return (
    <div className="max-w-4xl mx-auto h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UserRound className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">
            {isConnected ? 'Connected with Stranger' : 'Looking for someone...'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={findNewPartner}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 rounded-lg border bg-card">
        <div className="space-y-4" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="text-sm text-muted-foreground">
              Stranger is typing...
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
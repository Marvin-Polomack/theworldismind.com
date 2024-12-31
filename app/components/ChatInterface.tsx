'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Send, UserRound, RefreshCw } from 'lucide-react';
import ChatMessage from '@/app/components/ChatMessage';
import { useToast } from '@/app/hooks/use-toast';
import useSocket from '@/app/hooks/use-socket'; // Import your custom hook for WebSocket

export default function ChatInterface() {
  interface Message {
    id: number;
    text: string;
    sender: "user" | "stranger";
    timestamp: string;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const socket = useSocket(); // Initialize the socket connection

  // Listen for messages from the server
  useEffect(() => {
    if (!socket) return;
    socket?.emit('user joined', { timestamp: new Date().toISOString() });
    socket.on('chat message', (msg: string) => {
      const newMessage: Message = {
        id: Date.now(),
        text: msg,
        sender: 'stranger',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on('connect', () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      console.log("Cleaning up useEffect for socket:", socket);
      socket.off('chat message');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('looking for pair');

    socket.on('paired', (newRoomId: string) => {
      setRoomId(newRoomId);
      setIsPaired(true);
      toast({
        title: "Connected!",
        description: "You've been paired with a stranger.",
      });
    });

    socket.on('partner disconnected', () => {
      setIsPaired(false);
      setRoomId(null);
      toast({
        title: "Partner disconnected",
        description: "Your chat partner has left the conversation.",
      });
    });

    // Retry pairing if not paired within 10 seconds
    const timeout = setTimeout(() => {
      if (!isPaired) {
        console.log('Retrying pairing...');
        socket.emit('looking for pair');
      }
    }, 10000);

    return () => {
      clearTimeout(timeout); // Cleanup timeout
      socket.off('paired');
      socket.off('partner disconnected');
    };
  }, [isPaired, socket]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Send the message without requiring roomId
    socket.emit('chat message', inputMessage);
  };
  const findNewPartner = () => {
    if (!socket) return;
    
    setMessages([]);
    setIsPaired(false);
    setRoomId(null);

    if (roomId) {
      socket.emit('leave room', roomId, () => {
        console.log(`Left room: ${roomId}`);
        setRoomId(null);
      });
    }

    socket.emit('looking for pair');
    
    toast({
      title: "Looking for a new partner...",
      description: "Please wait while we connect you with someone new.",
    });
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
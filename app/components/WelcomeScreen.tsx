'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { MessageSquare } from 'lucide-react';
import useSocket from '@/app/hooks/use-socket';

// const socket = useSocket();

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-6 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <MessageSquare className="w-16 h-16 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Welcome to TWIMChat</h1>
          <p className="text-muted-foreground">
            Connect with random people from around the world. Start meaningful conversations and make new friends.
          </p>
          <div className="space-y-2 w-full">
          <Button 
            className="w-full"
            size="lg"
            onClick={() => {
              setIsVisible(false);
              // Notify server that user has joined the chat
              // socket?.emit('user joined', { timestamp: new Date().toISOString() });
            }}
          >
            Start Chatting
          </Button>

            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 p-6 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <MessageSquare className="w-16 h-16 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Welcome to RandomChat</h1>
          <p className="text-muted-foreground">
            Connect with random people from around the world. Start meaningful conversations and make new friends.
          </p>
          <div className="space-y-2 w-full">
            <Button 
              className="w-full"
              size="lg"
              onClick={() => setIsVisible(false)}
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
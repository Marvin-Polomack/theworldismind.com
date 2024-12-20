import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';
import WelcomeScreen from '@/components/WelcomeScreen';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomeScreen />
        <ChatInterface />
      </Suspense>
    </main>
  );
}
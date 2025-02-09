import ChatInterface from "@/components/ChatInterface";
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import { getUser } from '@/utils/supabase/queries';
import MagicCard from "@/components/ui/MagicCard";
import { DockElement } from "@/components/ui/Dock/Dock";
import DockWrapper from "@/components/DockWrapper";
import ChatContainer from "@/components/ChatContainer";

export default async function ChatPage() {
  const supabase = await createClient();

  const [user] = await Promise.all([getUser(supabase)]);
  if (!user) {
    return redirect('/signin?redirect=/chat');
  } else {
    return (
      <div className="relative h-screen">
      <ChatContainer>
      <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
        <div className="relative bottom-0" style={{ width: "90%", height: "85%" }}>
            <ChatInterface />
        </div>
        <div className="flex items-center w-full">
          <DockWrapper />
        </div>
      </div>
      </ChatContainer>
      </div>
    );
  }
}
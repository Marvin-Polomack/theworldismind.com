'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface from "@/components/chat/ChatInterface";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";
import DockWrapper from "@/components/DockWrapper";
import { MorphingMenu } from "@/components/ui/misc/morphing-menu";
import { UserProfilePopover } from "@/components/Profile/UserProfilePopover";
import Loading from '@/app/loading';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [topicId, setTopicId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const menuLinks = [
    { href: "/", label: "Home" },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!roomId) {
        setError("Room ID is missing.");
        setLoading(false);
        return;
      }
      
      try {
        const supabase = await createClient();
        const user = await getUser(supabase);
        if (!user) {
          router.push("/signin?redirect=/chat");
          return;
        }

        const { data: profile } = await supabase
          .schema('profiles')
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile);

        const { data: room, error: roomError } = await supabase
          .schema("chat")
          .from("rooms")
          .select("topic_id")
          .eq("id", roomId)
          .single();

        if (roomError || !room) {
          setError("Error loading room information.");
            setLoading(false);
            return;
          }
        setTopicId(room.topic_id);

        const { data: otherMember, error: otherMemberError } = await supabase
          .schema("chat")
          .from("room_members")
          .select("user_id")
          .eq("room_id", roomId)
          .neq("user_id", user.id)
          .single();

        if (otherMemberError || !otherMember) {
          const leaveResponse = await fetch(`/api/chat/${roomId}/leave-room`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leaveRoom: true, roomId: roomId }),
          });
          if (!leaveResponse.ok) {
            setError("Error leaving room.");
        setLoading(false);
            return;
      }
          router.push('/chat');
          return;
    }

        setOtherUserId(otherMember.user_id);
        setUser(user);
        setLoading(false);
      } catch (err) {
        setError("Unexpected error.");
        setLoading(false);
      }
    }

    fetchData();
  }, [roomId, router]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center z-50 px-4 py-2">
        <div className="flex items-center">
          <MorphingMenu links={menuLinks} className="relative static" />
        </div>
        <div className="flex items-center">
          <UserProfilePopover userProfile={userProfile} user={user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] sm:h-[calc(100vh-160px)] sm:max-h-[calc(100vh-160px)]">
        <div className="w-full md:w-[90%] h-full max-h-full overflow-hidden flex flex-col">
          <ChatInterface
            topic_id={topicId!}
            otherUserId={otherUserId!}
            roomId={roomId!}
            userId={user.id}
          />
        </div>
      </main>

      {/* Footer - Always visible at bottom */}
      <footer className="py-3 px-4 flex justify-center items-center z-50 shrink-0">
        <DockWrapper roomId={roomId!} />
      </footer>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ChatInterface from "@/components/chat/ChatInterface";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";
import DockWrapper from "@/components/DockWrapper";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  // Ensure that roomId is a string by checking if params.id is an array
  const roomId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [topicId, setTopicId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

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

        // Query the chat.rooms table for the topic_id of the current room.
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

        // Query the chat.room_members table for the other user in the room.
        const { data: otherMember, error: otherMemberError } = await supabase
          .schema("chat")
          .from("room_members")
          .select("user_id")
          .eq("room_id", roomId)
          .neq("user_id", user.id)
          .single();

        if (otherMemberError || !otherMember) {
          // Instead of showing an error, call the /api/chat/leave-room endpoint.
          const leaveResponse = await fetch('/api/chat/leave-room', {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative h-screen">
      <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
        <div
          className="relative bottom-4"
          style={{ width: "90%", height: "85%" }}
        >
          <ChatInterface
            topic_id={topicId!}
            otherUserId={otherUserId!}
            roomId={roomId!}
            userId={user.id}
          />
        </div>
        <div className="absolute flex items-center w-full bottom-3">
          <DockWrapper roomId={roomId!} />
        </div>
      </div>
    </div>
  );
}
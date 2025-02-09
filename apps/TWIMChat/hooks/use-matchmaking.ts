import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function useMatchmaking(user_id: string, topic_id: number) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const joinMatchmaking = async () => {
      setWaiting(true);
      const response = await fetch('/api/chat/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, topic_id }),
      });
      const data = await response.json();

      if (data.matched) {
        setRoomId(data.room_id);
        setWaiting(false);
      }
    };

    joinMatchmaking();

    const subscription = supabase
      .channel('matchmaking')
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'matchmaking' }, (payload) => {
        if (payload.old.user_id === user_id) {
          setRoomId(payload.old.room_id);
          setWaiting(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user_id, topic_id]);

  return { roomId, waiting };
}

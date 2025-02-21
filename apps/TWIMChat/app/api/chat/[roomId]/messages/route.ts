// File: app/api/chat/[roomId]/messages/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { getUser } from "@/utils/supabase/queries";

type Props = {
  params: Promise<{
    roomId: string
  }>
}

export async function GET(
  request: Request,
  props: Props
) {
  const { roomId } = await props.params;

  // Create the Supabase client first
  const supabase = await createClient();

  // Get the connected user
  const user = await getUser(supabase);
  const userId = user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId in query parameters' },
      { status: 400 }
    );
  }

  // Fetch messages from the "chat" schema
  const { data, error } = await supabase
    .schema('chat')
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map the messages to include a "role" and convert created_at to a Date object
  const messagesWithRole = data.map((msg: any) => ({
    ...msg,
    role: msg.sender_id === userId ? 'sender' : 'receiver',
    created_at: new Date(msg.created_at),
  }));

  return NextResponse.json(messagesWithRole);
}
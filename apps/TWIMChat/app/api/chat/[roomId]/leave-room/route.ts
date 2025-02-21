import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUser } from "@/utils/supabase/queries";

type Props = {
  params: Promise<{
    roomId: string
  }>
}

export async function POST(
  req: Request,
  props: Props
) {
  const { roomId } = await props.params;

  try {
    const { leaveRoom } = await req.json();

    // Create the Supabase client and get the user ID
    const supabase = await createClient();
    const user = await getUser(supabase);
    const userId = user?.id;

    if (!leaveRoom || !userId) {
      return NextResponse.json(
        { error: 'Missing leaveRoom flag or userId' },
        { status: 400 }
      );
    }

    const { error: rmError } = await supabase
      .schema('chat')
      .rpc("remove_user_from_room", { p_user_id: userId, p_room_id: roomId });
    if (rmError) {
      console.error('Error deleting from room_members:', rmError);
      return NextResponse.json({ error: rmError.message }, { status: 500 });
    }

    const { error: matchmakingError } = await supabase
      .schema('chat')
      .rpc("delete_user_matchmaking_records", { p_user_id: userId });
    if (matchmakingError) {
      console.error('Error deleting from matchmaking:', matchmakingError);
      return NextResponse.json({ error: matchmakingError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'User records deleted successfully.' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
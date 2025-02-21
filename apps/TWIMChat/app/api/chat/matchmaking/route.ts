import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/queries";

export async function POST(request: Request) {
  try {
    // Create the Supabase client first
    const supabase = await createClient();

    // Parse JSON from the request body
    const { topic_id } = await request.json();

    // Get the connected user
    const user = await getUser(supabase);
    const user_id = user?.id;

    if (!user_id || !topic_id) {
      return new Response(
        JSON.stringify({ error: "Missing topic_id or user_id" }),
        { status: 400 }
      );
    }

    // Check if the user already has a record in the matchmaking table
    const { data: existingUserRecords, error: existingUserError } = await supabase
      .schema("chat")
      .from("matchmaking")
      .select("*")
      .eq("user_id", user_id);

    if (existingUserError) {
      return new Response(
        JSON.stringify({ error: existingUserError.message }),
        { status: 500 }
      );
    }

    if (existingUserRecords && existingUserRecords.length > 0) {
      // Update the existing record with the new topic_id
      const { error: updateError } = await supabase
        .schema("chat")
        .from("matchmaking")
        .update({ topic_id })
        .eq("user_id", user_id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500 }
        );
      }
    } else {
      // No existing record, insert a new one
      const { error } = await supabase
        .schema("chat")
        .from("matchmaking")
        .insert([{ user_id, topic_id }]);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500 }
        );
      }
    }

    // Check if a match already exists (with a different user)
    const { data: existingMatch, error: matchError } = await supabase
      .schema("chat")
      .from("matchmaking")
      .select("*")
      .eq("topic_id", topic_id)
      .neq("user_id", user_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (matchError && matchError.code !== "PGRST116") {
      return new Response(
        JSON.stringify({ error: matchError.message }),
        { status: 500 }
      );
    }

    if (existingMatch) {
      // Check if the current user is already in an active room
      const { data: currentUserRooms, error: currentUserError } = await supabase
        .schema("chat")
        .rpc("get_active_rooms_for_user", { p_user_id: user_id });
    
      if (currentUserError) {
        return new Response(
          JSON.stringify({ error: currentUserError.message }),
          { status: 500 }
        );
      }
    
      // Check if the matched user is already in an active room
      const { data: matchedUserRooms, error: matchedUserError } = await supabase
        .schema("chat")
        .rpc("get_active_rooms_for_user", { p_user_id: existingMatch.user_id });
    
      if (matchedUserError) {
        return new Response(
          JSON.stringify({ error: matchedUserError.message }),
          { status: 500 }
        );
      }
    
      // If either user has active rooms, delete their matchmaking record(s) and return a waiting message
      if (
        (currentUserRooms && currentUserRooms.length > 0) ||
        (matchedUserRooms && matchedUserRooms.length > 0)
      ) {
        if (currentUserRooms && currentUserRooms.length > 0) {
          await supabase
            .schema("chat")
            .from("matchmaking")
            .delete()
            .eq("user_id", user_id);
        }
        if (matchedUserRooms && matchedUserRooms.length > 0) {
          await supabase
            .schema("chat")
            .from("matchmaking")
            .delete()
            .eq("user_id", existingMatch.user_id);
        }
    
        return new Response(
          JSON.stringify({ message: "Active matchmaking record(s) deleted, waiting for a match", matched: false }),
          { status: 200 }
        );
      }
      // Create a room
      const { data: room, error: createRoomError } = await supabase
        .schema("chat")
        .rpc("create_room", { p_topic_id: topic_id });
    
      if (createRoomError) {
        return new Response(
          JSON.stringify({ error: createRoomError.message }),
          { status: 500 }
        );
      }

      // Match found and both users are free, create a room
      const addUserToRoom = (uid: string) =>
        supabase.schema("chat").rpc("add_user_to_room", { p_user_id: uid, p_room_id: room.id });

      const [userRoomResult, matchedUserRoomResult] = await Promise.all([
        addUserToRoom(user_id),
        addUserToRoom(existingMatch.user_id),
      ]);

      if (userRoomResult.error || matchedUserRoomResult.error) {
        const errorMessage =
          userRoomResult.error?.message || matchedUserRoomResult.error?.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500 }
        );
      }

      // Remove the matched users from matchmaking using the RPC function (one ID per call)
      const deleteUserMatchmakingRecord = (uid: string) =>
        supabase.schema("chat").rpc("delete_user_matchmaking_records", { p_user_id: uid });

      const [currentDeleteResult, matchDeleteResult] = await Promise.all([
        deleteUserMatchmakingRecord(user_id),
        deleteUserMatchmakingRecord(existingMatch.user_id),
      ]);

      if (currentDeleteResult.error || matchDeleteResult.error) {
        const errorMessage =
          currentDeleteResult.error?.message || matchDeleteResult.error?.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ room_id: room.id, matched: true }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Waiting for a match", matched: false }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
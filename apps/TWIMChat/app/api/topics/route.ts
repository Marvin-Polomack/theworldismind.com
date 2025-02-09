import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server'


export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "rooms_count"; // Not used in function but available if needed.
  const order_direction = searchParams.get("order") || "desc";
  const limit_count = parseInt(searchParams.get("limit") || "5", 10);

  // Call the RPC function you defined in your database.
  const { data, error } = await supabase.schema("chat").rpc("get_topics_with_rooms", {
    search,
    sort,
    order_direction,
    limit_count,
  });

  if (error) {
    console.error("Error fetching topics with rooms:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
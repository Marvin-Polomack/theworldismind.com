// import { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

//   const { user_id, topic_id } = req.body;
//   if (!user_id || !topic_id) return res.status(400).json({ error: 'Missing user_id or topic_id' });

//   // Check if a match already exists
//   const { data: existingMatch, error: matchError } = await supabase
//     .from('matchmaking')
//     .select('*')
//     .eq('topic_id', topic_id)
//     .neq('user_id', user_id)
//     .order('created_at', { ascending: true })
//     .limit(1)
//     .single();

//   if (matchError && matchError.code !== 'PGRST116') return res.status(500).json({ error: matchError.message });

//   if (existingMatch) {
//     // Match found, create a room
//     const { data: room, error: roomError } = await supabase
//       .from('rooms')
//       .insert([{ topic_id }])
//       .select()
//       .single();

//     if (roomError) return res.status(500).json({ error: roomError.message });

//     // Add both users to the room
//     const { error: membersError } = await supabase.from('room_members').insert([
//       { room_id: room.id, user_id },
//       { room_id: room.id, user_id: existingMatch.user_id },
//     ]);

//     if (membersError) return res.status(500).json({ error: membersError.message });

//     // Remove both from matchmaking
//     await supabase.from('matchmaking').delete().eq('id', existingMatch.id);
    
//     return res.status(200).json({ room_id: room.id, matched: true });
//   } else {
//     // No match found, add user to matchmaking
//     const { error } = await supabase.from('matchmaking').insert([{ user_id, topic_id }]);
//     if (error) return res.status(500).json({ error: error.message });

//     return res.status(200).json({ message: 'Waiting for a match', matched: false });
//   }
// }

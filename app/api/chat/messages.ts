// import { NextApiRequest, NextApiResponse } from 'next';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

//   const { room_id, user_id, content } = req.body;
//   if (!room_id || !user_id || !content) return res.status(400).json({ error: 'Missing required fields' });

//   const { error } = await supabase.from('messages').insert([{ room_id, user_id, content }]);

//   if (error) return res.status(500).json({ error: error.message });

//   return res.status(200).json({ success: true });
// }

// app/chat/actions.ts
'use server';

import { createClient } from '@/utils/supabase/client';

export async function createMessage(content: string, userId: string | null) {
  const { data, error } = await createClient()
    .from('messages')
    .insert({ content, user_id: userId })
    .select();

  if (error) throw new Error(error.message);
  return data;
}

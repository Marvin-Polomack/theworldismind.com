import { createServerSupabaseClient as createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { Database } from '@/types/types_db';

export const createServerSupabaseClient = cache(() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const cookieStore = cookies();

  return createClient<Database>({
    supabaseUrl,
    supabaseKey,
    options: {
      global: {
        headers: {
          Cookie: cookieStore.getAll()
        }
      }
    }
  });
});
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import { getUser } from '@/utils/supabase/queries';
import DataTable from "@/components/ui/Data/DataTable";
import DockWrapper from "@/components/DockWrapper";
import MagicCard from "@/components/ui/MagicCard";

export default async function ChatPage() {
  const supabase = await createClient();

  const [user] = await Promise.all([getUser(supabase)]);
  if (!user) {
    return redirect('/signin?redirect=/chat');
  } else {
    return (
      <div className="relative h-screen">
      <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
        <div className="relative bottom-0" >
          <MagicCard  title={`TWIM Chat`} className='relative py-6 flex flex-col items-center mx-auto'>
            <DataTable />
          </MagicCard>
        </div>
        <div className="absolute flex items-center w-full bottom-3">
          <DockWrapper />
        </div>
      </div>
      </div>
    );
  }
}
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { getUser } from "@/utils/supabase/queries";
import TopicsTable from "@/components/ui/Data/TopicsTable";
import DockWrapper from "@/components/DockWrapper";
import MagicCard from "@/components/ui/MagicCard";
import { RippleLogo } from "@/components/chat/ripple-logo";
import { User } from "@supabase/supabase-js";
import Loading from "@/app/loading";
import { MorphingMenu } from "@/components/ui/misc/morphing-menu";
import { UserProfilePopover } from "@/components/Profile/UserProfilePopover";
import { AnimatedModal } from "@/components/Modal/AnimatedModal";
import { useRealHeight } from '@/hooks/useRealHeight';

export default function ChatPage() {
  const [matchmakingStarted, setMatchmakingStarted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Use the new hook with device-specific percentages
  const { height: containerHeight } = useRealHeight({
    smallPercentage: 75, // 75% for very small devices
    mediumSmallPercentage: 78, // 78% for medium-small devices
    regularPercentage: 80, // 80% for regular mobile
    desktopPercentage: 82, // 82% for desktop
  });

  const menuLinks = [
    { href: "/", label: "Home" },
  ];
  // Function to check if the user already has an active room
  async function checkActiveRoom(currentUser: User) {
    const supabase = await createClient();
    const { data: activeRooms, error } = await supabase.schema('chat').rpc("get_active_rooms_for_user", { p_user_id: currentUser.id });
    if (error) {
      console.error("Error checking active rooms:", error);
      return;
    }
    if (activeRooms && activeRooms.length > 0) {
      redirect(`/chat/${activeRooms[0].id}`);
    }
  }

  // Fetch user on mount and check active room immediately
  useEffect(() => {
    async function fetchUser() {
      const supabase = await createClient();
      const fetchedUser = await getUser(supabase);
      if (!fetchedUser) {
        redirect("/signin?redirect=/chat");
      } else {
        setUser(fetchedUser);
        await checkActiveRoom(fetchedUser);
      }
      // Fetch user profile
      const { data: profile } = await supabase
        .schema('profiles')
        .from('profiles')
        .select('*')
        .eq('id', fetchedUser.id)
        .single();

      setUserProfile(profile);
    }
    fetchUser();
    
  }, []);

  // Setup realtime subscription when matchmaking has started.
  useEffect(() => {
    if (matchmakingStarted && user) {
      checkActiveRoom(user);
      console.log("Matchmaking started, setting up realtime subscription...");
      const supabase = createClient();
      const channel = supabase
        .channel("matchmaking_changes")
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "chat",
            table: "matchmaking",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("Matchmaking record deleted:", payload);
            checkActiveRoom(user);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [matchmakingStarted, user]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex real-screen flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center z-50 px-4 py-2">
        <div className="flex items-center">
          <MorphingMenu links={menuLinks} className="relative static" />
        </div>
        <div className="flex items-center">
          <UserProfilePopover userProfile={userProfile} user={user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatedModal />
        <div 
          className="w-full md:w-[70%] flex flex-col"
          style={{ height: containerHeight, maxHeight: containerHeight }}
        >
          <MagicCard title="Choisit ton sujet" className="relative flex-1 overflow-hidden flex flex-col items-center mx-auto p-4">
            {matchmakingStarted ? (
              <RippleLogo />
            ) : (
              <div className="w-full h-full overflow-hidden flex flex-col">
                <TopicsTable onStartMatchmaking={() => setMatchmakingStarted(true)} />
              </div>
            )}
          </MagicCard>
        </div>
      </main>

      {/* Footer - Always visible at bottom */}
      <footer className="py-3 px-4 flex justify-center items-center z-50 shrink-0">
        <DockWrapper />
      </footer>
    </div>
  );
}
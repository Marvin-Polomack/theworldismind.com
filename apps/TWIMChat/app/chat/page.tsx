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
export default function ChatPage() {
  const [matchmakingStarted, setMatchmakingStarted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    <div className="relative h-screen">
      <MorphingMenu links={menuLinks} />
      <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
        <div className="relative bottom-0" style={{ width: "70%", height: "80%" }}>
          <MagicCard title="Choisit ton sujet" className="relative py-6 flex flex-col items-center mx-auto">
            {matchmakingStarted ? (
              <RippleLogo />
            ) : (
              <TopicsTable onStartMatchmaking={() => setMatchmakingStarted(true)} />
            )}
          </MagicCard>
        </div>
        <div className="absolute flex items-center w-full bottom-3">
          <DockWrapper />
        </div>
      </div>
    </div>
  );
}
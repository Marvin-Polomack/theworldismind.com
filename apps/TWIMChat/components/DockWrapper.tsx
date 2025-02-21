'use client'

import { DockElement, NavItem } from './ui/Dock/Dock';
import { usePathname, useRouter } from 'next/navigation';
import { DoorOpen, HomeIcon } from 'lucide-react';

export default function DockWrapper({ roomId }: { roomId?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  let navItems: NavItem[] | undefined;

  if (pathname.startsWith("/chat/")) {
    // Create an async function that calls your API route.
    const handleLeaveRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        const response = await fetch(`/api/chat/${roomId}/leave-room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ leaveRoom: true})
        });
        if (response.ok) {
          // Optionally, navigate to another page after successfully leaving.
          router.push("/chat");
        } else {
          console.error("Failed to leave room");
        }
      } catch (err) {
        console.error("Error calling leave room API:", err);
      }
    };

    navItems = [
      { href: "/", icon: HomeIcon, label: "Home" },
      // Remove the href and add an onClick handler.
      { icon: DoorOpen, label: "Quitter le débat", onClick: handleLeaveRoom }
    ];
  }

  return <DockElement navItems={navItems} className="z-50" />;
}
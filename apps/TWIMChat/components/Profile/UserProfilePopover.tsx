import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/misc/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/misc/popover";
import { Button } from "@/components/ui/misc/button";
import { Settings, User as UserIcon } from "lucide-react";

interface UserProfilePopoverProps {
  userProfile: {
    profile_image?: string;
    username?: string;
  };
  user: {
    email?: string;
  };
}

export function UserProfilePopover({ userProfile, user }: UserProfilePopoverProps) {
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-0 h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={userProfile?.profile_image} 
              alt={userProfile?.username || user?.email} 
            />
            <AvatarFallback>
              {(userProfile?.username?.[0] || user?.email?.[0] || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push(`/profiles/${userProfile?.username}`)}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profil
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => router.push('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

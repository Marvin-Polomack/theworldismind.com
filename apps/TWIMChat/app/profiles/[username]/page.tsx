'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";
import MagicCard from "@/components/ui/MagicCard";
import { Button } from "@/components/ui/misc/button";
import { Input } from "@/components/ui/misc/input";
import { Textarea } from "@/components/ui/misc/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/misc/avatar";
import { Loader2 } from "lucide-react";
import DockWrapper from "@/components/DockWrapper";
import { MorphingMenu } from "@/components/ui/misc/morphing-menu";
import { HomeIcon } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  bio: string;
  profile_image: string;
}

const menuLinks = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/chat", label: "TWIM Chat" },
];

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editForm, setEditForm] = useState<Profile>({
    id: currentUser?.id || '',
    username: '',
    bio: '',
    profile_image: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const user = await getUser(supabase);
      setCurrentUser(user);

      const { data, error } = await supabase
        .schema('profiles')
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      const formattedData = {
        ...data,
        bio: data.bio ?? "" // Convert null bio to empty string
      };

      setProfile(formattedData);
      setEditForm(formattedData);
      setIsLoading(false);
    };

    fetchProfile();
  }, [params.username]);

  const handleSave = async () => {
    const supabase = createClient();
    const { error } = await supabase
      .schema('profiles')
      .from('profiles')
      .update({
        username: editForm.username,
        bio: editForm.bio,
        profile_image: editForm.profile_image
      })
      .eq('username', params.username);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    setProfile(editForm);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <MorphingMenu links={menuLinks} />
      <div className="relative flex flex-col items-center justify-center overflow-hidden h-screen">
        <div className="relative bottom-0" style={{ width: "70%", height: "80%" }}>
          <MagicCard title={`Profile - ${profile.username}`} className="relative py-6 flex flex-col items-center mx-auto">
            <div className="p-6 space-y-6 w-full">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profile_image} alt={profile.username} />
              <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {currentUser?.id === profile.id && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-2"
                >
                  {isEditing ? 'Annuler' : 'Modifier Profil'}
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pseudo</label>
                <Input
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image de Profil</label>
                <Input
                  value={editForm.profile_image}
                  onChange={(e) => setEditForm({ ...editForm, profile_image: e.target.value })}
                />
              </div>
              <Button onClick={handleSave}>Enregister les changements</Button>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg">{profile.bio}</p>
            </div>
          )}
        </div>
      </MagicCard>
    </div>
        <div className="absolute flex items-center w-full bottom-3">
          <DockWrapper />
        </div>
      </div>
    </div>
  );
}

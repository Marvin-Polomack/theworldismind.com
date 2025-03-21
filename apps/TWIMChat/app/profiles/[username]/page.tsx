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
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import Compressor from 'compressorjs';
import { useRealHeight } from '@/hooks/useRealHeight';
import { UserProfilePopover } from '@/components/Profile/UserProfilePopover';

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
  
  // Use the new hook with device-specific percentages
  const { height: mainContentHeight } = useRealHeight({
    smallPercentage: 75, // 75% for very small devices
    mediumSmallPercentage: 78, // 78% for medium-small devices
    regularPercentage: 80, // 80% for regular mobile
    desktopPercentage: 82, // 82% for desktop
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

  const handleAvatarClick = async () => {
    if (currentUser?.id !== profile?.id) return; // Only allow owner to change avatar
  
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      // Compress the image using Compressor.js
      new Compressor(file, {
        quality: 0.6, // Adjust quality as needed (0 to 1)
        success: async (compressedFile) => {
          const supabase = createClient();
  
          // Define a consistent file path for the avatar image
          const filePath = `${profile?.id}/avatar.jpg`;

          // Upload the compressed file with the upsert option to replace any existing file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, compressedFile, { upsert: true });
  
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return;
          }
  
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(uploadData.path);
  
          // Update profile with new image URL
          const { error: updateError } = await supabase
            .schema('profiles')
            .from('profiles')
            .update({ profile_image: publicUrl })
            .eq('id', profile?.id);
  
          if (updateError) {
            console.error('Error updating profile:', updateError);
            return;
          }
  
          // Update local state
          setProfile(prev => prev ? { ...prev, profile_image: publicUrl } : null);
          setEditForm(prev => ({ ...prev, profile_image: publicUrl }));
        },
        error(err) {
          console.error('Error compressing file:', err.message);
        }
      });
    };
  
    input.click();
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
    <div className="flex flex-col real-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center z-50 px-4 py-2">
        <div className="flex items-center">
          <MorphingMenu links={menuLinks} className="relative static" />
        </div>
        <div className="flex items-center">
          {currentUser && (
            <UserProfilePopover userProfile={currentUser} user={currentUser} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ height: mainContentHeight, maxHeight: mainContentHeight }}
      >
        <div className="w-full md:w-[90%] h-full max-h-full overflow-hidden flex flex-col">
          <MagicCard className="h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0 px-4 py-2">
              <div className="w-1/3 flex justify-start">
              </div>
              <div className="w-1/3 flex justify-center">
                {/* <h3 className="text-center text-l sm:text-2xl font-medium">
                  Profil de {profile.username}
                </h3> */}
              </div>
              <div className="w-1/3"></div>
            </div>

            <div className="flex-1 overflow-auto px-4">
              <div className="flex flex-col space-y-6 w-full">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={currentUser?.id === profile?.id ? { scale: 1.05 } : {}}
                    className="relative group cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.profile_image} alt={profile.username} />
                      <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    {currentUser?.id === profile?.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                      >
                        <Upload className="w-8 h-8 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  
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
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Pseudo</label>
                        <Input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({ ...editForm, username: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm({ ...editForm, bio: e.target.value })
                          }
                          rows={4}
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
              </div>
            </div>
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
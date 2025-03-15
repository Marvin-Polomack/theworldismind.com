'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";
import MagicCard from "@/components/ui/MagicCard";
import { Button } from "@/components/ui/misc/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/misc/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MorphingMenu } from "@/components/ui/misc/morphing-menu";
import { UserProfilePopover } from "@/components/Profile/UserProfilePopover";
import DockWrapper from "@/components/DockWrapper";
import Loading from '@/app/loading';
import { use100vh } from 'react-div-100vh';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/misc/avatar";
import { useRealHeight } from '@/hooks/useRealHeight';

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const menuLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "TWIM Chat" },
  ];

  // Use the new hook with device-specific percentages
  const { height: mainContentHeight } = useRealHeight({
    smallPercentage: 75, // 75% for very small devices
    mediumSmallPercentage: 78, // 78% for medium-small devices
    regularPercentage: 80, // 80% for regular mobile
    desktopPercentage: 82, // 82% for desktop
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
      const supabase = createClient();
        const currentUser = await getUser(supabase);
      
        if (!currentUser) {
          router.push("/signin?redirect=/settings");
        return;
      }

        const { data: profile } = await supabase
        .schema('profiles')
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        setUser(currentUser);
        setUserProfile(profile);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const supabase = createClient();
      
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      // Call the RPC function to delete user and profile
      const { error } = await supabase
        .schema('profiles')
        .rpc('delete_user_and_profile', { p_user_id: user.id });

      if (error) {
        throw error;
      }

      // Sign out the user after deletion
      await supabase.auth.signOut();
      toast.success("Votre compte a été supprimé avec succès");
      router.push('/');
      
    } catch (error: any) {
      toast.error("Erreur lors de la suppression du compte", {
        description: error.message
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col real-screen overflow-hidden">
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
                <h3 className="text-center text-l sm:text-2xl font-medium">
                  Paramètres
                </h3>
              </div>
              <div className="w-1/3"></div>
            </div>

            <div className="flex-1 overflow-auto px-4">
              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Danger Zone</h2>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          "Supprimer le compte"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Elle supprimera définitivement votre compte
                          et toutes les données associées de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer le compte
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

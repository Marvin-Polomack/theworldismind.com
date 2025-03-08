"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
  ModalProvider
} from "../ui/misc/animated-modal";
import { AnimatePresence, motion } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";
import { Input } from "@/components/ui/misc/input";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";

export function AnimatedModal() {
  function ModalWrapper() {
    const { setOpen, open } = useModal();
    const [username, setUsername] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");
    
  useEffect(() => {
      const hasVisitedChat = localStorage.getItem('hasVisitedChat');
      
      if (!hasVisitedChat) {
        setOpen(true);
        fetchUsername();
        localStorage.setItem('hasVisitedChat', 'true');
      }
    }, [setOpen]);

    const fetchUsername = async () => {
        const supabase = createClient();
        const user = await getUser(supabase);
        
        if (user) {
          const { data: profile } = await supabase
            .schema('profiles')
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
          if (profile?.username) {
            setCurrentUsername(profile.username);
            setUsername(profile.username);
          }
        }
      };

    const handleUsernameChange = async () => {
      if (!username.trim()) return;

      const supabase = createClient();
      const user = await getUser(supabase);
      
      if (user) {
        const { error } = await supabase
          .schema('profiles')
          .from('profiles')
          .update({ username: username })
          .eq('id', user.id);

        if (!error) {
          setOpen(false);
    }
      }
    };

  return (
      <AnimatePresence>
        {open && (
      <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 pointer-events-auto"
            />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <ModalBody className="pointer-events-auto">
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                  Bienvenue sur TWIM Chat! 👋
                <span className="block text-base mt-2">
                  Crée ton monde et alimente le en échangeant avec les autres!
                </span>
              </h4>
              <p className="text-center text-neutral-600 dark:text-neutral-100">
                Tu vas pouvoir choisir un sujet et échanger avec un autre Twimer
              </p>
                  <p className="text-center text-neutral-600 dark:text-neutral-100 mb-4">
                Mais d'abord, choisit ton nom dans ton monde
              </p>
              
                  {/* <ShineBorder
                    borderWidth={1}
                    color="#ada0ff"
                    className="w-full max-w-md mx-auto"
                  > */}
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={currentUsername || "Enter your username"}
                      className="w-full bg-transparent border-none focus:ring-0 placeholder-gray-400"
                    />
                  {/* </ShineBorder> */}
                </ModalContent>
                <ModalFooter className="gap-4">
                  <button 
            onClick={() => setOpen(false)}
                    className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
            >
                    Skip
            </button>
                  <button 
                    onClick={handleUsernameChange}
                    className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                  >
                    Continue
                  </button>
          </ModalFooter>
        </ModalBody>
    </div>
      </>
        )}
      </AnimatePresence>
  );
}

  return (
      <Modal>
        <ModalWrapper />
      </Modal>
  );
}

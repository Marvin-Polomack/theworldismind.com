'use client';

import { useChat } from "ai/react";
import { ChatContainer, ChatMessages, ChatForm } from "@/components/ui/Chat/AiChat/chat";
import { MessageList } from "@/components/ui/Chat/AiChat/message-list";
import { MessageInput } from "@/components/ui/Chat/AiChat/message-input";
import MagicCard from "@/components/ui/MagicCard";
import { useState, useEffect, useRef } from 'react'
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/utils/supabase/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/misc/avatar";
import { set } from "react-hook-form";
import { use100vh } from 'react-div-100vh';

type TypingStatus = {
  room_id: string
  user_id: string
  is_typing: boolean
}

type Message = {
  id: number;
  role: "sender" | "receiver";
  message: string;
  room_id: string;
  sender_id: string;
  created_at: Date;
};

export default function ChatInterface({ 
  topic_id,
  userId,
  otherUserId,
  roomId 
}: { 
  topic_id: string;
  userId: string;
  otherUserId: string;
  roomId: string 
}
) {
  const supabase = createClient()
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [topic, setTopic] = useState<any>(null);
  const [isMobile, setIsMobile] = useState<'small' | 'medium-small' | 'regular' | false>(false);
  
  const {
    input,
    handleInputChange,
    // we won't use the original handleSubmit
  } = useChat()

  // Get the real viewport height using the hook
  const viewportHeight = use100vh();
  
  // Check if the device is a mobile device based on screen width
  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      if (width < 376) { // iPhone SE and similar small devices
        setIsMobile('small');
      } 
      else if (width >= 376 && width < 391) { // Medium-small mobile devices
        setIsMobile('medium-small');
      }
      else if (width < 768) { // Regular mobile devices
        setIsMobile('regular');
      }
      else {
        setIsMobile(false);
      }
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Calculate viewport height percentage based on device type
  const heightPercentage = isMobile === 'small' ? 0.51 : // 45% for very small mobiles
                          isMobile === 'medium-small' ? 0.6 : // 60% for medium-small mobiles
                          isMobile === 'regular' ? 0.62 : // 65% for regular mobiles
                          0.67; // 70% for desktop
  const chatContainerHeight = viewportHeight ? `${viewportHeight * heightPercentage}px` : `${heightPercentage * 100}vh`;
  
  // Fetch initial messages
  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/${roomId}/messages`);
    const messages = await res.json();
    setChatMessages(messages);
  };
  
  useEffect(() => {
    const fetchProfiles = async () => {
      const supabase = createClient();
      const user = await getUser(supabase);

      const { data: dataUser, error: errorUser } = await supabase
        .schema('profiles')
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (errorUser) {
        console.error('Error fetching user profile:', errorUser);
        return;
      }
      setCurrentUser(dataUser);

      const { data: dataOtherUser, error } = await supabase
        .schema('profiles')
        .from('profiles')
        .select('*')
        .eq('id', otherUserId)
        .single();

      if (error) {
        console.error('Error fetching other user profile:', error);
        return;
      }
      setOtherUser(dataOtherUser);
      
      const { data: topic, error: topic_error } = await supabase
        .schema('chat')
        .from('topics')
        .select('*')
        .eq('id', topic_id)
        .single();

      if (topic_error) {
        console.error('Error fetching Topics:', topic_error);
        return;
      }
      setTopic(topic);
    };

    fetchProfiles();
  }, [userId, otherUserId]);

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  const handleTyping = async () => {
    await supabase
      .schema('chat')
      .from('room_members')
      .update({ is_typing: true })
      .eq('user_id', userId)
      .eq('room_id', roomId);
  
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    // Set a new timeout
    typingTimeoutRef.current = setTimeout(async () => {
      await supabase
        .schema('chat')
        .from('room_members')
        .update({ is_typing: false })
        .eq('user_id', userId)
        .eq('room_id', roomId);
    }, 3000);
  };
  
  // Clear the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Listen for typing status updates for the specific room and user
  useEffect(() => {
    console.log('Listening for typing status updates...');
    const channel = supabase
      .channel('typing-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'chat',
          table: 'room_members',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const updatedUser = payload.new as TypingStatus;
          // Manually filter updates
          if (updatedUser.room_id === roomId && updatedUser.user_id === otherUserId) {
            setTypingUsers((prev) => {
              const filteredUsers = prev.filter((u) => u.user_id !== updatedUser.user_id);
              return updatedUser.is_typing ? [...filteredUsers, updatedUser] : filteredUsers;
            });
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase, otherUserId]);

  // Listen for new messages in real time
  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'chat',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          const messageWithDate: Message = {
            ...newMessage,
            role: newMessage.sender_id === userId ? "sender" : "receiver",
            created_at: new Date(newMessage.created_at),
          };

          setChatMessages((current) => [...current, messageWithDate]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, supabase, userId]);

  // Custom handleSubmit to insert messages into Supabase
  const customHandleSubmit = async (event?: { preventDefault?: (() => void) | undefined }, options?: { experimental_attachments?: FileList }) => {
    event?.preventDefault?.();
    if (input.trim() === "") return;
    
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Update typing status to false immediately when sending a message
    await supabase
      .schema('chat')
      .from('room_members')
      .update({ is_typing: false })
      .eq('user_id', userId)
      .eq('room_id', roomId);
    
    const { error } = await supabase
      .schema('chat')
      .from('messages')
      .insert({
        message: input,
        room_id: roomId,
        sender_id: userId,
      });
    
    if (error) {
      console.error("Error sending message:", error);
    } else {
      // Clear the input field after sending the message
      handleInputChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  return (
    <MagicCard className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="w-1/3 flex justify-start pl-4">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={otherUser?.profile_image} 
              alt={otherUser?.username || 'User'} 
            />
            <AvatarFallback>
              {(otherUser?.username?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="w-1/3 flex justify-center">
          <h3 className="text-center text-l sm:text-2xl font-medium">
            {topic?.title}
          </h3>
        </div>
        <div className="w-1/3"></div>
      </div>

      <div className="flex flex-col min-h-0">
        <div 
          className="overflow-hidden" 
          style={{ minHeight: chatContainerHeight }}
        >
          <ChatMessages messages={chatMessages}>
            <MessageList 
              messages={chatMessages} 
              isTyping={typingUsers.length > 0} 
              currentUser={currentUser} 
              otherUser={otherUser}
            />
          </ChatMessages>
        </div>

        <div className="flex-shrink-0">
          <ChatForm
            className="pb-4 sm:pb-2"
            isPending={false}
            handleSubmit={customHandleSubmit}
          >
            {({ files, setFiles }) => (
              <MessageInput
                value={input}
                onChange={(e) => {
                  handleInputChange(e);
                  handleTyping();
                }}
                isGenerating={false}
              />
            )}
          </ChatForm>
        </div>
      </div>
    </MagicCard>
  );
}
'use client';

import { useChat } from "ai/react";
import { ChatContainer, ChatMessages, ChatForm } from "@/components/ui/Chat/AiChat/chat";
import { MessageList } from "@/components/ui/Chat/AiChat/message-list";
import { MessageInput } from "@/components/ui/Chat/AiChat/message-input";
import MagicCard from "@/components/ui/MagicCard";
import { useState, useEffect, useRef } from 'react'
import { createClient } from "@/utils/supabase/client";

type TypingStatus = {
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
  
  const {
    input,
    handleInputChange,
    // we won’t use the original handleSubmit
  } = useChat()

  // Fetch initial messages
  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/${roomId}/messages`);
    const messages = await res.json();
    setChatMessages(messages);
  };

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
    const channel = supabase
      .channel('typing-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'chat',
          table: 'room_members',
          filter: `room_id=eq.${roomId}&user_id=eq.${otherUserId}`,
        },
        (payload) => {
          const updatedUser = payload.new as TypingStatus;
  
          console.log('typing status updated', updatedUser)
          setTypingUsers((prev) => {
            const filteredUsers = prev.filter((u) => u.user_id !== updatedUser.user_id);
            const newTypingUsers = updatedUser.is_typing ? [...filteredUsers, updatedUser] : filteredUsers;
            console.log('New typing users inside updater:', newTypingUsers);
            return newTypingUsers;
          });
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, otherUserId]);

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
    <MagicCard
      title={`TWIM Chat`}
      className="relative py-6 flex flex-col items-center mx-auto overflow-hidden"
    >
      <ChatContainer className="relative flex flex-col w-full h-full">
        <ChatMessages messages={chatMessages}>
          <MessageList messages={chatMessages} isTyping={typingUsers.length > 0} />
        </ChatMessages>

        <ChatForm
          className="mt-auto"
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
      </ChatContainer>
    </MagicCard>
  );
}
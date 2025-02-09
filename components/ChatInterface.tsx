'use client';

import { useChat } from "ai/react";

import { ChatMessageList } from "@/components/ui/Chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/Chat/chat-bubble";
import { ChatInput } from "@/components/ui/Chat/chat-input";
import { useContext, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/Button/button";
import { Rnd } from "react-rnd";
import MagicCard from "@/components/ui/MagicCard";
import { DockContext } from "@/components/ChatContainer";
import { HiOutlinePaperClip } from "react-icons/hi";
import { FaArrowCircleUp } from "react-icons/fa";

export default function ChatInterface() {
  const { dockPosition } = useContext(DockContext)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
  } = useChat()

  const lastMessage = messages.at(-1)
  const isEmpty = messages.length === 0
  const isTyping = lastMessage?.role === "user"

  return (
  // <Rnd
  //   default={{
  //     x: dockPosition.x,
  //     y: dockPosition.y,
  //     width: "90%",
  //     height: "80%",
  //   }}
  //   minWidth={500}
  //   minHeight={190}
  //   bounds="parent"
  //   disableDragging={true}
  //   className="relative flex flex-col w-full h-full"
  //   enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
  // >
  <MagicCard
    title={`TWIM Chat`}
    className='relative py-6 flex flex-col items-center mx-auto'
  >
    <div className="relative flex flex-col" style={{ height: "92 %" }}>
    <ChatMessageList className="relative flex" >
      <ChatBubble variant='sent'>
        <ChatBubbleAvatar fallback='US' />
        <ChatBubbleMessage variant='sent'>
          Hello, how has your day been? I hope you are doing well.
        </ChatBubbleMessage>
      </ChatBubble>

      <ChatBubble variant='received'>
        <ChatBubbleAvatar fallback='AI' />
        <ChatBubbleMessage variant='received'>
          Hi, I am doing well, thank you for asking. How can I help you today?
        </ChatBubbleMessage>
      </ChatBubble>

      <ChatBubble variant='received'>
        <ChatBubbleAvatar fallback='AI' />
        <ChatBubbleMessage isLoading />
      </ChatBubble>
    </ChatMessageList>
    </div>
    <div className="relative flex flex-col h-1/6">
    <form
        className="relative w-full bottom-0 bg-background rounded-lg border focus-within:ring-1 focus-within:ring-ring"
      >
        <div className="relative bottom-0 flex p-3">
          <ChatInput
            placeholder="Type your message here..."
            className="w-full bg-background min-h-12 rounded-lg border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="absolute flex items-center right-3 top-3 p-3 space-x-2 pt-0">
            <Button variant="ghost" size="icon">
              <HiOutlinePaperClip />
            </Button>

            <Button
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <FaArrowCircleUp />
            </Button>
          </div>
        </div>
      </form>
      </div>
  </MagicCard>
  // </Rnd>
  );
}
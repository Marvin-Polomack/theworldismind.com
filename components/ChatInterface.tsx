'use client';

import { useChat } from "ai/react";

import { ChatContainer, ChatForm, ChatMessages } from "@/components/ui/Chat/AiChat/chat";
import { MessageInput } from "@/components/ui/Chat/AiChat/message-input";
import { MessageList } from "@/components/ui/Chat/AiChat/message-list";
import { useContext, useEffect, useRef } from 'react';
import useSocket from '@/components/hooks/use-socket';
import { useRouter } from "next/navigation";
import { Rnd } from "react-rnd";
import MagicCard from "@/components/ui/MagicCard";
import { is } from "date-fns/locale";
import { DockContext } from "@/components/ChatContainer";

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
  <Rnd
    default={{
      x: dockPosition.x,
      y: dockPosition.y,
      width: "90%",
      height: "80%",
    }}
    minWidth={500}
    minHeight={190}
    bounds="parent"
    disableDragging={true}
    className="flex flex-col w-full h-full justify-between"
  >
  <MagicCard
    title={`TWIM Chat`}
    className='py-6 flex flex-col items-center justify-center'
  >
  <ChatContainer className="flex flex-col h-full w-full">
    
    {!isEmpty ? (
      <ChatMessages>
        <MessageList messages={messages} isTyping={isTyping} />
      </ChatMessages>
    ) : null}

    <ChatForm
      className="flex mt-auto"
      isPending={isLoading || isTyping}
      handleSubmit={handleSubmit}
    >
      {({ files, setFiles }) => (
        <MessageInput
          value={input}
          onChange={handleInputChange}
          allowAttachments
          files={files}
          setFiles={setFiles}
          stop={stop}
          isGenerating={isLoading}
          className="flex w-full"
        />
      )}
    </ChatForm>
  </ChatContainer>
  </MagicCard>
  </Rnd>
  );
}
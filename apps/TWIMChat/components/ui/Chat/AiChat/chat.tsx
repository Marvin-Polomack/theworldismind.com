"use client"

import { forwardRef, useCallback, useState, type ReactElement, useEffect } from "react"
import { ArrowDown, ThumbsDown, ThumbsUp } from "lucide-react"
import { use100vh } from 'react-div-100vh'

import { cn } from "@/utils/cn"
import { useAutoScroll } from "@/hooks/use-auto-scroll"
import { Button } from "@/components/ui/misc/button"
import { type Message } from "@/components/ui/Chat/AiChat/chat-message"
import { CopyButton } from "@/components/ui/misc/copy-button"
import { MessageInput } from "@/components/ui/Chat/AiChat/message-input"
import { MessageList } from "@/components/ui/Chat/AiChat/message-list"
import { PromptSuggestions } from "@/components/ui/misc/prompt-suggestions"

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void
  messages: Array<Message>
  input: string
  className?: string
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>
  isGenerating: boolean
  stop?: () => void
  onRateResponse?: (
    messageId: string,
    rating: "thumbs-up" | "thumbs-down"
  ) => void
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never
  suggestions?: never
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: "user"; content: string }) => void
  suggestions: string[]
}

type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
}: ChatProps) {
  const lastMessage = messages.at(-1)
  const isEmpty = messages.length === 0
  const isTyping = lastMessage?.role === "receiver"

  const messageOptions = useCallback(
    (message: Message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton
              content={message.message}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id.toString(), "thumbs-up")}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id.toString(), "thumbs-down")}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.message}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    [onRateResponse]
  )

  return (
    <ChatContainer className={cn(className, "flex flex-col h-full")}>
      {isEmpty && append && suggestions ? (
        <PromptSuggestions
          label="Try these prompts ✨"
          append={append}
          suggestions={suggestions}
        />
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={messageOptions}
          />
        </ChatMessages>
      ) : null}

      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
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
            isGenerating={isGenerating}
          />
        )}
      </ChatForm>
    </ChatContainer>
  )
}
Chat.displayName = "Chat"

export function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: Message[]
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages])
  
  // Get the real viewport height using the hook
  const viewportHeight = use100vh();
  
  // State to track device size
  const [deviceSize, setDeviceSize] = useState<'small' | 'medium-small' | 'regular' | 'desktop'>('desktop');
  
  // Check device size based on screen width
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      if (width < 376) { // iPhone SE and similar small devices
        setDeviceSize('small');
      } 
      else if (width >= 376 && width < 391) { // Medium-small mobile devices
        setDeviceSize('medium-small');
      }
      else if (width < 768) { // Regular mobile devices
        setDeviceSize('regular');
      }
      else {
        setDeviceSize('desktop');
      }
    };
    
    // Check on initial load
    checkDeviceSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceSize);
  }, []);
  
  // Calculate viewport height percentage based on device type
  const heightPercentage = deviceSize === 'small' ? 0.51 : // 51% for very small mobiles
                          deviceSize === 'medium-small' ? 0.62 : // 60% for medium-small mobiles
                          deviceSize === 'regular' ? 0.62 : // 65% for regular mobiles
                          0.67; // 70% for desktop
  
  // Calculate the max height using the real viewport height
  const maxHeight = viewportHeight ? `${viewportHeight * heightPercentage}px` : `${heightPercentage * 100}vh`;

  return (
    <div
      className="relative flex flex-col overflow-y-auto h-full"
      style={{ 
        minHeight: maxHeight,
        maxHeight: maxHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      {children}
      
      {!shouldAutoScroll && (
        <div className="sticky bottom-6 left-0 flex w-full justify-center pointer-events-none">
          <Button
            onClick={scrollToBottom}
            className="h-10 w-10 rounded-full border shadow-md bg-background ease-in-out animate-in fade-in-0 slide-in-from-bottom-1 z-10 pointer-events-auto"
            size="icon"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col w-full h-full justify-end", className)}
      {...props}
    />
  )
})
ChatContainer.displayName = "ChatContainer"

interface ChatFormProps {
  className?: string
  isPending: boolean
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void
  children: (props: {
    files: File[] | null
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>
  }) => ReactElement
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, isPending, className }, ref) => {
    const [files, setFiles] = useState<File[] | null>(null)

    const onSubmit = (event: React.FormEvent) => {
      if (!files) {
        handleSubmit(event)
        return
      }

      const fileList = createFileList(files)
      handleSubmit(event, { experimental_attachments: fileList })
      setFiles(null)
    }

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children({ files, setFiles })}
      </form>
    )
  }
)
ChatForm.displayName = "ChatForm"

function createFileList(files: File[] | FileList): FileList {
  const dataTransfer = new DataTransfer()
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file)
  }
  return dataTransfer.files
}

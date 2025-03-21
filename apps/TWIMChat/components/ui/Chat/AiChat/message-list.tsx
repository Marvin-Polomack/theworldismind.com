import { Message } from "./chat-message"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/misc/avatar"
import { TypingIndicator } from "./typing-indicator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/misc/popover"
import { Button } from "@/components/ui/misc/button"
import { User, Mail, MapPin, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface MessageListProps {
  messages: Message[]
  isTyping?: boolean
  messageOptions?: (message: Message) => { actions: React.ReactNode }
  currentUser?: any
  otherUser?: any
}

export function MessageList({ 
  messages, 
  isTyping, 
  messageOptions,
  currentUser,
  otherUser 
}: MessageListProps) {
  const router = useRouter()

  const UserAvatar = ({ user, isSender }: { user: any; isSender: boolean }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.profile_image} 
              alt={user?.username || user?.email} 
            />
            <AvatarFallback>
              {(user?.username?.[0] || user?.email?.[0] || '?').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80" 
        align={isSender ? "end" : "start"}
        side="top"
      >
        <div className="flex flex-col space-y-4">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={user?.profile_image} 
                alt={user?.username || user?.email} 
              />
              <AvatarFallback className="text-lg">
                {(user?.username?.[0] || user?.email?.[0] || '?').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="font-semibold">{user?.username || "Anonymous"}</h4>
              <p className="text-sm text-muted-foreground">{user?.bio || "No bio available"}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            {user?.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {user.location}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/profiles/${user?.username || user?.id}`)}
            >
              <User className="mr-2 h-4 w-4" />
              Profil
            </Button>
            {/* {!isSender && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push(`/chat/dm/${user?.id}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            )} */}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="space-y-6 px-4">
      {messages.map((message) => {
        const isSender = message.role === "sender"
        const user = isSender ? currentUser : otherUser
        
        return (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              isSender ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <UserAvatar user={user} isSender={isSender} />
            
            <div
              className={`group relative flex w-full flex-col ${
                isSender ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-lg px-3 py-2 ${
                    isSender
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.message}
                </div>
                {messageOptions && (
                  <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                    {messageOptions(message).actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {isTyping && (
        <div className="flex items-center gap-4">
          <UserAvatar user={otherUser} isSender={false} />
          <TypingIndicator />
        </div>
      )}
    </div>
  )
}

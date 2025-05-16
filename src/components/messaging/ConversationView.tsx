
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Send, 
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Trash2
} from "lucide-react";
import { 
  findUserById, 
  getMessagesForUser, 
  Message, 
  formatTimestamp
} from "@/data/messages";
import { cn } from "@/lib/utils";

interface ConversationViewProps {
  userId: string;
  onBack?: () => void;
}

const ConversationView = ({ userId, onBack }: ConversationViewProps) => {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = findUserById(userId);
  
  useEffect(() => {
    // Load messages for this conversation
    setMessages(getMessagesForUser(userId));
  }, [userId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: 'user1',
      receiverId: userId,
      content: newMessage,
      timestamp: formatTimestamp(now),
      isRead: false,
      type: 'text',
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality would go here",
    });
  };

  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality would go here",
    });
  };

  const handleRecordVoice = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Voice Recording Stopped" : "Voice Recording Started",
      description: "Voice recording functionality would go here",
    });
  };

  const handleEmojiPicker = () => {
    toast({
      title: "Emoji Picker",
      description: "Emoji picker would open here",
    });
  };

  const handleDeleteConversation = () => {
    toast({
      title: "Delete Conversation",
      description: "This conversation would be deleted",
    });
  };
  
  if (!user) {
    return <div className="p-4">User not found</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="font-medium text-base">{user.name}</h2>
            {user.isOnline && (
              <p className="text-xs text-green-500">Online</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteConversation} className="text-red-500">
                Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSentByMe={message.senderId === 'user1'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleFileUpload}>
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleImageUpload}>
            <ImageIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <div className="flex-1 flex items-center rounded-full border border-gray-300 bg-white px-3 py-2">
            <Input
              className="flex-1 border-0 focus-visible:ring-0 text-sm p-0"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="ghost" size="icon" onClick={handleEmojiPicker}>
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              variant="ghost" 
              size="icon" 
              onClick={handleRecordVoice}
              className={isRecording ? "text-red-500" : ""}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            className="rounded-full" 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  isSentByMe: boolean;
}

const MessageBubble = ({ message, isSentByMe }: MessageBubbleProps) => {
  return (
    <div className={cn(
      "flex",
      isSentByMe ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] p-3 rounded-lg",
        isSentByMe 
          ? "bg-message-sent text-message-sentText rounded-br-none" 
          : "bg-message-received text-message-receivedText rounded-bl-none"
      )}>
        {message.content}
        <div className={cn(
          "text-xs mt-1",
          isSentByMe ? "text-pink-100" : "text-gray-500"
        )}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default ConversationView;

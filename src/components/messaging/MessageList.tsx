
import { useState } from "react";
import { Link } from "react-router-dom";
import { Conversation, User, findUserById, users } from "@/data/messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const MessageList = ({ 
  conversations, 
  activeConversationId,
  searchTerm,
  onSearchChange
}: MessageListProps) => {
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    const user = findUserById(conversation.participants.find(id => id !== 'user1') || '');
    return user && user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Messages</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNewMessageDialog(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">New message</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Message settings</DropdownMenuItem>
              <DropdownMenuItem>Message requests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowNewMessageDialog(true)}>
                New message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-9 bg-gray-100 border-none"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            const otherUserId = conversation.participants.find(id => id !== 'user1') || '';
            const user = findUserById(otherUserId);
            
            if (!user) return null;
            
            return (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                user={user}
                isActive={conversation.id === activeConversationId}
              />
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        )}
      </div>
      
      {showNewMessageDialog && (
        <NewMessageDialog 
          users={users.filter(u => u.id !== 'user1')} 
          onClose={() => setShowNewMessageDialog(false)} 
        />
      )}
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  user: User;
  isActive: boolean;
}

const ConversationItem = ({ conversation, user, isActive }: ConversationItemProps) => {
  const { lastMessage } = conversation;
  
  return (
    <Link 
      to={`/messages/${conversation.id}`}
      className={cn(
        "flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
        isActive && "bg-gray-50"
      )}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
          <span className="text-xs text-gray-500">{lastMessage.timestamp}</span>
        </div>
        <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>
      </div>
    </Link>
  );
};

interface NewMessageDialogProps {
  users: User[];
  onClose: () => void;
}

const NewMessageDialog = ({ users, onClose }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Message</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <Link
              key={user.id}
              to={`/messages/${user.id}`}
              onClick={onClose}
              className="flex items-center p-4 hover:bg-gray-50"
            >
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="font-medium">{user.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageList;

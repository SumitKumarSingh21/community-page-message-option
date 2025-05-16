
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MessageList from "@/components/messaging/MessageList";
import ConversationView from "@/components/messaging/ConversationView";
import { conversations, findUserById, users } from "@/data/messages";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  
  const activeUser = userId ? findUserById(userId) : null;
  
  const goBack = () => {
    navigate("/messages");
  };

  if (isMobile && userId) {
    return (
      <div className="h-screen bg-white flex flex-col">
        <ConversationView 
          userId={userId} 
          onBack={goBack}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex">
      <div className={`${userId && isMobile ? 'hidden' : 'flex flex-col'} border-r border-gray-200 w-full sm:w-80 md:w-96`}>
        <MessageList 
          conversations={conversations} 
          activeConversationId={userId}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
      
      {userId ? (
        <div className="flex-1 h-full">
          <ConversationView 
            userId={userId} 
            onBack={isMobile ? goBack : undefined}
          />
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-semibold mb-2">Select a conversation</h2>
            <p className="text-gray-500">Choose a conversation from the list or start a new one.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

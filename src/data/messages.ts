
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
}

// Mock users
export const users: User[] = [
  {
    id: 'user1',
    name: 'Current User',
    avatar: '/placeholder.svg',
    isOnline: true,
  },
  {
    id: 'emma_wilson',
    name: 'emma_wilson',
    avatar: '/placeholder.svg',
    isOnline: true,
  },
  {
    id: 'liam_johnson',
    name: 'liam_johnson',
    avatar: '/placeholder.svg',
    isOnline: false,
  },
  {
    id: 'olivia_smith',
    name: 'olivia_smith',
    avatar: '/placeholder.svg',
    isOnline: true,
  },
  {
    id: 'noah_williams',
    name: 'noah_williams',
    avatar: '/placeholder.svg',
    isOnline: true,
  },
  {
    id: 'sophia_brown',
    name: 'sophia_brown',
    avatar: '/placeholder.svg',
    isOnline: false,
  },
];

// Mock messages
export const mockMessages: Record<string, Message[]> = {
  'emma_wilson': [
    {
      id: 'm1',
      senderId: 'emma_wilson',
      receiverId: 'user1',
      content: 'Hey, how\'s it going?',
      timestamp: '10:31 AM',
      isRead: true,
      type: 'text',
    },
    {
      id: 'm2',
      senderId: 'emma_wilson',
      receiverId: 'user1',
      content: 'How\'s your day going?',
      timestamp: '10:32 AM',
      isRead: true,
      type: 'text',
    },
    {
      id: 'm3',
      senderId: 'user1',
      receiverId: 'emma_wilson',
      content: 'Pretty good! Working on some new designs.',
      timestamp: '10:33 AM',
      isRead: true,
      type: 'text',
    },
    {
      id: 'm4',
      senderId: 'emma_wilson',
      receiverId: 'user1',
      content: 'That sounds awesome! Can\'t wait to see them.',
      timestamp: '10:35 AM',
      isRead: true,
      type: 'text',
    },
    {
      id: 'm5',
      senderId: 'user1',
      receiverId: 'emma_wilson',
      content: 'I\'ll share them with you once I\'m done!',
      timestamp: '10:36 AM',
      isRead: true,
      type: 'text',
    },
    {
      id: 'm6',
      senderId: 'emma_wilson',
      receiverId: 'user1',
      content: 'Hey, how\'s it going?',
      timestamp: '11:42 AM',
      isRead: false,
      type: 'text',
    },
  ],
  'liam_johnson': [
    {
      id: 'm7',
      senderId: 'liam_johnson',
      receiverId: 'user1',
      content: 'Did you see that new movie?',
      timestamp: '1h ago',
      isRead: false,
      type: 'text',
    },
  ],
  'olivia_smith': [
    {
      id: 'm8',
      senderId: 'olivia_smith',
      receiverId: 'user1',
      content: 'Let\'s meet up this weekend!',
      timestamp: '3h ago',
      isRead: true,
      type: 'text',
    },
  ],
  'noah_williams': [
    {
      id: 'm9',
      senderId: 'noah_williams',
      receiverId: 'user1',
      content: 'The project is looking great!',
      timestamp: '5h ago',
      isRead: true,
      type: 'text',
    },
  ],
  'sophia_brown': [
    {
      id: 'm10',
      senderId: 'sophia_brown',
      receiverId: 'user1',
      content: 'Thanks for the help!',
      timestamp: '1d ago',
      isRead: true,
      type: 'text',
    },
  ],
};

// Generate conversations from messages
export const conversations: Conversation[] = Object.entries(mockMessages).map(([userId, messages]) => {
  const lastMessage = messages[messages.length - 1];
  return {
    id: userId,
    participants: [userId, 'user1'],
    lastMessage,
  };
});

// Helper function to find user by ID
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to find conversation by user ID
export const findConversationByUserId = (userId: string): Conversation | undefined => {
  return conversations.find(conversation => conversation.participants.includes(userId));
};

// Helper function to get messages for a conversation
export const getMessagesForUser = (userId: string): Message[] => {
  return mockMessages[userId] || [];
};

// Helper function to format timestamp
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

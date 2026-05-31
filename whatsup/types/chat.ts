export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  isOnline: boolean;
  about?: string;
  lastSeen?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  isRead: boolean;
  type?: 'text' | 'image' | 'voice' | 'document';
  mediaUrl?: string;
  duration?: number; // voice note duration in seconds
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: { emoji: string; userId: string }[];
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  groupMembers?: User[];
  isMuted?: boolean;
  isPinned?: boolean;
}

export interface Status {
  id: string;
  user: User;
  content: string; // image URL or text
  type: 'image' | 'text';
  backgroundColor?: string;
  timestamp: string;
  viewers: string[];
  expiresAt: string;
}
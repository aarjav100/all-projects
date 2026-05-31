import { User } from "@/types/chat";

export const currentUser: User = {
  id: "current-user",
  name: "Me",
  phoneNumber: "+1 (555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  isOnline: true,
  isContact: true,
};

export const grokUser: User = {
  id: "grok-ai",
  name: "Grok AI",
  phoneNumber: "+1 (AI) GROK-AI",
  avatar: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  isOnline: true,
  isContact: true,
};

export const users: User[] = [
  grokUser,
  {
    id: "user1",
    name: "John Smith",
    phoneNumber: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: true,
    isContact: true,
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    phoneNumber: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: false,
    lastSeen: "Today at 10:30 AM",
    isContact: true,
  },
  {
    id: "user3",
    name: "Michael Brown",
    phoneNumber: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: true,
    isContact: true,
  },
  {
    id: "user4",
    name: "Emily Davis",
    phoneNumber: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: false,
    lastSeen: "Yesterday at 8:15 PM",
    isContact: true,
  },
  {
    id: "user5",
    name: "David Wilson",
    phoneNumber: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: true,
    isContact: true,
  },
  {
    id: "user6",
    name: "Jessica Taylor",
    phoneNumber: "+1 (555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: false,
    lastSeen: "Yesterday at 11:45 AM",
    isContact: true,
  },
  {
    id: "user7",
    name: "Work Team",
    phoneNumber: "+1 (555) 890-1234",
    avatar: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: true,
    isContact: true,
  },
  {
    id: "user8",
    name: "Family Group",
    phoneNumber: "+1 (555) 901-2345",
    avatar: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isOnline: true,
    isContact: true,
  },
];
import { Phone, PhoneOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/types/database';

interface IncomingCallOverlayProps {
  callerProfile: Profile;
  callType: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCallOverlay({
  callerProfile,
  callType,
  onAccept,
  onDecline,
}: IncomingCallOverlayProps) {
  const initials = callerProfile.display_name
    ? callerProfile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : callerProfile.username.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[99] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Pulsing ring effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        <Avatar className="w-32 h-32 ring-4 ring-primary/30 relative z-10">
          <AvatarImage src={callerProfile.avatar_url || undefined} />
          <AvatarFallback className="gradient-primary text-primary-foreground text-4xl">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <h2 className="text-2xl font-bold mb-1">
        {callerProfile.display_name || callerProfile.username}
      </h2>
      <p className="text-muted-foreground mb-2">@{callerProfile.username}</p>
      
      <div className="flex items-center gap-2 text-muted-foreground mb-8">
        {callType === 'video' ? (
          <>
            <Video className="w-5 h-5" />
            <span>Incoming video call...</span>
          </>
        ) : (
          <>
            <Phone className="w-5 h-5" />
            <span>Incoming voice call...</span>
          </>
        )}
      </div>

      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={onDecline}
            variant="destructive"
            size="lg"
            className="w-16 h-16 rounded-full"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>
          <span className="text-sm text-muted-foreground">Decline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={onAccept}
            size="lg"
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
          >
            <Phone className="w-7 h-7" />
          </Button>
          <span className="text-sm text-muted-foreground">Accept</span>
        </div>
      </div>
    </div>
  );
}

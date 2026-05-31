import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X, Monitor, MonitorOff, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/types/database';
import { useWebRTC } from '@/hooks/useWebRTC';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoCallProps {
  partner: Profile;
  isIncoming?: boolean;
  incomingCall?: {
    id: string;
    caller_id: string;
    receiver_id: string;
    status: string;
    call_type: string;
    offer: RTCSessionDescriptionInit | null;
    answer: RTCSessionDescriptionInit | null;
  };
  callType?: 'video' | 'audio';
  onEnd: () => void;
}

export default function VideoCall({ 
  partner, 
  isIncoming = false, 
  incomingCall,
  callType = 'video',
  onEnd 
}: VideoCallProps) {
  const [status, setStatus] = useState<string>(isIncoming ? 'ringing' : 'connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [isPiPMode, setIsPiPMode] = useState(false);
  const [pipPosition, setPipPosition] = useState({ x: 16, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pipRef = useRef<HTMLDivElement>(null);

  const initials = partner.display_name
    ? partner.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : partner.username.slice(0, 2).toUpperCase();

  const handleRemoteStream = useCallback((stream: MediaStream) => {
    console.log('[VideoCall] Received remote stream');
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  }, []);

  const handleStatusChange = useCallback((newStatus: string) => {
    console.log('[VideoCall] Status changed:', newStatus);
    setStatus(newStatus);
    if (newStatus === 'ended') {
      onEnd();
    }
  }, [onEnd]);

  const handleError = useCallback((error: string) => {
    console.error('[VideoCall] Error:', error);
    toast.error(error);
  }, []);

  const { 
    startCall, 
    answerCall, 
    endCall, 
    rejectCall, 
    isScreenSharing,
    toggleScreenShare 
  } = useWebRTC({
    partnerId: partner.user_id,
    onRemoteStream: handleRemoteStream,
    onCallStatusChange: handleStatusChange,
    onError: handleError,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!isIncoming) {
        const result = await startCall(callType);
        if (result?.stream) {
          localStreamRef.current = result.stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = result.stream;
          }
        }
      }
    };

    initCall();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isIncoming, startCall, callType]);

  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  // Dragging logic for PiP window
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPiPMode) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pipPosition.x,
      initialY: pipPosition.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isPiPMode) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: pipPosition.x,
      initialY: pipPosition.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 260, dragRef.current.initialY + deltaY));
      setPipPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;
      const newX = Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 260, dragRef.current.initialY + deltaY));
      setPipPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;
    
    setStatus('connecting');
    const stream = await answerCall(incomingCall);
    if (stream) {
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }
  };

  const handleDeclineCall = async () => {
    if (incomingCall) {
      await rejectCall(incomingCall.id);
    }
    onEnd();
  };

  const handleEndCall = async () => {
    await endCall();
    onEnd();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const handleToggleScreenShare = async () => {
    const success = await toggleScreenShare();
    if (success !== undefined) {
      setIsSharing(!isSharing);
      if (!isSharing) {
        toast.success('Screen sharing started');
      } else {
        toast.info('Screen sharing stopped');
      }
    }
  };

  const togglePiPMode = () => {
    setIsPiPMode(!isPiPMode);
    if (!isPiPMode) {
      toast.info('Picture-in-Picture mode enabled');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Picture-in-Picture Mode
  if (isPiPMode && status === 'connected') {
    return (
      <div
        ref={pipRef}
        className="fixed z-[100] rounded-2xl overflow-hidden shadow-2xl border-2 border-border bg-background cursor-move select-none"
        style={{
          left: pipPosition.x,
          top: pipPosition.y,
          width: 180,
          height: 260,
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Video preview */}
        <div className="relative w-full h-[160px] bg-muted">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
              <AvatarImage src={partner.avatar_url || undefined} />
              <AvatarFallback className="gradient-primary text-primary-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Expand button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              togglePiPMode();
            }}
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 hover:bg-background"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          {/* Duration badge */}
          <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded-full text-xs font-medium">
            {formatDuration(callDuration)}
          </div>
        </div>

        {/* Mini controls */}
        <div className="flex items-center justify-center gap-2 p-3 bg-background">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            variant={isMuted ? 'destructive' : 'outline'}
            size="icon"
            className="w-10 h-10 rounded-full"
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleVideo();
            }}
            variant={!isVideoOn ? 'destructive' : 'outline'}
            size="icon"
            className="w-10 h-10 rounded-full"
          >
            {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEndCall();
            }}
            variant="destructive"
            size="icon"
            className="w-10 h-10 rounded-full"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>

        {/* Partner name */}
        <div className="absolute bottom-[60px] left-0 right-0 text-center">
          <p className="text-xs font-medium text-white drop-shadow-lg truncate px-2">
            {partner.display_name || partner.username}
          </p>
        </div>
      </div>
    );
  }

  // Full Screen Mode
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 safe-area-top">
        <Button variant="ghost" size="icon" onClick={handleEndCall}>
          <X className="w-6 h-6" />
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {status === 'ringing' && (isIncoming ? 'Incoming call...' : 'Calling...')}
            {status === 'connecting' && 'Connecting...'}
            {status === 'connected' && formatDuration(callDuration)}
          </p>
        </div>
        {status === 'connected' ? (
          <Button variant="ghost" size="icon" onClick={togglePiPMode}>
            <Minimize2 className="w-6 h-6" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Remote video / Avatar */}
        <div className="relative w-full h-full flex items-center justify-center">
          {status === 'connected' ? (
            <div className="relative w-full h-full bg-muted">
              {/* Remote video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Fallback avatar if no remote video */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                  <AvatarImage src={partner.avatar_url || undefined} />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-4xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Local video preview */}
              {isVideoOn && (
                <div className="absolute bottom-4 right-4 w-32 h-44 rounded-xl overflow-hidden shadow-lg border-2 border-border">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 ring-4 ring-primary/20 mb-6">
                <AvatarImage src={partner.avatar_url || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground text-4xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">
                {partner.display_name || partner.username}
              </h2>
              <p className="text-muted-foreground">@{partner.username}</p>
              
              {status === 'connecting' && (
                <div className="mt-4 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 safe-area-bottom">
        {status === 'ringing' && isIncoming ? (
          <div className="flex justify-center gap-8">
            <Button
              onClick={handleDeclineCall}
              variant="destructive"
              size="lg"
              className="w-16 h-16 rounded-full"
            >
              <PhoneOff className="w-7 h-7" />
            </Button>
            <Button
              onClick={handleAcceptCall}
              size="lg"
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
            >
              <Phone className="w-7 h-7" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-3">
            <Button
              onClick={toggleMute}
              variant={isMuted ? 'destructive' : 'outline'}
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button
              onClick={toggleVideo}
              variant={!isVideoOn ? 'destructive' : 'outline'}
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
            <Button
              onClick={handleToggleScreenShare}
              variant={isScreenSharing ? 'default' : 'outline'}
              size="lg"
              className={cn(
                "w-14 h-14 rounded-full",
                isScreenSharing && "bg-green-500 hover:bg-green-600"
              )}
              disabled={status !== 'connected'}
            >
              {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </Button>
            <Button
              onClick={togglePiPMode}
              variant="outline"
              size="lg"
              className="w-14 h-14 rounded-full"
              disabled={status !== 'connected'}
            >
              <Minimize2 className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleEndCall}
              variant="destructive"
              size="lg"
              className="w-14 h-14 rounded-full"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Screen sharing indicator */}
      {isScreenSharing && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-pulse">
          <Monitor className="w-4 h-4" />
          Sharing your screen
        </div>
      )}
    </div>
  );
}

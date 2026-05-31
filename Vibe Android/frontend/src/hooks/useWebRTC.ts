import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CallData {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: string;
  call_type: string;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
}

interface UseWebRTCProps {
  partnerId: string;
  onRemoteStream: (stream: MediaStream) => void;
  onCallStatusChange: (status: string) => void;
  onError: (error: string) => void;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export function useWebRTC({ partnerId, onRemoteStream, onCallStatusChange, onError }: UseWebRTCProps) {
  const { user } = useAuth();
  const [callId, setCallId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const originalVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = useCallback(() => {
    console.log('[WebRTC] Creating peer connection');
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    
    pc.onicecandidate = async (event) => {
      if (event.candidate && callId && user) {
        console.log('[WebRTC] Sending ICE candidate');
        await supabase.from('ice_candidates').insert({
          call_id: callId,
          sender_id: user.id,
          candidate: JSON.parse(JSON.stringify(event.candidate.toJSON())),
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track');
      if (event.streams[0]) {
        onRemoteStream(event.streams[0]);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected') {
        setIsConnected(true);
        onCallStatusChange('connected');
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        onCallStatusChange('ended');
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [callId, user, onRemoteStream, onCallStatusChange]);

  const getLocalStream = useCallback(async (video: boolean = true) => {
    try {
      console.log('[WebRTC] Getting local stream, video:', video);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('[WebRTC] Error getting local stream:', error);
      // Fall back to audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = audioStream;
        return audioStream;
      } catch (audioError) {
        onError('Could not access microphone');
        return null;
      }
    }
  }, [onError]);

  const startCall = useCallback(async (callType: 'video' | 'audio' = 'video') => {
    if (!user) {
      onError('Not authenticated');
      return null;
    }

    console.log('[WebRTC] Starting call to:', partnerId);
    onCallStatusChange('connecting');

    // Get local stream
    const stream = await getLocalStream(callType === 'video');
    if (!stream) return null;

    // Create call record
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        caller_id: user.id,
        receiver_id: partnerId,
        call_type: callType,
        status: 'ringing',
      })
      .select()
      .single();

    if (callError || !callData) {
      console.error('[WebRTC] Error creating call:', callError);
      onError('Failed to create call');
      return null;
    }

    setCallId(callData.id);
    console.log('[WebRTC] Call created:', callData.id);

    // Create peer connection and add tracks
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    console.log('[WebRTC] Sending offer');
    await supabase
      .from('calls')
      .update({ offer: JSON.parse(JSON.stringify(offer)) })
      .eq('id', callData.id);

    return { callId: callData.id, stream };
  }, [user, partnerId, createPeerConnection, getLocalStream, onCallStatusChange, onError]);

  const answerCall = useCallback(async (call: CallData) => {
    if (!user) {
      onError('Not authenticated');
      return null;
    }

    console.log('[WebRTC] Answering call:', call.id);
    setCallId(call.id);
    onCallStatusChange('connecting');

    // Get local stream
    const stream = await getLocalStream(call.call_type === 'video');
    if (!stream) return null;

    // Create peer connection
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    // Set remote description (offer)
    if (call.offer) {
      await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
    }

    // Apply any pending ICE candidates
    for (const candidate of pendingCandidatesRef.current) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
    pendingCandidatesRef.current = [];

    // Create and send answer
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    console.log('[WebRTC] Sending answer');
    await supabase
      .from('calls')
      .update({ 
        answer: JSON.parse(JSON.stringify(answer)),
        status: 'accepted',
        started_at: new Date().toISOString(),
      })
      .eq('id', call.id);

    return stream;
  }, [user, createPeerConnection, getLocalStream, onCallStatusChange, onError]);

  const endCall = useCallback(async () => {
    console.log('[WebRTC] Ending call');
    
    // Stop screen sharing if active
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Update call status
    if (callId) {
      await supabase
        .from('calls')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString(),
        })
        .eq('id', callId);
    }

    setCallId(null);
    setIsConnected(false);
    setIsScreenSharing(false);
    onCallStatusChange('ended');
  }, [callId, onCallStatusChange]);

  const startScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current || !localStreamRef.current) {
      console.error('[WebRTC] No peer connection or local stream');
      return false;
    }

    try {
      console.log('[WebRTC] Starting screen share');
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];

      // Store original video track
      const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender && sender.track) {
        originalVideoTrackRef.current = sender.track;
        await sender.replaceTrack(screenTrack);
      }

      // Handle when user stops sharing via browser UI
      screenTrack.onended = () => {
        console.log('[WebRTC] Screen share ended by user');
        stopScreenShare();
      };

      setIsScreenSharing(true);
      return true;
    } catch (error) {
      console.error('[WebRTC] Error starting screen share:', error);
      return false;
    }
  }, []);

  const stopScreenShare = useCallback(async () => {
    if (!peerConnectionRef.current || !screenStreamRef.current) {
      return;
    }

    try {
      console.log('[WebRTC] Stopping screen share');
      
      // Stop screen stream tracks
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;

      // Restore original video track
      if (originalVideoTrackRef.current) {
        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          await sender.replaceTrack(originalVideoTrackRef.current);
        }
        originalVideoTrackRef.current = null;
      }

      setIsScreenSharing(false);
    } catch (error) {
      console.error('[WebRTC] Error stopping screen share:', error);
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      await startScreenShare();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  const rejectCall = useCallback(async (callIdToReject: string) => {
    console.log('[WebRTC] Rejecting call:', callIdToReject);
    await supabase
      .from('calls')
      .update({ status: 'rejected' })
      .eq('id', callIdToReject);
  }, []);

  // Listen for call updates
  useEffect(() => {
    if (!callId) return;

    console.log('[WebRTC] Subscribing to call updates:', callId);
    
    const callChannel = supabase
      .channel(`call-${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `id=eq.${callId}`,
        },
        async (payload) => {
          const call = payload.new as CallData;
          console.log('[WebRTC] Call updated:', call.status);

          // Handle answer received (for caller)
          if (call.answer && peerConnectionRef.current && !peerConnectionRef.current.remoteDescription) {
            console.log('[WebRTC] Received answer, setting remote description');
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(call.answer)
            );
            
            // Apply any pending ICE candidates
            for (const candidate of pendingCandidatesRef.current) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
            pendingCandidatesRef.current = [];
          }

          // Handle call status changes
          if (call.status === 'rejected' || call.status === 'ended') {
            endCall();
          }
        }
      )
      .subscribe();

    // Listen for ICE candidates
    const iceCandidateChannel = supabase
      .channel(`ice-${callId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ice_candidates',
          filter: `call_id=eq.${callId}`,
        },
        async (payload) => {
          const candidate = payload.new as { sender_id: string; candidate: RTCIceCandidateInit };
          
          // Ignore our own candidates
          if (candidate.sender_id === user?.id) return;

          console.log('[WebRTC] Received ICE candidate');
          
          if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate.candidate));
          } else {
            // Queue the candidate for later
            pendingCandidatesRef.current.push(candidate.candidate);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(callChannel);
      supabase.removeChannel(iceCandidateChannel);
    };
  }, [callId, user, endCall]);

  return {
    callId,
    isConnected,
    isScreenSharing,
    localStream: localStreamRef.current,
    screenStream: screenStreamRef.current,
    startCall,
    answerCall,
    endCall,
    rejectCall,
    startScreenShare,
    stopScreenShare,
    toggleScreenShare,
  };
}

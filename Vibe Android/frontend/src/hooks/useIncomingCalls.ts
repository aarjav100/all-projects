import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Profile } from '@/types/database';

interface IncomingCall {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: string;
  call_type: string;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
  callerProfile?: Profile;
}

export function useIncomingCalls() {
  const { user } = useAuth();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);

  useEffect(() => {
    if (!user) return;

    console.log('[IncomingCalls] Subscribing to incoming calls for:', user.id);

    const channel = supabase
      .channel('incoming-calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const call = payload.new as IncomingCall;
          console.log('[IncomingCalls] Received incoming call:', call);

          if (call.status === 'ringing') {
            // Fetch caller profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', call.caller_id)
              .single();

            setIncomingCall({
              ...call,
              callerProfile: profile as Profile,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const call = payload.new as IncomingCall;
          console.log('[IncomingCalls] Call updated:', call.status);

          // Clear incoming call if it's no longer ringing
          if (call.status !== 'ringing' && incomingCall?.id === call.id) {
            setIncomingCall(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, incomingCall?.id]);

  const dismissCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  return { incomingCall, dismissCall };
}

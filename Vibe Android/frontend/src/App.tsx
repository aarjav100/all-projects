import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useIncomingCalls } from "@/hooks/useIncomingCalls";
import IncomingCallOverlay from "@/components/calling/IncomingCallOverlay";
import VideoCall from "@/components/calling/VideoCall";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreatePost from "./pages/CreatePost";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import PostDetail from "./pages/PostDetail";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import TopicDetail from "./pages/TopicDetail";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function IncomingCallHandler() {
  const { incomingCall, dismissCall } = useIncomingCalls();
  const [activeCall, setActiveCall] = useState<typeof incomingCall>(null);

  const handleAccept = () => {
    if (incomingCall) {
      setActiveCall(incomingCall);
      dismissCall();
    }
  };

  const handleDecline = async () => {
    if (incomingCall) {
      await supabase
        .from('calls')
        .update({ status: 'rejected' })
        .eq('id', incomingCall.id);
      dismissCall();
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <>
      {incomingCall && incomingCall.callerProfile && !activeCall && (
        <IncomingCallOverlay
          callerProfile={incomingCall.callerProfile}
          callType={incomingCall.call_type}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
      {activeCall && activeCall.callerProfile && (
        <VideoCall
          partner={activeCall.callerProfile}
          isIncoming={true}
          incomingCall={activeCall}
          callType={activeCall.call_type as 'video' | 'audio'}
          onEnd={handleEndCall}
        />
      )}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <IncomingCallHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:partnerId" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/community/:id" element={<CommunityDetail />} />
            <Route path="/topic/:id" element={<TopicDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
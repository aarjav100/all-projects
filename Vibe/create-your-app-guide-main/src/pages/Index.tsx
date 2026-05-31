import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import Feed from '@/components/feed/Feed';
import StoriesBar from '@/components/stories/StoriesBar';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !user.email_confirmed_at) {
      // Redirect to auth page if email is not verified
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !user.email_confirmed_at) {
    return null;
  }

  return (
    <MainLayout>
      <StoriesBar />
      <Feed />
    </MainLayout>
  );
}

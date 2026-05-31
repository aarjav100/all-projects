import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Story, Profile } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface StoryViewerProps {
  stories: Story[];
  profile: Profile;
  onClose: () => void;
}

export default function StoryViewer({ stories, profile, onClose }: StoryViewerProps) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewsCount, setViewsCount] = useState<number>(0);

  const currentStory = stories[currentIndex];
  const isOwnStory = user?.id === profile.user_id;

  const recordView = useCallback(async (storyId: string) => {
    if (!user || isOwnStory) return;

    try {
      await supabase
        .from('story_views')
        .upsert({
          story_id: storyId,
          viewer_id: user.id,
        }, { onConflict: 'story_id,viewer_id' });
    } catch (error) {
      console.error('Error recording view:', error);
    }
  }, [user, isOwnStory]);

  const fetchViewsCount = useCallback(async (storyId: string) => {
    if (!isOwnStory) return;

    const { count } = await supabase
      .from('story_views')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', storyId);

    setViewsCount(count || 0);
  }, [isOwnStory]);

  useEffect(() => {
    recordView(currentStory.id);
    fetchViewsCount(currentStory.id);
  }, [currentStory.id, recordView, fetchViewsCount]);

  useEffect(() => {
    if (isPaused) return;

    const duration = currentStory.media_type === 'video' ? 15000 : 5000;
    const interval = 50;
    const increment = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length, currentStory.media_type, onClose]);

  const goNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      goPrev();
    } else if (x > third * 2) {
      goNext();
    }
  };

  const initials = profile.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2 safe-area-top">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 right-0 z-10 flex items-center justify-between px-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white/50">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-semibold text-sm">{profile.display_name || profile.username}</p>
            <p className="text-white/60 text-xs">
              {formatDistanceToNow(new Date(currentStory.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Story Content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onClick={handleTap}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentStory.media_type === 'video' ? (
          <video
            src={currentStory.media_url}
            autoPlay
            muted
            playsInline
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <img
            src={currentStory.media_url}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Navigation arrows (desktop) */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Views count (for own stories) */}
      {isOwnStory && (
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center safe-area-bottom">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
            <Eye className="w-4 h-4 text-white" />
            <span className="text-white text-sm">{viewsCount} view{viewsCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Story, Profile } from '@/types/database';
import StoryViewer from './StoryViewer';
import CreateStory from './CreateStory';
import { cn } from '@/lib/utils';

interface UserStories {
  userId: string;
  profile: Profile;
  stories: Story[];
  hasUnviewed: boolean;
}

export default function StoriesBar() {
  const { user } = useAuth();
  const [userStories, setUserStories] = useState<UserStories[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserStories | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchStories = async () => {
    if (!user) return;

    try {
      const { data: storiesData } = await supabase
        .from('stories')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (!storiesData || storiesData.length === 0) {
        setUserStories([]);
        setMyStories([]);
        setLoading(false);
        
        // Still fetch my profile
        const { data: myProfileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setMyProfile(myProfileData as Profile);
        return;
      }

      const userIds = [...new Set(storiesData.map(s => s.user_id))];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profilesMap = new Map<string, Profile>();
      profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

      const storyIds = storiesData.map(s => s.id);
      const { data: viewsData } = await supabase
        .from('story_views')
        .select('story_id')
        .eq('viewer_id', user.id)
        .in('story_id', storyIds);

      const viewedStoryIds = new Set(viewsData?.map(v => v.story_id) || []);

      const storiesByUser = new Map<string, Story[]>();
      storiesData.forEach(story => {
        const enrichedStory: Story = {
          ...story,
          media_type: story.media_type as 'image' | 'video',
          profile: profilesMap.get(story.user_id),
          is_viewed: viewedStoryIds.has(story.id),
        };

        if (!storiesByUser.has(story.user_id)) {
          storiesByUser.set(story.user_id, []);
        }
        storiesByUser.get(story.user_id)!.push(enrichedStory);
      });

      const usersWithStories: UserStories[] = [];
      storiesByUser.forEach((stories, userId) => {
        if (userId === user.id) {
          setMyStories(stories);
          setMyProfile(profilesMap.get(userId) || null);
        } else {
          const profile = profilesMap.get(userId);
          if (profile) {
            usersWithStories.push({
              userId,
              profile,
              stories,
              hasUnviewed: stories.some(s => !s.is_viewed),
            });
          }
        }
      });

      usersWithStories.sort((a, b) => {
        if (a.hasUnviewed && !b.hasUnviewed) return -1;
        if (!a.hasUnviewed && b.hasUnviewed) return 1;
        return 0;
      });

      setUserStories(usersWithStories);

      if (!profilesMap.has(user.id)) {
        const { data: myProfileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setMyProfile(myProfileData as Profile);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [user]);

  const handleStoryCreated = () => {
    setShowCreate(false);
    fetchStories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const myInitials = myProfile?.display_name
    ? myProfile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : myProfile?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <div className="floating-card mb-4 p-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {/* Add Story / My Story */}
          <button
            onClick={() => myStories.length > 0 
              ? setSelectedUser({ userId: user!.id, profile: myProfile!, stories: myStories, hasUnviewed: false })
              : setShowCreate(true)
            }
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="relative">
              <Avatar className={cn(
                "w-16 h-16 transition-transform group-hover:scale-105",
                myStories.length > 0 ? "story-ring" : "ring-2 ring-border"
              )}>
                <AvatarImage src={myProfile?.avatar_url || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                  {myInitials}
                </AvatarFallback>
              </Avatar>
              {myStories.length === 0 && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg gradient-primary flex items-center justify-center ring-2 ring-card shadow-glow">
                  <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">Your story</span>
          </button>

          {/* Other users' stories */}
          {userStories.map((userStory) => {
            const initials = userStory.profile.display_name
              ? userStory.profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
              : userStory.profile.username.slice(0, 2).toUpperCase();

            return (
              <button
                key={userStory.userId}
                onClick={() => setSelectedUser(userStory)}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                <Avatar className={cn(
                  "w-16 h-16 transition-transform group-hover:scale-105",
                  userStory.hasUnviewed ? "story-ring" : "story-ring-viewed"
                )}>
                  <AvatarImage src={userStory.profile.avatar_url || undefined} />
                  <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground max-w-16 truncate font-medium">
                  {userStory.profile.display_name || userStory.profile.username}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Viewer */}
      {selectedUser && (
        <StoryViewer
          stories={selectedUser.stories}
          profile={selectedUser.profile}
          onClose={() => {
            setSelectedUser(null);
            fetchStories();
          }}
        />
      )}

      {/* Create Story */}
      {showCreate && (
        <CreateStory
          onClose={() => setShowCreate(false)}
          onCreated={handleStoryCreated}
        />
      )}
    </>
  );
}
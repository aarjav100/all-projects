import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3X3, Loader2, MessageCircle, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Profile as ProfileType, Post } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import VideoCall from '@/components/calling/VideoCall';

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'video' | 'audio'>('video');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        // Get profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (!profileData) {
          navigate('/');
          return;
        }

        setProfile(profileData as ProfileType);

        // Get posts
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', profileData.user_id)
          .order('created_at', { ascending: false });

        if (postsData) {
          const enrichedPosts: Post[] = postsData.map(post => ({
            ...post,
            media_type: post.media_type as 'image' | 'video' | null,
            profile: profileData as ProfileType,
          }));
          setPosts(enrichedPosts);
        }

        // Get followers count
        const { count: followers } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', profileData.user_id);

        setFollowersCount(followers || 0);

        // Get following count
        const { count: following } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', profileData.user_id);

        setFollowingCount(following || 0);

        // Check if current user is following
        if (user) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', profileData.user_id)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user, navigate]);

  const handleFollow = async () => {
    if (!user || !profile) {
      toast.error('Please sign in to follow users');
      return;
    }

    setFollowLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowersCount(prev => wasFollowing ? prev - 1 : prev + 1);

    try {
      if (wasFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profile.user_id);
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: profile.user_id });

        await supabase
          .from('notifications')
          .insert({
            user_id: profile.user_id,
            type: 'follow',
            actor_id: user.id,
          });
      }
    } catch {
      setIsFollowing(wasFollowing);
      setFollowersCount(prev => wasFollowing ? prev + 1 : prev - 1);
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) return null;

  const initials = profile.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.username.slice(0, 2).toUpperCase();

  const isOwnProfile = user?.id === profile.user_id;

  return (
    <MainLayout hideHeader>
      {/* Video Call Overlay */}
      {isInCall && profile && (
        <VideoCall 
          partner={profile}
          callType={callType}
          onEnd={() => setIsInCall(false)} 
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">@{profile.username}</h1>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 ring-4 ring-primary/20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{profile.display_name || profile.username}</h2>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="font-bold text-lg">{posts.length}</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{followersCount}</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{followingCount}</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Follow / Message / Call Buttons */}
        {!isOwnProfile && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={isFollowing ? 'outline' : 'default'}
                className={`flex-1 ${!isFollowing ? 'gradient-primary text-primary-foreground' : ''}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/messages/${profile.user_id}`)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
            
            {/* Call buttons - only show if following */}
            {isFollowing && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setCallType('audio');
                    setIsInCall(true);
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Voice Call
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setCallType('video');
                    setIsInCall(true);
                  }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Video Call
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square bg-muted overflow-hidden cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              {post.media_url ? (
                post.media_type === 'video' ? (
                  <video src={post.media_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                  {post.content?.slice(0, 50)}...
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No posts yet</p>
        </div>
      )}
    </MainLayout>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Grid3X3, Bookmark, LogOut, Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/feed/PostCard';
import { Profile as ProfileType, Post, TrustBadgeLevel } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { TrustBadgeFull } from '@/components/profile/TrustBadge';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchData = async () => {
    if (!user) return;

    try {
      // Get profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as ProfileType);
      }

      // Get posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (postsData) {
        const enrichedPosts: Post[] = postsData.map(post => ({
          ...post,
          media_type: post.media_type as 'image' | 'video' | null,
          profile: profileData as ProfileType,
        }));
        setPosts(enrichedPosts);
      }

      // Get saved posts
      const { data: savedData } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedData && savedData.length > 0) {
        const savedPostIds = savedData.map(s => s.post_id);
        
        const { data: savedPostsData } = await supabase
          .from('posts')
          .select('*')
          .in('id', savedPostIds);

        if (savedPostsData && savedPostsData.length > 0) {
          // Fetch profiles for saved posts
          const userIds = [...new Set(savedPostsData.map(p => p.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('*')
            .in('user_id', userIds);

          const profilesMap = new Map<string, ProfileType>();
          profilesData?.forEach(p => profilesMap.set(p.user_id, p as ProfileType));

          // Sort by saved order
          const enrichedSavedPosts: Post[] = savedPostIds
            .map(id => savedPostsData.find(p => p.id === id))
            .filter(Boolean)
            .map(post => ({
              ...post!,
              media_type: post!.media_type as 'image' | 'video' | null,
              profile: profilesMap.get(post!.user_id),
              is_saved: true,
            }));

          setSavedPosts(enrichedSavedPosts);
        }
      } else {
        setSavedPosts([]);
      }

      // Get followers count
      const { count: followers } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

      setFollowersCount(followers || 0);

      // Get following count
      const { count: following } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);

      setFollowingCount(following || 0);

      // Get total app-wide posts count
      const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      setTotalPostsCount(totalPosts || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('user_id', user.id);

      setProfile(prev => prev ? { ...prev, avatar_url: urlData.publicUrl } : null);
      toast.success('Avatar updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() || 'U';

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h1 className="text-lg font-bold">@{profile?.username}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 ring-4 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
              <Camera className="w-4 h-4 text-primary-foreground" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{profile?.display_name || profile?.username}</h2>
              {profile?.trust_badge && profile.trust_badge !== 'none' && (
                <TrustBadgeFull level={profile.trust_badge} />
              )}
            </div>
            {profile?.bio && (
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

        {/* App-wide Stats */}
        <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total posts in app</span>
            <span className="font-bold text-primary">{totalPostsCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => navigate('/settings')}
        >
          Edit Profile
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="posts" className="flex-1">
            <Grid3X3 className="w-5 h-5" />
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            <Bookmark className="w-5 h-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
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
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5">
              {savedPosts.map((post) => (
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
              <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No saved posts yet</p>
              <p className="text-sm mt-1">Save posts by tapping the bookmark icon</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}

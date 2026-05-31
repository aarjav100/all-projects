import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/MainLayout';
import UserCard from '@/components/profile/UserCard';
import PostCard from '@/components/feed/PostCard';
import { Profile, Post } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Search() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      setFollowingIds(new Set(data?.map(f => f.following_id) || []));
    };
    
    fetchFollowing();
  }, [user]);

  // Update query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setUsers([]);
        setPosts([]);
        return;
      }

      setLoading(true);

      try {
        // Search users
        const { data: usersData } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
          .limit(20);

        setUsers((usersData as Profile[]) || []);

        // Search posts
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .ilike('content', `%${query}%`)
          .order('created_at', { ascending: false })
          .limit(20);

        if (postsData && postsData.length > 0) {
          const userIds = [...new Set(postsData.map(p => p.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('*')
            .in('user_id', userIds);

          const profilesMap = new Map<string, Profile>();
          profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

          const enrichedPosts: Post[] = postsData.map(post => ({
            ...post,
            media_type: post.media_type as 'image' | 'video' | null,
            profile: profilesMap.get(post.user_id),
          }));

          setPosts(enrichedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <MainLayout hideHeader>
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl p-4 safe-area-top">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-full bg-muted border-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background rounded-full"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {query.trim() ? (
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full rounded-none border-b border-border bg-transparent">
            <TabsTrigger value="users" className="flex-1">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex-1">
              Posts ({posts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-0">
            {users.length > 0 ? (
              <div className="divide-y divide-border">
                {users.map((profile) => (
                  <UserCard
                    key={profile.id}
                    profile={profile}
                    isFollowing={followingIds.has(profile.user_id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                No users found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="posts" className="mt-0">
            {posts.length > 0 ? (
              <div className="divide-y divide-border">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                No posts found
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="py-20 text-center text-muted-foreground">
          <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Search for users or posts</p>
        </div>
      )}
    </MainLayout>
  );
}
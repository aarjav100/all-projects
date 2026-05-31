import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PostCard from './PostCard';
import { Post, Profile, FeedReason, PostIntent } from '@/types/database';
import { Loader2, Camera } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentFilters } from '@/hooks/useContentFilters';
import { UserContentFilters } from '@/types/filters';

type FeedTab = 'for-you' | 'following';
const POSTS_PER_PAGE = 15;

// Intent labels for display
const intentLabels: Record<PostIntent, string> = {
  ask: 'Ask for Help',
  teach: 'Teaching',
  vent: 'Venting',
  celebrate: 'Celebration',
};

// Toxic content patterns (simple keyword matching - can be enhanced with AI)
const insultPatterns = /\b(idiot|stupid|dumb|loser|moron|trash|garbage|hate you|shut up|stfu)\b/i;
const politicalPatterns = /\b(democrat|republican|liberal|conservative|trump|biden|election|vote for|political|politics|left-wing|right-wing|congress|senate)\b/i;

export default function Feed() {
  const { user } = useAuth();
  const { filters } = useContentFilters();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [userEngagement, setUserEngagement] = useState<Record<string, number>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch who the user follows and their engagement patterns
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      // Fetch following
      const { data: followData } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      setFollowingIds(followData?.map(f => f.following_id) || []);

      // Fetch user's liked posts to understand engagement patterns
      const { data: likedPosts } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (likedPosts && likedPosts.length > 0) {
        // Fetch intents of liked posts
        const { data: postsWithIntent } = await supabase
          .from('posts')
          .select('intent')
          .in('id', likedPosts.map(l => l.post_id))
          .not('intent', 'is', null);

        // Count engagement per intent
        const intentCounts: Record<string, number> = {};
        postsWithIntent?.forEach(p => {
          if (p.intent) {
            intentCounts[p.intent] = (intentCounts[p.intent] || 0) + 1;
          }
        });
        setUserEngagement(intentCounts);
      }
    };
    fetchUserData();
  }, [user]);

  const fetchPosts = useCallback(async (offset: number = 0, append: boolean = false) => {
    try {
      if (offset === 0) {
        setLoading(true);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      // Fetch regular posts with pagination
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);

      if (postsError) throw postsError;

      // Check if there are more posts
      if (!postsData || postsData.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

      // Fetch reposts with pagination
      const { data: repostsData } = await supabase
        .from('reposts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);

      // Get all unique post IDs from reposts
      const repostedPostIds = repostsData?.map(r => r.post_id) || [];
      
      // Fetch original posts for reposts
      let originalPostsMap = new Map();
      if (repostedPostIds.length > 0) {
        const { data: originalPosts } = await supabase
          .from('posts')
          .select('*')
          .in('id', repostedPostIds);
        
        originalPosts?.forEach(p => originalPostsMap.set(p.id, p));
      }

      // Combine all posts and reposts
      const allPosts = postsData || [];
      const repostItems = repostsData?.map(r => ({
        ...originalPostsMap.get(r.post_id),
        is_repost: true,
        repost_user_id: r.user_id,
        repost_comment: r.comment,
        repost_created_at: r.created_at,
      })).filter(r => r.id) || [];

      // Merge posts
      const combinedPosts = [...allPosts, ...repostItems];

      if (combinedPosts.length === 0) {
        if (!append) setPosts([]);
        return;
      }

      // Get all user IDs needed (post authors + reposters)
      const userIds = [...new Set([
        ...combinedPosts.map(p => p.user_id),
        ...repostItems.map(r => r.repost_user_id),
      ])];

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      const profilesMap = new Map<string, Profile>();
      profilesData?.forEach(p => profilesMap.set(p.user_id, p as Profile));

      const postIds = [...new Set(combinedPosts.map(p => p.id))];
      
      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds);

      const likesCountMap = new Map<string, number>();
      likesData?.forEach(l => {
        likesCountMap.set(l.post_id, (likesCountMap.get(l.post_id) || 0) + 1);
      });

      const { data: commentsData } = await supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds);

      const commentsCountMap = new Map<string, number>();
      commentsData?.forEach(c => {
        commentsCountMap.set(c.post_id, (commentsCountMap.get(c.post_id) || 0) + 1);
      });

      // Fetch repost counts
      const { data: repostsCountData } = await supabase
        .from('reposts')
        .select('post_id')
        .in('post_id', postIds);

      const repostsCountMap = new Map<string, number>();
      repostsCountData?.forEach(r => {
        repostsCountMap.set(r.post_id, (repostsCountMap.get(r.post_id) || 0) + 1);
      });

      let userLikesSet = new Set<string>();
      let userSavedSet = new Set<string>();
      let userRepostsSet = new Set<string>();
      if (user) {
        const { data: userLikes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        userLikes?.forEach(l => userLikesSet.add(l.post_id));

        const { data: userSaved } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        userSaved?.forEach(s => userSavedSet.add(s.post_id));

        const { data: userReposts } = await supabase
          .from('reposts')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);
        
        userReposts?.forEach(r => userRepostsSet.add(r.post_id));
      }

      // Helper to determine feed reason
      const getFeedReason = (post: any): FeedReason | undefined => {
        const profile = profilesMap.get(post.user_id);
        
        // If it's a repost, show who reposted
        if (post.is_repost && post.repost_user_id) {
          const reposter = profilesMap.get(post.repost_user_id);
          if (reposter) {
            return { type: 'reposted', username: reposter.username };
          }
        }
        
        // If user follows the author
        if (followingIds.includes(post.user_id) && profile) {
          const postDate = new Date(post.created_at);
          const hoursSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60);
          if (hoursSincePost < 24) {
            return { type: 'new' };
          }
          return { type: 'following', username: profile.username };
        }
        
        // If post matches user's engagement patterns
        if (post.intent && userEngagement[post.intent] >= 3) {
          return { 
            type: 'intent', 
            intent: intentLabels[post.intent as PostIntent] || post.intent,
            count: userEngagement[post.intent]
          };
        }
        
        // If post is popular (high engagement)
        const totalEngagement = (likesCountMap.get(post.id) || 0) + 
                                (commentsCountMap.get(post.id) || 0) * 2 + 
                                (repostsCountMap.get(post.id) || 0) * 3;
        if (totalEngagement >= 10) {
          return { type: 'popular' };
        }
        
        // Recent posts get trending tag
        const postAge = Date.now() - new Date(post.created_at).getTime();
        if (postAge < 3600000 && totalEngagement >= 3) { // Less than 1 hour and some engagement
          return { type: 'trending' };
        }
        
        return undefined;
      };

      const enrichedPosts: Post[] = combinedPosts.map(post => ({
        ...post,
        media_type: post.media_type as 'image' | 'video' | null,
        profile: profilesMap.get(post.user_id),
        likes_count: likesCountMap.get(post.id) || 0,
        comments_count: commentsCountMap.get(post.id) || 0,
        reposts_count: repostsCountMap.get(post.id) || 0,
        is_liked: userLikesSet.has(post.id),
        is_saved: userSavedSet.has(post.id),
        is_reposted: userRepostsSet.has(post.id),
        reposted_by: post.is_repost ? profilesMap.get(post.repost_user_id) : undefined,
        feed_reason: getFeedReason(post),
      }));

      // Sort by display date (repost_created_at for reposts, created_at for originals)
      enrichedPosts.sort((a, b) => {
        const dateA = new Date(a.is_repost && a.repost_created_at ? a.repost_created_at : a.created_at);
        const dateB = new Date(b.is_repost && b.repost_created_at ? b.repost_created_at : b.created_at);
        return dateB.getTime() - dateA.getTime();
      });

      if (append) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.is_repost ? `repost-${p.id}-${p.repost_created_at}` : p.id));
          const newPosts = enrichedPosts.filter(p => {
            const key = p.is_repost ? `repost-${p.id}-${p.repost_created_at}` : p.id;
            return !existingIds.has(key);
          });
          return [...prev, ...newPosts];
        });
      } else {
        setPosts(enrichedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  // Load more function
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    fetchPosts(posts.length, true);
  }, [fetchPosts, posts.length, loadingMore, hasMore, loading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loadingMore, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Apply toxicity shield filters
  const applyToxicityFilters = (post: Post): boolean => {
    if (!filters) return true;
    
    const content = (post.content || '').toLowerCase();
    
    // Block insults
    if (filters.block_insults && insultPatterns.test(content)) {
      return false;
    }
    
    // Block political content
    if (filters.block_political && politicalPatterns.test(content)) {
      return false;
    }
    
    // Block negative mood (AI-detected)
    if (filters.block_negative_mood && post.ai_mood_score !== null && post.ai_mood_score !== undefined) {
      if (post.ai_mood_score < (filters.min_mood_score || 0.3)) {
        return false;
      }
    }
    
    // Block custom keywords
    if (filters.blocked_keywords && filters.blocked_keywords.length > 0) {
      for (const keyword of filters.blocked_keywords) {
        if (content.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Filter posts based on active tab and toxicity shield
  const filteredPosts = (activeTab === 'following' 
    ? posts.filter(post => followingIds.includes(post.user_id))
    : posts
  ).filter(applyToxicityFilters);

  const renderEmptyState = () => {
    if (activeTab === 'following' && followingIds.length === 0) {
      return (
        <div className="floating-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Follow some users</h3>
          <p className="text-muted-foreground text-sm">Search for users and follow them to see their posts here!</p>
        </div>
      );
    }
    
    if (activeTab === 'following' && filteredPosts.length === 0) {
      return (
        <div className="floating-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">No posts from followed users</h3>
          <p className="text-muted-foreground text-sm">Users you follow haven't posted anything yet.</p>
        </div>
      );
    }

    return (
      <div className="floating-card p-8 text-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Camera className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground text-sm">Be the first to share something amazing!</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FeedTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPosts.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {filteredPosts.map((post, index) => {
            const uniqueKey = post.is_repost 
              ? `repost-${post.id}-${post.repost_created_at}` 
              : post.id;
            
            return (
              <div 
                key={uniqueKey} 
                style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
              >
                <PostCard 
                  post={post} 
                  onLikeToggle={() => fetchPosts(0, false)} 
                  onSaveToggle={() => fetchPosts(0, false)} 
                  onRepost={() => fetchPosts(0, false)}
                />
              </div>
            );
          })}
          
          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="h-10" />
          
          {loadingMore && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          
          {!hasMore && filteredPosts.length > 0 && (
            <p className="text-center text-muted-foreground text-sm py-6">
              You've reached the end
            </p>
          )}
        </>
      )}
    </div>
  );
}
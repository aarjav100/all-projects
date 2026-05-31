export type TrustBadgeLevel = 'none' | 'newcomer' | 'contributor' | 'trusted' | 'verified' | 'champion';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  // Trust system
  is_verified?: boolean;
  trust_score?: number;
  trust_badge?: TrustBadgeLevel;
  helpful_count?: number;
  report_count?: number;
}

export type PostIntent = 'ask' | 'teach' | 'vent' | 'celebrate';

export type SkillCategory = 
  | 'dsa' | 'java' | 'python' | 'javascript' | 'networking' 
  | 'database' | 'devops' | 'frontend' | 'backend' | 'mobile'
  | 'ai_ml' | 'cybersecurity' | 'general';

export type FeedReason = 
  | { type: 'following'; username: string }
  | { type: 'reposted'; username: string }
  | { type: 'intent'; intent: string; count: number }
  | { type: 'popular' }
  | { type: 'new' }
  | { type: 'similar_users' }
  | { type: 'trending' };

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  is_reposted?: boolean;
  // Intent-based posting
  intent?: PostIntent | null;
  // Time-limited posts
  expires_at?: string | null;
  // AI mood analysis
  ai_mood_score?: number | null;
  ai_mood_warning?: string | null;
  // Repost info
  is_repost?: boolean;
  reposted_by?: Profile;
  repost_comment?: string | null;
  repost_created_at?: string;
  // Algorithm transparency
  feed_reason?: FeedReason;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill: SkillCategory;
  level: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface ContributionScore {
  id: string;
  user_id: string;
  help_given: number;
  questions_answered: number;
  resources_shared: number;
  total_score: number;
  created_at: string;
  updated_at: string;
}

export interface CommentSummary {
  id: string;
  post_id: string;
  summary: string;
  top_opinions: { opinion: string; support_count: number }[];
  agreements: string[];
  conflicts: string[];
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender_profile?: Profile;
  receiver_profile?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention' | 'repost';
  actor_id: string;
  post_id: string | null;
  read: boolean;
  created_at: string;
  actor_profile?: Profile;
}

export interface Story {
  id: string;
  user_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  // Joined data
  profile?: Profile;
  views_count?: number;
  is_viewed?: boolean;
}

export interface StoryView {
  id: string;
  story_id: string;
  viewer_id: string;
  viewed_at: string;
  // Joined data
  viewer_profile?: Profile;
}

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  collection_id: string | null;
  created_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
  posts_count?: number;
}

export interface Repost {
  id: string;
  user_id: string;
  post_id: string;
  comment: string | null;
  created_at: string;
  profile?: Profile;
  original_post?: Post;
}

export interface Mention {
  id: string;
  post_id: string;
  mentioned_user_id: string;
  created_at: string;
  mentioned_profile?: Profile;
}
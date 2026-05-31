export interface UserContentFilters {
  id: string;
  user_id: string;
  block_insults: boolean;
  block_political: boolean;
  only_verified_replies: boolean;
  block_negative_mood: boolean;
  min_mood_score: number;
  blocked_keywords: string[];
  created_at: string;
  updated_at: string;
}

export const defaultFilters: Omit<UserContentFilters, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  block_insults: false,
  block_political: false,
  only_verified_replies: false,
  block_negative_mood: false,
  min_mood_score: 0.3,
  blocked_keywords: [],
};

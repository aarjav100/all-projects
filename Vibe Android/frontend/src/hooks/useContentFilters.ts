import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserContentFilters, defaultFilters } from '@/types/filters';

export function useContentFilters() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<UserContentFilters | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFilters(null);
      setLoading(false);
      return;
    }

    const fetchFilters = async () => {
      const { data, error } = await supabase
        .from('user_content_filters')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching filters:', error);
      }

      setFilters(data as UserContentFilters | null);
      setLoading(false);
    };

    fetchFilters();
  }, [user]);

  const updateFilters = useCallback(async (updates: Partial<UserContentFilters>) => {
    if (!user) return { error: 'Not authenticated' };

    if (filters) {
      // Update existing
      const { error } = await supabase
        .from('user_content_filters')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (!error) {
        setFilters(prev => prev ? { ...prev, ...updates } : null);
      }
      return { error };
    } else {
      // Create new
      const { data, error } = await supabase
        .from('user_content_filters')
        .insert({
          user_id: user.id,
          ...defaultFilters,
          ...updates,
        })
        .select()
        .single();

      if (!error && data) {
        setFilters(data as UserContentFilters);
      }
      return { error };
    }
  }, [user, filters]);

  const getEffectiveFilters = useCallback(() => {
    return filters || { ...defaultFilters, user_id: user?.id || '' };
  }, [filters, user]);

  return {
    filters,
    loading,
    updateFilters,
    getEffectiveFilters,
  };
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses(*)
        `)
        .eq('student_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useGrades = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['grades', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          assignments(*),
          courses(*)
        `)
        .eq('student_id', user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useAssignments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['assignments', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          courses(*)
        `);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useAnnouncements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['announcements', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          courses(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};
import { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CommentSummary } from '@/types/database';
import { Button } from '@/components/ui/button';

interface CommentSummarySectionProps {
  postId: string;
  commentCount: number;
}

export default function CommentSummarySection({ postId, commentCount }: CommentSummarySectionProps) {
  const [summary, setSummary] = useState<CommentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Only show for posts with 5+ comments
  if (commentCount < 5) return null;

  const fetchSummary = async () => {
    // First check if we have a cached summary
    const { data: existing } = await supabase
      .from('comment_summaries')
      .select('*')
      .eq('post_id', postId)
      .single();

    if (existing && existing.comment_count === commentCount) {
      setSummary(existing as unknown as CommentSummary);
      setIsExpanded(true);
      return;
    }

    // Generate new summary
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('summarize-comments', {
        body: { post_id: postId },
      });

      if (response.error) throw response.error;
      if (response.data?.summary) {
        setSummary(response.data as CommentSummary);
        setIsExpanded(true);
      }
    } catch (error) {
      console.error('Failed to summarize comments:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  const handleClick = () => {
    if (summary) {
      setIsExpanded(!isExpanded);
    } else if (!hasFetched) {
      fetchSummary();
    }
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-pulse text-primary' : ''}`} />
          <span>
            {isLoading ? 'Generating AI summary...' : 
             summary ? 'AI Discussion Summary' : 
             'Summarize discussion with AI'}
          </span>
        </div>
        {summary && (isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
      </button>

      {isExpanded && summary && (
        <div className="px-4 pb-4 space-y-3 bg-secondary/20">
          <p className="text-sm">{summary.summary}</p>

          {summary.top_opinions && summary.top_opinions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Top Opinions
              </p>
              <div className="space-y-1">
                {summary.top_opinions.map((opinion, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-muted-foreground">•</span>
                    <span>{opinion.opinion}</span>
                    {opinion.support_count > 1 && (
                      <span className="text-muted-foreground flex items-center gap-0.5">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        {opinion.support_count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {summary.agreements && summary.agreements.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-emerald-500">Agreements</p>
              {summary.agreements.map((item, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {item}</p>
              ))}
            </div>
          )}

          {summary.conflicts && summary.conflicts.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Points of Disagreement
              </p>
              {summary.conflicts.map((item, i) => (
                <p key={i} className="text-xs text-muted-foreground">• {item}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

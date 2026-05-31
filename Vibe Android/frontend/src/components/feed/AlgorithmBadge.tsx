import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedReason = 
  | { type: 'following'; username: string }
  | { type: 'reposted'; username: string }
  | { type: 'intent'; intent: string; count: number }
  | { type: 'popular' }
  | { type: 'new' }
  | { type: 'similar_users' }
  | { type: 'trending' };

interface AlgorithmBadgeProps {
  reason: FeedReason;
  className?: string;
}

export default function AlgorithmBadge({ reason, className }: AlgorithmBadgeProps) {
  const getMessage = () => {
    switch (reason.type) {
      case 'following':
        return `You follow @${reason.username}`;
      case 'reposted':
        return `@${reason.username} reposted`;
      case 'intent':
        return `You engaged with ${reason.count}+ ${reason.intent} posts`;
      case 'popular':
        return 'Popular in your network';
      case 'new':
        return 'New from someone you follow';
      case 'similar_users':
        return 'People like you enjoyed this';
      case 'trending':
        return 'Trending now';
      default:
        return null;
    }
  };

  const message = getMessage();
  if (!message) return null;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2.5 py-1 text-xs text-muted-foreground bg-secondary/50 rounded-lg",
      className
    )}>
      <Info className="w-3 h-3" />
      <span>{message}</span>
    </div>
  );
}

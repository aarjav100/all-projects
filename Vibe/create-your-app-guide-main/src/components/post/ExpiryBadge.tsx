import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ExpiryBadgeProps {
  expiresAt: string;
}

export default function ExpiryBadge({ expiresAt }: ExpiryBadgeProps) {
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  
  if (expiryDate <= now) return null;
  
  const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: false });
  const isUrgent = expiryDate.getTime() - now.getTime() < 2 * 60 * 60 * 1000; // Less than 2 hours

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
      isUrgent ? 'bg-red-500/20 text-red-500' : 'bg-muted text-muted-foreground'
    }`}>
      <Clock className="w-3 h-3" />
      {timeLeft} left
    </span>
  );
}

import { HelpCircle, GraduationCap, Flame, PartyPopper } from 'lucide-react';
import { PostIntent } from '@/types/database';

interface IntentBadgeProps {
  intent: PostIntent;
  size?: 'sm' | 'md';
}

const intentConfig: Record<PostIntent, { label: string; icon: React.ReactNode; color: string }> = {
  ask: { label: 'Asking', icon: <HelpCircle className="w-3 h-3" />, color: 'bg-blue-500/20 text-blue-500' },
  teach: { label: 'Teaching', icon: <GraduationCap className="w-3 h-3" />, color: 'bg-emerald-500/20 text-emerald-500' },
  vent: { label: 'Venting', icon: <Flame className="w-3 h-3" />, color: 'bg-orange-500/20 text-orange-500' },
  celebrate: { label: 'Celebrating', icon: <PartyPopper className="w-3 h-3" />, color: 'bg-purple-500/20 text-purple-500' },
};

export default function IntentBadge({ intent, size = 'sm' }: IntentBadgeProps) {
  const config = intentConfig[intent];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

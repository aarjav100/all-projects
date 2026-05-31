import { HelpCircle, GraduationCap, Flame, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostIntent } from '@/types/database';

interface IntentSelectorProps {
  value: PostIntent | null;
  onChange: (intent: PostIntent | null) => void;
}

const intents: { value: PostIntent; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'ask', label: 'Ask', icon: <HelpCircle className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  { value: 'teach', label: 'Teach', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
  { value: 'vent', label: 'Vent', icon: <Flame className="w-4 h-4" />, color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  { value: 'celebrate', label: 'Celebrate', icon: <PartyPopper className="w-4 h-4" />, color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
];

export default function IntentSelector({ value, onChange }: IntentSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {intents.map((intent) => (
        <button
          key={intent.value}
          type="button"
          onClick={() => onChange(value === intent.value ? null : intent.value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
            value === intent.value
              ? intent.color
              : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary"
          )}
        >
          {intent.icon}
          {intent.label}
        </button>
      ))}
    </div>
  );
}

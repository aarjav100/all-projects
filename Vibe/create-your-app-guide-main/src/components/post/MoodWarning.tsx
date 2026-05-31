import { AlertTriangle, Edit3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MoodWarningProps {
  warning: string;
  tone: string;
  onEdit: () => void;
  onPostAnyway: () => void;
  onDelay: () => void;
}

export default function MoodWarning({ warning, tone, onEdit, onPostAnyway, onDelay }: MoodWarningProps) {
  const toneColors: Record<string, string> = {
    angry: 'bg-red-500/10 border-red-500/30 text-red-500',
    harmful: 'bg-red-600/10 border-red-600/30 text-red-600',
    sad: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
    anxious: 'bg-amber-500/10 border-amber-500/30 text-amber-500',
  };

  const colorClass = toneColors[tone] || 'bg-amber-500/10 border-amber-500/30 text-amber-500';

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${colorClass}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-sm">This post sounds emotional</p>
          <p className="text-sm opacity-80 mt-1">{warning}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDelay}
          className="gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" />
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onPostAnyway}
          className="text-muted-foreground"
        >
          Post Anyway
        </Button>
      </div>
    </div>
  );
}

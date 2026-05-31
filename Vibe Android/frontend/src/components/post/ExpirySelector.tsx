import { Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpirySelectorProps {
  value: string | null;
  onChange: (expiry: string | null) => void;
}

const expiryOptions = [
  { value: '24h', label: '24 hours', hours: 24 },
  { value: '7d', label: '7 days', hours: 168 },
  { value: '30d', label: '30 days', hours: 720 },
];

export function getExpiryDate(value: string): Date {
  const now = new Date();
  const option = expiryOptions.find(o => o.value === value);
  if (option) {
    now.setHours(now.getHours() + option.hours);
  }
  return now;
}

export default function ExpirySelector({ value, onChange }: ExpirySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Expires:</span>
      <div className="flex gap-1.5">
        {expiryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(value === option.value ? null : option.value)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
          >
            {option.label}
          </button>
        ))}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

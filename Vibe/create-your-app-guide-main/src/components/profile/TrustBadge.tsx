import { BadgeCheck, Star, Award, Shield, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TrustBadgeLevel = 'none' | 'newcomer' | 'contributor' | 'trusted' | 'verified' | 'champion';

interface TrustBadgeProps {
  level: TrustBadgeLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeConfig: Record<TrustBadgeLevel, {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}> = {
  none: {
    icon: null,
    label: '',
    color: '',
    bgColor: '',
    description: '',
  },
  newcomer: {
    icon: <Sparkles className="w-full h-full" />,
    label: 'Newcomer',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
    description: 'Just getting started',
  },
  contributor: {
    icon: <Star className="w-full h-full" />,
    label: 'Contributor',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    description: 'Active community member',
  },
  trusted: {
    icon: <Shield className="w-full h-full" />,
    label: 'Trusted',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/20',
    description: 'Consistently helpful, no reports',
  },
  verified: {
    icon: <BadgeCheck className="w-full h-full" />,
    label: 'Verified',
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    description: 'Verified by behavior',
  },
  champion: {
    icon: <Crown className="w-full h-full" />,
    label: 'Champion',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/20',
    description: 'Top community leader',
  },
};

const sizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function TrustBadge({ level, showLabel = false, size = 'sm', className }: TrustBadgeProps) {
  const config = badgeConfig[level];
  
  if (level === 'none' || !config.icon) return null;

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1",
        className
      )}
      title={`${config.label}: ${config.description}`}
    >
      <span className={cn(sizeClasses[size], config.color)}>
        {config.icon}
      </span>
      {showLabel && (
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </span>
  );
}

export function TrustBadgeFull({ level, className }: { level: TrustBadgeLevel; className?: string }) {
  const config = badgeConfig[level];
  
  if (level === 'none' || !config.icon) return null;

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
      config.bgColor,
      className
    )}>
      <span className={cn("w-4 h-4", config.color)}>
        {config.icon}
      </span>
      <div>
        <p className={cn("text-xs font-semibold", config.color)}>{config.label}</p>
        <p className="text-[10px] text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
}

// Calculate badge level based on metrics
export function calculateTrustBadge(metrics: {
  helpfulCount: number;
  reportCount: number;
  currentStreak: number;
  totalActiveDays: number;
  accountAgeDays: number;
}): TrustBadgeLevel {
  const { helpfulCount, reportCount, currentStreak, totalActiveDays, accountAgeDays } = metrics;
  
  // Negative: too many reports
  if (reportCount >= 3) return 'none';
  
  // Champion: exceptional behavior
  if (
    helpfulCount >= 50 &&
    reportCount === 0 &&
    totalActiveDays >= 60 &&
    currentStreak >= 14
  ) {
    return 'champion';
  }
  
  // Verified: consistently helpful
  if (
    helpfulCount >= 20 &&
    reportCount === 0 &&
    totalActiveDays >= 30 &&
    currentStreak >= 7
  ) {
    return 'verified';
  }
  
  // Trusted: good track record
  if (
    helpfulCount >= 10 &&
    reportCount <= 1 &&
    totalActiveDays >= 14
  ) {
    return 'trusted';
  }
  
  // Contributor: actively participating
  if (
    helpfulCount >= 3 &&
    totalActiveDays >= 7
  ) {
    return 'contributor';
  }
  
  // Newcomer: new but active
  if (accountAgeDays >= 3 && totalActiveDays >= 2) {
    return 'newcomer';
  }
  
  return 'none';
}

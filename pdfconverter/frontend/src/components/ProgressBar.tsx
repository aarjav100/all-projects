interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ progress, label, className = '' }: ProgressBarProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

import { SkillCategory } from '@/types/database';

interface SkillBadgeProps {
  skill: SkillCategory;
  level: number;
  showLevel?: boolean;
}

const skillConfig: Record<SkillCategory, { label: string; color: string }> = {
  dsa: { label: 'DSA', color: 'bg-violet-500/20 text-violet-500' },
  java: { label: 'Java', color: 'bg-orange-500/20 text-orange-500' },
  python: { label: 'Python', color: 'bg-yellow-500/20 text-yellow-500' },
  javascript: { label: 'JavaScript', color: 'bg-amber-500/20 text-amber-500' },
  networking: { label: 'Networking', color: 'bg-cyan-500/20 text-cyan-500' },
  database: { label: 'Database', color: 'bg-blue-500/20 text-blue-500' },
  devops: { label: 'DevOps', color: 'bg-slate-500/20 text-slate-400' },
  frontend: { label: 'Frontend', color: 'bg-pink-500/20 text-pink-500' },
  backend: { label: 'Backend', color: 'bg-green-500/20 text-green-500' },
  mobile: { label: 'Mobile', color: 'bg-indigo-500/20 text-indigo-500' },
  ai_ml: { label: 'AI/ML', color: 'bg-purple-500/20 text-purple-500' },
  cybersecurity: { label: 'Security', color: 'bg-red-500/20 text-red-500' },
  general: { label: 'General', color: 'bg-muted text-muted-foreground' },
};

const levelTitles = [
  'Novice',
  'Beginner', 
  'Apprentice',
  'Intermediate',
  'Skilled',
  'Advanced',
  'Expert',
  'Master',
  'Guru',
  'Legend'
];

export default function SkillBadge({ skill, level, showLevel = true }: SkillBadgeProps) {
  const config = skillConfig[skill];
  if (!config) return null;

  const title = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
      {showLevel && (
        <span className="opacity-75">Lv.{level}</span>
      )}
    </span>
  );
}

export function getSkillTitle(level: number): string {
  return levelTitles[Math.min(level - 1, levelTitles.length - 1)];
}

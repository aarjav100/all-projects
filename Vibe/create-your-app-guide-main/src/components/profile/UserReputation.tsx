import { UserSkill, ContributionScore } from '@/types/database';
import SkillBadge, { getSkillTitle } from './SkillBadge';
import { Trophy, HelpCircle, MessageSquare, Share2 } from 'lucide-react';

interface UserReputationProps {
  skills: UserSkill[];
  contribution?: ContributionScore | null;
}

export default function UserReputation({ skills, contribution }: UserReputationProps) {
  const topSkills = skills
    .sort((a, b) => b.level - a.level || b.points - a.points)
    .slice(0, 3);

  const highestLevel = topSkills.length > 0 ? topSkills[0].level : 0;
  const title = highestLevel > 0 ? getSkillTitle(highestLevel) : null;

  return (
    <div className="space-y-3">
      {/* Skills */}
      {topSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Skills</span>
            {title && (
              <span className="text-xs text-muted-foreground">({title})</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topSkills.map((skill) => (
              <SkillBadge
                key={skill.id}
                skill={skill.skill}
                level={skill.level}
              />
            ))}
          </div>
        </div>
      )}

      {/* Contribution Score */}
      {contribution && contribution.total_score > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{contribution.help_given} helped</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{contribution.questions_answered} answered</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Share2 className="w-3.5 h-3.5" />
            <span>{contribution.resources_shared} shared</span>
          </div>
        </div>
      )}
    </div>
  );
}

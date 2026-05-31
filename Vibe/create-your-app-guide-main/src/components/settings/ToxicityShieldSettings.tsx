import { useState, useEffect } from 'react';
import { Shield, Ban, Flag, BadgeCheck, Frown, Plus, X, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useContentFilters } from '@/hooks/useContentFilters';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ToxicityShieldSettings() {
  const { filters, loading, updateFilters } = useContentFilters();
  const [blockInsults, setBlockInsults] = useState(false);
  const [blockPolitical, setBlockPolitical] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [blockNegative, setBlockNegative] = useState(false);
  const [minMoodScore, setMinMoodScore] = useState(30);
  const [blockedKeywords, setBlockedKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from fetched filters
  useEffect(() => {
    if (filters) {
      setBlockInsults(filters.block_insults);
      setBlockPolitical(filters.block_political);
      setOnlyVerified(filters.only_verified_replies);
      setBlockNegative(filters.block_negative_mood);
      setMinMoodScore(Math.round((filters.min_mood_score || 0.3) * 100));
      setBlockedKeywords(filters.blocked_keywords || []);
    }
  }, [filters]);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateFilters({
      block_insults: blockInsults,
      block_political: blockPolitical,
      only_verified_replies: onlyVerified,
      block_negative_mood: blockNegative,
      min_mood_score: minMoodScore / 100,
      blocked_keywords: blockedKeywords,
    });

    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Toxicity shield updated!');
    }
    setIsSaving(false);
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim().toLowerCase();
    if (keyword && !blockedKeywords.includes(keyword)) {
      setBlockedKeywords([...blockedKeywords, keyword]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setBlockedKeywords(blockedKeywords.filter(k => k !== keyword));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">Toxicity Shield</h2>
          <p className="text-sm text-muted-foreground">Control what content appears in your feed</p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        {/* Block Insults */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <Ban className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-sm">Block Insults</p>
              <p className="text-xs text-muted-foreground">Hide posts containing offensive language</p>
            </div>
          </div>
          <Switch checked={blockInsults} onCheckedChange={setBlockInsults} />
        </div>

        {/* Block Political */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">No Political Content</p>
              <p className="text-xs text-muted-foreground">Filter out political discussions</p>
            </div>
          </div>
          <Switch checked={blockPolitical} onCheckedChange={setBlockPolitical} />
        </div>

        {/* Only Verified */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="font-medium text-sm">Verified Replies Only</p>
              <p className="text-xs text-muted-foreground">Only see replies from trusted users</p>
            </div>
          </div>
          <Switch checked={onlyVerified} onCheckedChange={setOnlyVerified} />
        </div>

        {/* Block Negative Mood */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <Frown className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-medium text-sm">Filter Negative Content</p>
              <p className="text-xs text-muted-foreground">Hide emotionally negative posts (AI-detected)</p>
            </div>
          </div>
          <Switch checked={blockNegative} onCheckedChange={setBlockNegative} />
        </div>

        {/* Mood Score Threshold */}
        {blockNegative && (
          <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Minimum Positivity Level</p>
              <span className="text-sm text-muted-foreground">{minMoodScore}%</span>
            </div>
            <Slider
              value={[minMoodScore]}
              onValueChange={(v) => setMinMoodScore(v[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Posts with AI mood score below {minMoodScore}% will be hidden
            </p>
          </div>
        )}

        {/* Custom Blocked Keywords */}
        <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
          <p className="font-medium text-sm">Blocked Keywords</p>
          <p className="text-xs text-muted-foreground">Add words or phrases you don't want to see</p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
              className="flex-1"
            />
            <Button size="icon" variant="secondary" onClick={addKeyword}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {blockedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {blockedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-xs"
                >
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="w-full gradient-primary text-primary-foreground"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Save Shield Settings
      </Button>
    </div>
  );
}

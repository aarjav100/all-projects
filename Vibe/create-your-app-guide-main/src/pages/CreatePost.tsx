import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Video, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostIntent } from '@/types/database';
import IntentSelector from '@/components/post/IntentSelector';
import ExpirySelector, { getExpiryDate } from '@/components/post/ExpirySelector';
import MoodWarning from '@/components/post/MoodWarning';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface MoodAnalysis {
  mood_score: number;
  warning: string | null;
  tone: string;
}

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [intent, setIntent] = useState<PostIntent | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMoodWarning, setShowMoodWarning] = useState(false);
  const [bypassWarning, setBypassWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMood = useCallback(async (text: string) => {
    if (!text || text.length < 20) {
      setMoodAnalysis(null);
      setShowMoodWarning(false);
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-mood', {
        body: { content: text },
      });

      if (response.error) throw response.error;

      const analysis = response.data as MoodAnalysis;
      setMoodAnalysis(analysis);
      
      if (analysis.warning && !bypassWarning) {
        setShowMoodWarning(true);
      }
    } catch (error) {
      console.error('Failed to analyze mood:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [bypassWarning]);

  const debouncedAnalyze = useDebouncedCallback(analyzeMood, 1000);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setBypassWarning(false);
    setShowMoodWarning(false);
    debouncedAnalyze(text);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to create a post');
      return;
    }

    if (!content.trim() && !mediaFile) {
      toast.error('Please add some content or media');
      return;
    }

    // Check for mood warning
    if (showMoodWarning && moodAnalysis?.warning && !bypassWarning) {
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrl = null;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        mediaUrl = urlData.publicUrl;
      }

      // Calculate expiry date
      const expiresAt = expiry ? getExpiryDate(expiry).toISOString() : null;

      // Create post with new fields
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim() || null,
          media_url: mediaUrl,
          media_type: mediaType,
          intent: intent,
          expires_at: expiresAt,
          ai_mood_score: moodAnalysis?.mood_score ?? null,
          ai_mood_warning: moodAnalysis?.warning ?? null,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Extract and process mentions
      const mentionRegex = /@([a-zA-Z0-9_]+)/g;
      const mentions = [...content.matchAll(mentionRegex)].map(m => m[1]);
      
      if (mentions.length > 0) {
        const { data: mentionedProfiles } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('username', mentions);
        
        if (mentionedProfiles && mentionedProfiles.length > 0) {
          await supabase
            .from('mentions')
            .insert(
              mentionedProfiles.map(p => ({
                post_id: postData.id,
                mentioned_user_id: p.user_id,
              }))
            );
          
          await supabase
            .from('notifications')
            .insert(
              mentionedProfiles
                .filter(p => p.user_id !== user.id)
                .map(p => ({
                  user_id: p.user_id,
                  type: 'mention',
                  actor_id: user.id,
                  post_id: postData.id,
                }))
            );
        }
      }

      toast.success('Post created!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnyway = () => {
    setBypassWarning(true);
    setShowMoodWarning(false);
  };

  const handleSaveAsDraft = () => {
    toast.info('Draft saving coming soon!');
    setShowMoodWarning(false);
  };

  const canPost = (content.trim() || mediaFile) && (!showMoodWarning || bypassWarning);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border safe-area-top">
        <div className="flex items-center justify-between h-14 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold">Create Post</h1>
          <Button
            onClick={handleSubmit}
            disabled={!canPost || isSubmitting}
            size="sm"
            className="gradient-primary text-primary-foreground"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Intent Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">What's the purpose of this post?</label>
          <IntentSelector value={intent} onChange={setIntent} />
        </div>

        {/* Content */}
        <div className="relative">
          <Textarea
            placeholder={
              intent === 'ask' ? "What do you need help with?" :
              intent === 'teach' ? "Share your knowledge..." :
              intent === 'vent' ? "Get it off your chest..." :
              intent === 'celebrate' ? "Share your win! 🎉" :
              "What's on your mind?"
            }
            value={content}
            onChange={handleContentChange}
            className="min-h-[150px] text-lg resize-none border-0 focus-visible:ring-0 p-0 bg-transparent"
            maxLength={500}
          />
          {isAnalyzing && (
            <div className="absolute right-0 top-0 flex items-center gap-1 text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-xs">Analyzing...</span>
            </div>
          )}
        </div>

        {/* Character count */}
        <div className="text-sm text-muted-foreground text-right">
          {content.length}/500
        </div>

        {/* Mood Warning */}
        {showMoodWarning && moodAnalysis?.warning && (
          <MoodWarning
            warning={moodAnalysis.warning}
            tone={moodAnalysis.tone}
            onEdit={() => setShowMoodWarning(false)}
            onPostAnyway={handlePostAnyway}
            onDelay={handleSaveAsDraft}
          />
        )}

        {/* Expiry Selector */}
        <ExpirySelector value={expiry} onChange={setExpiry} />

        {/* Media Preview */}
        {mediaPreview && (
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <button
              onClick={clearMedia}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {mediaType === 'video' ? (
              <video src={mediaPreview} controls className="w-full max-h-[400px] object-contain" />
            ) : (
              <img src={mediaPreview} alt="Preview" className="w-full max-h-[400px] object-contain" />
            )}
          </div>
        )}

        {/* Media buttons */}
        {!mediaFile && (
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, 'image')}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.click();
                }
              }}
              className="flex-1"
            >
              <Image className="w-5 h-5 mr-2" />
              Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'video/*';
                  fileInputRef.current.click();
                }
              }}
              className="flex-1"
            >
              <Video className="w-5 h-5 mr-2" />
              Video
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

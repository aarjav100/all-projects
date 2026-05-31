import { useState, useRef } from 'react';
import { X, Image, Video, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CreateStoryProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateStory({ onClose, onCreated }: CreateStoryProps) {
  const { user } = useAuth();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!user || !mediaFile || !mediaType) return;

    setIsUploading(true);

    try {
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `stories/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, mediaFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: urlData.publicUrl,
          media_type: mediaType,
        });

      if (insertError) throw insertError;

      toast.success('Story posted!');
      onCreated();
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to post story');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-xl safe-area-top">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <h1 className="font-semibold">Create Story</h1>
        <Button
          onClick={handleUpload}
          disabled={!mediaFile || isUploading}
          size="sm"
          className="gradient-primary text-primary-foreground"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
        </Button>
      </header>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full pt-14 pb-20 px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {mediaPreview ? (
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-muted">
            {mediaType === 'video' ? (
              <video
                src={mediaPreview}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => {
                if (mediaPreview) URL.revokeObjectURL(mediaPreview);
                setMediaFile(null);
                setMediaPreview(null);
                setMediaType(null);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm aspect-[9/16] rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Add to your story</p>
              <p className="text-sm text-muted-foreground">Photo or video</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'image/*';
                    fileInputRef.current.click();
                  }
                }}
              >
                <Image className="w-4 h-4 mr-2" />
                Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = 'video/*';
                    fileInputRef.current.click();
                  }
                }}
              >
                <Video className="w-4 h-4 mr-2" />
                Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

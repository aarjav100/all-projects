import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, FolderPlus, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Collection } from '@/types/database';

interface CollectionDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess?: () => void;
}

export default function CollectionDialog({ postId, open, onOpenChange, onSaveSuccess }: CollectionDialogProps) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (open && user) {
      fetchCollections();
    }
  }, [open, user]);

  const fetchCollections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!user || !newName.trim()) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          name: newName.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setCollections([data, ...collections]);
      setSelectedCollection(data.id);
      setNewName('');
      setShowNewForm(false);
      toast.success('Collection created!');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveToCollection = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // First check if post is already saved
      const { data: existing } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (existing) {
        // Update existing saved post with collection
        const { error } = await supabase
          .from('saved_posts')
          .update({ collection_id: selectedCollection })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new saved post with collection
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: user.id,
            post_id: postId,
            collection_id: selectedCollection,
          });

        if (error) throw error;
      }

      toast.success(selectedCollection ? 'Saved to collection!' : 'Saved without collection');
      onSaveSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving to collection:', error);
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            Save to Collection
          </DialogTitle>
          <DialogDescription>
            Organize your saved posts into collections
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Collection list */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <button
                  onClick={() => setSelectedCollection(null)}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                    selectedCollection === null
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-secondary/30 hover:bg-secondary/50 border-2 border-transparent'
                  }`}
                >
                  <span className="font-medium">No collection</span>
                  {selectedCollection === null && <Check className="w-4 h-4 text-primary" />}
                </button>

                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => setSelectedCollection(collection.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between ${
                      selectedCollection === collection.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-secondary/30 hover:bg-secondary/50 border-2 border-transparent'
                    }`}
                  >
                    <span className="font-medium">{collection.name}</span>
                    {selectedCollection === collection.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>

              {/* Create new collection */}
              {showNewForm ? (
                <div className="space-y-3 p-3 rounded-xl bg-secondary/30">
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection name</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="My Collection"
                      maxLength={50}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateCollection}
                      disabled={!newName.trim() || isCreating}
                    >
                      {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                      Create
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowNewForm(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Collection
                </Button>
              )}

              {/* Save button */}
              <Button
                onClick={handleSaveToCollection}
                disabled={isSaving}
                className="w-full gradient-primary text-primary-foreground"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Post
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

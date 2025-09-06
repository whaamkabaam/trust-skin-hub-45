import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MediaAsset {
  id: string;
  url: string;
  type: string;
  alt_text?: string;
  caption?: string;
  operator_id: string;
  order_number?: number;
  created_at: string;
  updated_at: string;
}

export function useMedia(operatorId?: string) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      setLoading(true);
      let query = supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      
      if (operatorId) {
        query = query.eq('operator_id', operatorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching media assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media assets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (file: File, operatorId: string, metadata?: { alt_text?: string; caption?: string }) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${operatorId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('operator-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('operator-media')
        .getPublicUrl(fileName);

      const { data, error } = await supabase
        .from('media_assets')
        .insert({
          url: publicUrl,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          operator_id: operatorId,
          alt_text: metadata?.alt_text,
          caption: metadata?.caption,
        })
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Media uploaded successfully',
      });

      return data;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload media',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateAsset = async (id: string, updates: { alt_text?: string; caption?: string }) => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAssets(prev => prev.map(asset => asset.id === id ? data : asset));
      toast({
        title: 'Success',
        description: 'Media updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating media:', error);
      toast({
        title: 'Error',
        description: 'Failed to update media',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const asset = assets.find(a => a.id === id);
      if (!asset) return;

      // Extract file path from URL
      const urlParts = asset.url.split('/');
      const fileName = urlParts.slice(-2).join('/'); // operator_id/filename

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('operator-media')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));
      toast({
        title: 'Success',
        description: 'Media deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [operatorId]);

  return {
    assets,
    loading,
    fetchAssets,
    uploadAsset,
    updateAsset,
    deleteAsset,
  };
}
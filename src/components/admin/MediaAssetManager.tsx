import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Image, Trash2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  operator_id: string;
  type: string;
  url: string;
  alt_text?: string;
  caption?: string;
  order_number: number;
}

interface MediaAssetManagerProps {
  operatorId: string;
}

const ASSET_TYPES = [
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'logo', label: 'Logo' },
  { value: 'banner', label: 'Banner' },
  { value: 'gallery', label: 'Gallery Image' },
  { value: 'hero', label: 'Hero Image' },
  { value: 'mystery_box', label: 'Mystery Box' }
];

export function MediaAssetManager({ operatorId }: MediaAssetManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newAsset, setNewAsset] = useState({
    type: 'screenshot',
    url: '',
    alt_text: '',
    caption: ''
  });

  useEffect(() => {
    fetchAssets();
  }, [operatorId]);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('operator_id', operatorId)
        .order('order_number');

      if (error) throw error;
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      toast.error('Failed to fetch media assets');
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async () => {
    if (!newAsset.url.trim()) {
      toast.error('Please provide a URL for the asset');
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('media_assets')
        .insert({
          operator_id: operatorId,
          type: newAsset.type,
          url: newAsset.url,
          alt_text: newAsset.alt_text || null,
          caption: newAsset.caption || null,
          order_number: assets.length
        });

      if (error) throw error;

      toast.success('Media asset added successfully');
      setNewAsset({ type: 'screenshot', url: '', alt_text: '', caption: '' });
      fetchAssets();
    } catch (err) {
      console.error('Error adding asset:', err);
      toast.error('Failed to add media asset');
    } finally {
      setUploading(false);
    }
  };

  const removeAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      
      toast.success('Asset removed successfully');
      fetchAssets();
    } catch (err) {
      console.error('Error removing asset:', err);
      toast.error('Failed to remove asset');
    }
  };

  const addSampleAssets = async () => {
    const sampleAssets = [
      {
        operator_id: operatorId,
        type: 'screenshot',
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        alt_text: 'Gaming interface screenshot',
        caption: 'Main gaming interface',
        order_number: 0
      },
      {
        operator_id: operatorId,
        type: 'banner',
        url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop',
        alt_text: 'Promotional banner',
        caption: 'Welcome bonus promotion',
        order_number: 1
      },
      {
        operator_id: operatorId,
        type: 'gallery',
        url: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop',
        alt_text: 'Game selection',
        caption: 'Wide variety of games available',
        order_number: 2
      }
    ];

    try {
      const { error } = await supabase
        .from('media_assets')
        .insert(sampleAssets);

      if (error) throw error;
      
      toast.success('Sample assets added successfully');
      fetchAssets();
    } catch (err) {
      console.error('Error adding sample assets:', err);
      toast.error('Failed to add sample assets');
    }
  };

  if (loading) {
    return <div>Loading media assets...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Media Assets
          {assets.length === 0 && (
            <Button type="button" onClick={addSampleAssets} variant="outline" size="sm">
              Add Sample Assets
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Asset */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-medium">Add New Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset-type">Type</Label>
              <Select value={newAsset.type} onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="asset-url">Image URL</Label>
              <Input
                id="asset-url"
                value={newAsset.url}
                onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                value={newAsset.alt_text}
                onChange={(e) => setNewAsset({ ...newAsset, alt_text: e.target.value })}
                placeholder="Descriptive text for accessibility"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={newAsset.caption}
                onChange={(e) => setNewAsset({ ...newAsset, caption: e.target.value })}
                placeholder="Optional caption"
              />
            </div>
          </div>
          <Button type="button" onClick={addAsset} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>

        {/* Existing Assets */}
        <div className="space-y-4">
          <h3 className="font-medium">Current Assets ({assets.length})</h3>
          {assets.length === 0 ? (
            <p className="text-muted-foreground">No media assets added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img
                      src={asset.url}
                      alt={asset.alt_text || 'Media asset'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><Image class="w-8 h-8 text-muted-foreground" /></div>';
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{asset.type}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAsset(asset.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {asset.caption && (
                        <p className="text-sm text-muted-foreground">{asset.caption}</p>
                      )}
                      {asset.alt_text && (
                        <p className="text-xs text-muted-foreground">Alt: {asset.alt_text}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

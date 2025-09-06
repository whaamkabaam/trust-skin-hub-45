import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMedia } from '@/hooks/useMedia';
import { useOperators } from '@/hooks/useOperators';
import { EnhancedFileUpload } from '@/components/admin/EnhancedFileUpload';
import { Upload, Image, Edit, Trash2, Search, Grid, List } from 'lucide-react';

export default function MediaLibrary() {
  const { operators } = useOperators();
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { assets, loading, uploadAsset, updateAsset, deleteAsset } = useMedia(selectedOperatorId || undefined);

  const filteredAssets = assets.filter(asset =>
    asset.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = async (file: File) => {
    if (!selectedOperatorId) {
      alert('Please select an operator first');
      return;
    }
    await uploadAsset(file, selectedOperatorId);
    setIsUploadDialogOpen(false);
  };

  const handleUpdateAsset = async (updates: { alt_text?: string; caption?: string }) => {
    if (!editingAsset) return;
    await updateAsset(editingAsset.id, updates);
    setEditingAsset(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage images and media assets</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Operator</Label>
                <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose operator..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map(operator => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedOperatorId && (
                <EnhancedFileUpload
                  label="Upload Media Files"
                  accept="image/*,video/*,audio/*"
                  maxSize={50 * 1024 * 1024} // 50MB
                  onUpload={(url) => {
                    setIsUploadDialogOpen(false);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media by alt text, caption, or filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedOperatorId} onValueChange={setSelectedOperatorId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All operators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All operators</SelectItem>
                {operators.map(operator => (
                  <SelectItem key={operator.id} value={operator.id}>
                    {operator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Media Assets ({filteredAssets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading media...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No media assets found</p>
              <p className="text-sm">Upload some media to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.url}
                        alt={asset.alt_text || 'Media asset'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingAsset(asset)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAsset(asset.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {asset.alt_text && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {asset.alt_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.url}
                        alt={asset.alt_text || 'Media asset'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{asset.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-medium">{asset.alt_text || 'Untitled'}</p>
                    <p className="text-sm text-muted-foreground">{asset.caption}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingAsset(asset)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteAsset(asset.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Asset</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateAsset({
                alt_text: formData.get('alt_text') as string,
                caption: formData.get('caption') as string,
              });
            }} className="space-y-4">
              <div>
                <Label htmlFor="alt_text">Alt Text</Label>
                <Input
                  id="alt_text"
                  name="alt_text"
                  defaultValue={editingAsset.alt_text || ''}
                  placeholder="Describe this image for accessibility"
                />
              </div>
              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  name="caption"
                  defaultValue={editingAsset.caption || ''}
                  placeholder="Optional caption for this media"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingAsset(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
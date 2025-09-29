import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Search, Package, Tag, Building2 } from 'lucide-react';
import { useMysteryBoxes } from '@/hooks/useMysteryBoxes';
import { useCategories } from '@/hooks/useCategories';
import { useOperators } from '@/hooks/useOperators';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SEOHead } from '@/components/SEOHead';
import type { MysteryBox } from '@/types';

interface MysteryBoxFormData {
  name: string;
  slug: string;
  price: number;
  expected_value: number | null;
  min_price: number | null;
  image_url: string;
  game: string;
  box_type: string;
  odds_disclosed: string;
  verified: boolean;
  provably_fair: boolean;
  operator_id: string | null;
  categories: string[];
  highlights: Array<{ name: string; icon?: string; rarity: string }>;
  site_name: string;
}

const MysteryBoxes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<MysteryBox | null>(null);
  const [deleteBoxId, setDeleteBoxId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MysteryBoxFormData>({
    name: '',
    slug: '',
    price: 0,
    expected_value: null,
    min_price: null,
    image_url: '',
    game: '',
    box_type: 'digital',
    odds_disclosed: 'Yes',
    verified: false,
    provably_fair: false,
    operator_id: null,
    categories: [],
    highlights: [],
    site_name: ''
  });

  const { mysteryBoxes, loading, fetchMysteryBoxes } = useMysteryBoxes();
  const { categories } = useCategories();
  const { operators } = useOperators();

  const filteredBoxes = mysteryBoxes.filter(box =>
    box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    box.game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    box.site_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const boxData = {
        ...formData,
        expected_value: formData.expected_value || null,
        min_price: formData.min_price || null,
        stats: { open_count: 0, avg_return: 0 },
        popularity_score: 0,
        is_active: true,
        highlights: JSON.stringify(formData.highlights),
        rarity_mix: {}
      };

      if (editingBox) {
        const { error } = await supabase
          .from('mystery_boxes')
          .update(boxData)
          .eq('id', editingBox.id);

        if (error) throw error;

        // Handle category associations
        await supabase
          .from('mystery_box_categories')
          .delete()
          .eq('mystery_box_id', editingBox.id);

        if (formData.categories.length > 0) {
          const categoryAssociations = formData.categories.map(categoryId => ({
            mystery_box_id: editingBox.id,
            category_id: categoryId
          }));

          await supabase
            .from('mystery_box_categories')
            .insert(categoryAssociations);
        }

        toast.success('Mystery box updated successfully');
      } else {
        const { data: newBox, error } = await supabase
          .from('mystery_boxes')
          .insert(boxData)
          .select()
          .single();

        if (error) throw error;

        // Handle category associations
        if (formData.categories.length > 0) {
          const categoryAssociations = formData.categories.map(categoryId => ({
            mystery_box_id: newBox.id,
            category_id: categoryId
          }));

          await supabase
            .from('mystery_box_categories')
            .insert(categoryAssociations);
        }

        toast.success('Mystery box created successfully');
      }

      resetForm();
      fetchMysteryBoxes();
    } catch (error) {
      console.error('Error saving mystery box:', error);
      toast.error('Failed to save mystery box');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: 0,
      expected_value: null,
      min_price: null,
      image_url: '',
      game: '',
      box_type: 'digital',
      odds_disclosed: 'Yes',
      verified: false,
      provably_fair: false,
      operator_id: null,
      categories: [],
      highlights: [],
      site_name: ''
    });
    setEditingBox(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (box: MysteryBox) => {
    setFormData({
      name: box.name,
      slug: box.slug,
      price: box.price,
      expected_value: box.expected_value,
      min_price: box.min_price,
      image_url: box.image_url || '',
      game: box.game || '',
      box_type: box.box_type || 'digital',
      odds_disclosed: box.odds_disclosed || 'Yes',
      verified: box.verified || false,
      provably_fair: box.provably_fair || false,
      operator_id: box.operator_id || null,
      categories: [], // Will be loaded from relationships
      highlights: Array.isArray(box.highlights) ? box.highlights : [],
      site_name: box.site_name || ''
    });
    setEditingBox(box);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Delete category associations first
      await supabase
        .from('mystery_box_categories')
        .delete()
        .eq('mystery_box_id', id);

      // Delete the mystery box
      const { error } = await supabase
        .from('mystery_boxes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Mystery box deleted successfully');
      fetchMysteryBoxes();
      setDeleteBoxId(null);
    } catch (error) {
      console.error('Error deleting mystery box:', error);
      toast.error('Failed to delete mystery box');
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({
      ...prev,
      name,
      slug
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { name: '', icon: '', rarity: '' }]
    }));
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => 
        i === index ? { ...highlight, [field]: value } : highlight
      )
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      <SEOHead 
        title="Mystery Boxes Management | Admin Dashboard"
        description="Manage mystery boxes, create new boxes, and organize box collections."
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mystery Boxes</h1>
            <p className="text-muted-foreground mt-2">
              Manage mystery boxes and their categories
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBox(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Mystery Box
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingBox ? 'Edit Mystery Box' : 'Add Mystery Box'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBox ? 'Update' : 'Create a new'} mystery box with details and categories.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Box Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Premium Knife Collection"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="premium-knife-collection"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="49.99"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expected_value">Expected Value ($)</Label>
                      <Input
                        id="expected_value"
                        type="number"
                        step="0.01"
                        value={formData.expected_value || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, expected_value: parseFloat(e.target.value) || null }))}
                        placeholder="57.50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="min_price">Min Prize Value ($)</Label>
                      <Input
                        id="min_price"
                        type="number"
                        step="0.01"
                        value={formData.min_price || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, min_price: parseFloat(e.target.value) || null }))}
                        placeholder="5.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="game">Game</Label>
                      <Input
                        id="game"
                        value={formData.game}
                        onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                        placeholder="CS2"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={formData.site_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                        placeholder="CSGORoll"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="box_type">Box Type</Label>
                      <Select value={formData.box_type} onValueChange={(value) => setFormData(prev => ({ ...prev, box_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="odds_disclosed">Odds Disclosed</Label>
                      <Select value={formData.odds_disclosed} onValueChange={(value) => setFormData(prev => ({ ...prev, odds_disclosed: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disclosure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="operator_id">Operator</Label>
                    <Select value={formData.operator_id || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, operator_id: value || null }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Operator</SelectItem>
                        {operators.map((operator) => (
                          <SelectItem key={operator.id} value={operator.id}>
                            {operator.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="verified"
                        checked={formData.verified}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, verified: !!checked }))}
                      />
                      <Label htmlFor="verified">Verified</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="provably_fair"
                        checked={formData.provably_fair}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, provably_fair: !!checked }))}
                      />
                      <Label htmlFor="provably_fair">Provably Fair</Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBox ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mystery boxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mystery Boxes ({filteredBoxes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading mystery boxes...</div>
            ) : filteredBoxes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No mystery boxes match your search.' : 'No mystery boxes found. Create your first one!'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Game</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBoxes.map((box) => (
                      <TableRow key={box.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {box.image_url && (
                              <img src={box.image_url} alt={box.name} className="w-10 h-10 rounded object-cover" />
                            )}
                            <div>
                              <div className="font-medium">{box.name}</div>
                              <div className="text-sm text-muted-foreground">{box.slug}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{box.game || 'N/A'}</TableCell>
                        <TableCell>${box.price}</TableCell>
                        <TableCell>{box.site_name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {box.verified && <Badge variant="secondary">Verified</Badge>}
                            {box.provably_fair && <Badge variant="outline">Fair</Badge>}
                            <Badge variant={box.is_active ? 'default' : 'destructive'}>
                              {box.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(box)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteBoxId(box.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Mystery Box</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{box.name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteBoxId(null)}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(box.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MysteryBoxes;
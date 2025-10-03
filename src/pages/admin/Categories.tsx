import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, RefreshCw, AlertTriangle, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useLiveCategories } from '@/hooks/useLiveCategories';
import { useCategories, CategoryFormData } from '@/hooks/useCategories';
import { generateUniqueOperatorSlug } from '@/lib/utils';
import { SEOHead } from '@/components/SEOHead';
import { toast } from 'sonner';

// Sortable Row Component
const SortableTableRow = ({ category, onEdit, onDelete }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            {category.logo_url && (
              <img 
                src={category.logo_url} 
                alt={category.name} 
                className="w-8 h-8 rounded object-cover"
              />
            )}
            <span className="font-medium">{category.name}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {category.slug}
        </code>
      </TableCell>
      <TableCell>
        {category.source === 'provider' ? (
          <Badge variant="default">Provider Only</Badge>
        ) : category.source === 'both' ? (
          <Badge variant="secondary">Manual + Provider</Badge>
        ) : (
          <Badge variant="outline">Manual Only</Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{category.box_count} boxes</Badge>
      </TableCell>
      <TableCell>
        {category.is_featured ? (
          <Badge variant="default">
            <Eye className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        ) : (
          <Badge variant="secondary">
            <EyeOff className="w-3 h-3 mr-1" />
            Regular
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(category)}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                <AlertDialogDescription>
                  {category.box_count > 0 ? (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-600">Warning: Category in use</p>
                        <p className="mt-1">This category is used by {category.box_count} mystery boxes from providers. Deleting it may affect categorization.</p>
                        <p className="mt-2">Are you sure you want to delete "{category.name}"?</p>
                      </div>
                    </div>
                  ) : (
                    `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(category.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

const Categories = () => {
  const { categories: liveCategories, loading, syncing, syncCategories, refetch } = useLiveCategories();
  const { createCategory, updateCategory, deleteCategory } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    logo_url: '',
    description_rich: '',
    display_order: 0,
    is_featured: false,
  });

  const filteredCategories = liveCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory, formData);
      } else {
        // Generate unique slug if not provided
        if (!formData.slug && formData.name) {
          const existingSlugs = liveCategories.map(c => c.slug);
          formData.slug = generateUniqueOperatorSlug(formData.name, existingSlugs);
        }
        await createCategory(formData);
      }
      
      resetForm();
      setShowDialog(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo_url: '',
      description_rich: '',
      display_order: 0,
      is_featured: false,
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      logo_url: category.logo_url || '',
      description_rich: category.description_rich || '',
      display_order: category.display_order,
      is_featured: category.is_featured,
    });
    setEditingCategory(category.id);
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteCategory(id);
    if (success) {
      await refetch();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredCategories.findIndex(cat => cat.id === active.id);
      const newIndex = filteredCategories.findIndex(cat => cat.id === over.id);

      const reordered = arrayMove(filteredCategories, oldIndex, newIndex);

      // Update display_order for all affected categories
      try {
        const updates = reordered.map((cat, index) => ({
          id: cat.id,
          display_order: index,
        }));

        // Batch update all categories
        for (const update of updates) {
          if (!update.id.startsWith('temp-')) {
            await updateCategory(update.id, { display_order: update.display_order });
          }
        }

        await refetch();
        toast.success('Category order updated');
      } catch (error) {
        toast.error('Failed to update category order');
      }
    }
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }));
  };

  return (
    <>
      <SEOHead 
        title="Categories Management | Admin Dashboard"
        description="Manage mystery box categories, create new categories, and organize taxonomy structure."
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Manage mystery box categories and taxonomy structure
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={syncCategories}
              disabled={syncing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync from Providers'}
            </Button>
          
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Category name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="category-slug"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    URL-friendly identifier (auto-generated from name)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description_rich}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_rich: e.target.value }))}
                    placeholder="Category description for SEO and archive pages"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured Category</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading categories...</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Box Count</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={filteredCategories.map(c => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredCategories.map((category) => (
                        <SortableTableRow
                          key={category.id}
                          category={category}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            )}
            
            {!loading && filteredCategories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No categories match your search.' : 'No categories created yet.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Categories;
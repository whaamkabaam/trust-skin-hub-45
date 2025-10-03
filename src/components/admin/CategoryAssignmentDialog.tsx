import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useProviderBoxCategories } from '@/hooks/useProviderBoxCategories';
import { useCategories } from '@/hooks/useCategories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface CategoryAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  box: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    site_name: string;
    categories?: Array<{ id: string; name: string }>;
  };
  provider: string;
  boxId: number;
  onUpdate?: () => void;
}

export function CategoryAssignmentDialog({
  open,
  onOpenChange,
  box,
  provider,
  boxId,
  onUpdate,
}: CategoryAssignmentDialogProps) {
  const { categories } = useCategories();
  const { loading, fetchBoxCategories, updateBoxCategories } = useProviderBoxCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [assignedCategories, setAssignedCategories] = useState<string[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (open) {
      loadAssignedCategories();
    }
  }, [open, provider, boxId]);

  const loadAssignedCategories = async () => {
    setInitialLoad(true);
    const overrides = await fetchBoxCategories(provider, boxId);
    setAssignedCategories(overrides.map(o => o.category_id));
    setInitialLoad(false);
  };

  const handleAddCategory = () => {
    if (selectedCategoryId && !assignedCategories.includes(selectedCategoryId)) {
      setAssignedCategories(prev => [...prev, selectedCategoryId]);
      setSelectedCategoryId('');
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setAssignedCategories(prev => prev.filter(id => id !== categoryId));
  };

  const handleSave = async () => {
    const success = await updateBoxCategories(provider, boxId, assignedCategories);
    if (success) {
      onUpdate?.();
      onOpenChange(false);
    }
  };

  const availableCategories = categories.filter(
    cat => !assignedCategories.includes(cat.id)
  );

  const assignedCategoryObjects = categories.filter(cat =>
    assignedCategories.includes(cat.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Categories</DialogTitle>
          <DialogDescription>
            Manually assign categories to this mystery box
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Box Details */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <img
              src={box.image_url}
              alt={box.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{box.name}</h3>
              <p className="text-sm text-muted-foreground">
                {box.site_name} • ${box.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Provider Category (Read-only) */}
          {box.categories && box.categories.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Provider Category
              </label>
              <div className="mt-2">
                <Badge variant="outline" className="opacity-60">
                  {box.categories[0].name}
                </Badge>
              </div>
            </div>
          )}

          {/* Assigned Manual Categories */}
          <div>
            <label className="text-sm font-medium">Manual Categories</label>
            {initialLoad ? (
              <div className="mt-2">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2 min-h-[40px]">
                {assignedCategoryObjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No manual categories assigned
                  </p>
                ) : (
                  assignedCategoryObjects.map(cat => (
                    <Badge key={cat.id} variant="secondary" className="gap-1">
                      {cat.name}
                      <button
                        onClick={() => handleRemoveCategory(cat.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Add Category */}
          <div>
            <label className="text-sm font-medium">Add Category</label>
            <div className="mt-2 flex gap-2">
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
                disabled={loading || availableCategories.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddCategory}
                disabled={!selectedCategoryId || loading}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Categories'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

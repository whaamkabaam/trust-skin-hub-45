import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, X, Tag, Database } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CategoryManagerProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  operatorId?: string;
  disabled?: boolean;
}

export function CategoryManager({ 
  selectedCategories, 
  onCategoriesChange, 
  operatorId,
  disabled = false 
}: CategoryManagerProps) {
  const { categories, loading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Convert category IDs to category names for display
  const selectedCategoryData = categories.filter(cat => 
    selectedCategories.includes(cat.slug)
  );

  const availableCategories = categories.filter(cat => 
    !selectedCategories.includes(cat.slug)
  );

  const handleAddCategory = () => {
    if (!selectedCategoryId) return;
    
    const category = categories.find(cat => cat.id === selectedCategoryId);
    if (!category) return;

    const updatedCategories = [...selectedCategories, category.slug];
    onCategoriesChange(updatedCategories);
    setSelectedCategoryId('');
    
    toast.success(`Added ${category.name} category`);
  };

  const handleRemoveCategory = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    const updatedCategories = selectedCategories.filter(slug => slug !== categorySlug);
    onCategoriesChange(updatedCategories);
    
    if (category) {
      toast.success(`Removed ${category.name} category`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading categories...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Categories
          <Badge variant="outline" className="ml-auto">
            {selectedCategories.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="category-select">Add Category</Label>
            <Select 
              value={selectedCategoryId} 
              onValueChange={setSelectedCategoryId}
              disabled={disabled || availableCategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category to add" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.logo_url && (
                        <img 
                          src={category.logo_url} 
                          alt={category.name}
                          className="w-4 h-4 rounded"
                        />
                      )}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAddCategory}
              disabled={disabled || !selectedCategoryId}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Selected Categories */}
        {selectedCategories.length > 0 ? (
          <div className="space-y-2">
            <Label>Selected Categories</Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategoryData.map((category) => (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {category.logo_url && (
                    <img 
                      src={category.logo_url} 
                      alt={category.name}
                      className="w-4 h-4 rounded"
                    />
                  )}
                  {category.name}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category.slug)}
                      className="ml-1 hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              No categories selected. Categories help organize and classify this operator.
            </AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground">
          Categories help users find operators by their primary focus areas like Mystery Boxes, Sports Betting, Casino Games, etc.
        </div>
      </CardContent>
    </Card>
  );
}
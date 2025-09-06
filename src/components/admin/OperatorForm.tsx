import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, Save } from 'lucide-react';
import { operatorSchema, type OperatorFormData } from '@/lib/validations';
import type { Tables } from '@/integrations/supabase/types';
import { useState, useCallback } from 'react';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { RichTextEditor } from './RichTextEditor';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveStateIndicator } from '@/components/SaveStateIndicator';

type Operator = Tables<'operators'>;

interface OperatorFormProps {
  initialData?: Operator | null;
  onSubmit: (data: OperatorFormData) => Promise<void>;
  onAutoSave?: (data: OperatorFormData) => Promise<void>;
  isLoading?: boolean;
  autoSaveEnabled?: boolean;
}

export function OperatorForm({ 
  initialData, 
  onSubmit, 
  onAutoSave, 
  isLoading, 
  autoSaveEnabled = true 
}: OperatorFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<OperatorFormData>({
    resolver: zodResolver(operatorSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      logo_url: initialData.logo_url || '',
      tracking_link: initialData.tracking_link || '',
      launch_year: initialData.launch_year || undefined,
      verdict: initialData.verdict || '',
      bonus_terms: initialData.bonus_terms || '',
      fairness_info: initialData.fairness_info || '',
      hero_image_url: initialData.hero_image_url || '',
      categories: (initialData.categories as string[]) || [],
      pros: (initialData.pros as string[]) || [],
      cons: (initialData.cons as string[]) || [],
      supported_countries: (initialData.supported_countries as string[]) || [],
      ratings: initialData.ratings as any || {
        overall: 0,
        trust: 0,
        value: 0,
        payments: 0,
        offering: 0,
        ux: 0,
        support: 0,
      },
      kyc_required: initialData.kyc_required || false,
      published: initialData.published || false,
    } : {
      categories: [],
      pros: [],
      cons: [],
      supported_countries: [],
      ratings: {
        overall: 0,
        trust: 0,
        value: 0,
        payments: 0,
        offering: 0,
        ux: 0,
        support: 0,
      },
      kyc_required: false,
      published: false,
    },
  });

  const ratings = watch('ratings');
  const categories = watch('categories');
  const pros = watch('pros');
  const cons = watch('cons');
  const countries = watch('supported_countries');
  const formData = watch();

  // Auto-save functionality
  const handleAutoSave = useCallback(async (data: OperatorFormData) => {
    if (onAutoSave) {
      await onAutoSave(data);
    }
  }, [onAutoSave]);

  const { saveState, lastSaved, forceSave } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: autoSaveEnabled && !!onAutoSave,
    storageKey: initialData?.id || 'new-operator'
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setValue('name', name);
    setValue('slug', generateSlug(name));
  };

  const handleFormSubmit = (data: OperatorFormData) => {
    // Filter out empty strings from arrays
    const cleanedData = {
      ...data,
      categories: data.categories.filter(c => c.trim() !== ''),
      pros: data.pros.filter(p => p.trim() !== ''),
      cons: data.cons.filter(c => c.trim() !== ''),
      supported_countries: data.supported_countries.filter(c => c.trim() !== ''),
    };
    return onSubmit(cleanedData);
  };

  const addArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries') => {
    const currentArray = watch(fieldName);
    setValue(fieldName, [...currentArray, '']);
  };

  const removeArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries', index: number) => {
    const currentArray = watch(fieldName);
    setValue(fieldName, currentArray.filter((_, i) => i !== index));
  };

  const updateArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries', index: number, value: string) => {
    const currentArray = watch(fieldName);
    setValue(fieldName, currentArray.map((item, i) => i === index ? value : item));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Operator name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="operator-slug"
              />
              {errors.slug && (
                <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFileUpload
              label="Operator Logo"
              currentUrl={watch('logo_url')}
              onUpload={(url) => setValue('logo_url', url)}
              accept="image/*"
            />
            <div>
              <Label htmlFor="tracking_link">Tracking Link</Label>
              <Input
                id="tracking_link"
                {...register('tracking_link')}
                placeholder="https://example.com/affiliate"
              />
              {errors.tracking_link && (
                <p className="text-sm text-destructive mt-1">{errors.tracking_link.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="launch_year">Launch Year</Label>
              <Input
                id="launch_year"
                type="number"
                {...register('launch_year', { valueAsNumber: true })}
                placeholder="2020"
              />
              {errors.launch_year && (
                <p className="text-sm text-destructive mt-1">{errors.launch_year.message}</p>
              )}
            </div>
          <EnhancedFileUpload
            label="Hero Image"
            currentUrl={watch('hero_image_url')}
            onUpload={(url) => setValue('hero_image_url', url)}
            accept="image/*"
          />
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ratings).map(([key, value]) => (
            <div key={key}>
              <Label className="capitalize">{key.replace('_', ' ')} Rating: {value}/10</Label>
              <Slider
                value={[value]}
                onValueChange={(values) => setValue(`ratings.${key as keyof typeof ratings}`, values[0])}
                max={10}
                step={0.1}
                className="mt-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={category}
                onChange={(e) => updateArrayItem('categories', index, e.target.value)}
                placeholder="Category name"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('categories', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('categories')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CardContent>
      </Card>

      {/* Pros and Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={pro}
                  onChange={(e) => updateArrayItem('pros', index, e.target.value)}
                  placeholder="Positive aspect"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('pros', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('pros')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pro
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={con}
                  onChange={(e) => updateArrayItem('cons', index, e.target.value)}
                  placeholder="Negative aspect"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem('cons', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('cons')}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Con
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Supported Countries */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Countries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {countries.map((country, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={country}
                onChange={(e) => updateArrayItem('supported_countries', index, e.target.value)}
                placeholder="Country name"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('supported_countries', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('supported_countries')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
        </CardContent>
      </Card>

      {/* Text Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Verdict</Label>
            <RichTextEditor
              value={watch('verdict') || ''}
              onChange={(value) => setValue('verdict', value)}
              placeholder="Overall verdict about the operator..."
            />
          </div>
          
          <div>
            <Label>Bonus Terms</Label>
            <RichTextEditor
              value={watch('bonus_terms') || ''}
              onChange={(value) => setValue('bonus_terms', value)}
              placeholder="Details about bonus terms and conditions..."
            />
          </div>
          
          <div>
            <Label>Fairness Information</Label>
            <RichTextEditor
              value={watch('fairness_info') || ''}
              onChange={(value) => setValue('fairness_info', value)}
              placeholder="Information about fairness and provability..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="kyc_required"
              checked={watch('kyc_required')}
              onCheckedChange={(checked) => setValue('kyc_required', checked)}
            />
            <Label htmlFor="kyc_required">KYC Required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={watch('published')}
              onCheckedChange={(checked) => setValue('published', checked)}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <SaveStateIndicator 
          saveState={saveState} 
          lastSaved={lastSaved}
          className="flex-1"
        />
        <div className="flex gap-2">
          {autoSaveEnabled && onAutoSave && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={forceSave}
              disabled={saveState === 'saving'}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Now
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Operator' : 'Create Operator'}
          </Button>
        </div>
      </div>
    </form>
  );
}
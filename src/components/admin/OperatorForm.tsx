import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';
import { operatorSchema, type OperatorFormData } from '@/lib/validations';
import type { Tables } from '@/integrations/supabase/types';
import { useState } from 'react';

type Operator = Tables<'operators'>;

interface OperatorFormProps {
  initialData?: Operator | null;
  onSubmit: (data: OperatorFormData) => Promise<void>;
  isLoading?: boolean;
}

export function OperatorForm({ initialData, onSubmit, isLoading }: OperatorFormProps) {
  const [categories, setCategories] = useState<string[]>(
    (initialData?.categories as string[]) || ['']
  );
  const [pros, setPros] = useState<string[]>(
    (initialData?.pros as string[]) || ['']
  );
  const [cons, setCons] = useState<string[]>(
    (initialData?.cons as string[]) || ['']
  );
  const [countries, setCountries] = useState<string[]>(
    (initialData?.supported_countries as string[]) || ['']
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('slug', generateSlug(name));
  };

  const handleFormSubmit = (data: OperatorFormData) => {
    // Filter out empty strings from arrays
    const cleanedData = {
      ...data,
      categories: categories.filter(c => c.trim() !== ''),
      pros: pros.filter(p => p.trim() !== ''),
      cons: cons.filter(c => c.trim() !== ''),
      supported_countries: countries.filter(c => c.trim() !== ''),
    };
    return onSubmit(cleanedData);
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
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
                {...register('name', { onChange: handleNameChange })}
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
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                {...register('logo_url')}
                placeholder="https://example.com/logo.png"
              />
              {errors.logo_url && (
                <p className="text-sm text-destructive mt-1">{errors.logo_url.message}</p>
              )}
            </div>
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
            <div>
              <Label htmlFor="hero_image_url">Hero Image URL</Label>
              <Input
                id="hero_image_url"
                {...register('hero_image_url')}
                placeholder="https://example.com/hero.jpg"
              />
              {errors.hero_image_url && (
                <p className="text-sm text-destructive mt-1">{errors.hero_image_url.message}</p>
              )}
            </div>
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
                onChange={(e) => updateArrayItem(setCategories, index, e.target.value)}
                placeholder="Category name"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem(setCategories, index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem(setCategories)}
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
                  onChange={(e) => updateArrayItem(setPros, index, e.target.value)}
                  placeholder="Positive aspect"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem(setPros, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem(setPros)}
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
                  onChange={(e) => updateArrayItem(setCons, index, e.target.value)}
                  placeholder="Negative aspect"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeArrayItem(setCons, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem(setCons)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Con
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Text Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="verdict">Verdict</Label>
            <Textarea
              id="verdict"
              {...register('verdict')}
              placeholder="Overall verdict about the operator"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="bonus_terms">Bonus Terms</Label>
            <Textarea
              id="bonus_terms"
              {...register('bonus_terms')}
              placeholder="Details about bonus terms and conditions"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="fairness_info">Fairness Information</Label>
            <Textarea
              id="fairness_info"
              {...register('fairness_info')}
              placeholder="Information about fairness and provability"
              rows={3}
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
              {...register('kyc_required')}
            />
            <Label htmlFor="kyc_required">KYC Required</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              {...register('published')}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Operator' : 'Create Operator'}
        </Button>
      </div>
    </form>
  );
}
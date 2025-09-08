import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Globe } from 'lucide-react';
import { operatorSchema, type OperatorFormData } from '@/lib/validations';
import type { Tables } from '@/integrations/supabase/types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useStaticContent } from '@/hooks/useStaticContent';
import { usePublishingState } from '@/hooks/usePublishingState';
import { toast } from '@/lib/toast';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { RichTextEditor } from './RichTextEditor';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveStateIndicator } from '@/components/SaveStateIndicator';
import { ContentScheduling } from '@/components/ContentScheduling';
import { BonusManager } from './BonusManager';
import { PaymentMethodsManager } from './PaymentMethodsManager';
import { SecurityManager } from './SecurityManager';
import { FAQManager } from './FAQManager';
import { ContentSectionManager } from './ContentSectionManager';
import { MediaAssetManager } from './MediaAssetManager';
import { PublishingDebugger } from './PublishingDebugger';
import { QuickPublishTest } from './QuickPublishTest';
import { useOperatorExtensions } from '@/hooks/useOperatorExtensions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormErrorBoundary } from './FormErrorBoundary';
import { ExtensionErrorBoundary } from './ExtensionErrorBoundary';
import { TabErrorBoundary } from './TabErrorBoundary';
import { AutoSaveErrorBoundary } from './AutoSaveErrorBoundary';

type Operator = Tables<'operators'>;

interface OperatorFormProps {
  initialData?: Operator | null;
  onSubmit: (data: OperatorFormData) => Promise<void>;
  onAutoSave?: (data: OperatorFormData) => Promise<void>;
  isLoading?: boolean;
  autoSaveEnabled?: boolean;
  publishingState?: boolean;
}

export function OperatorForm({ 
  initialData, 
  onSubmit, 
  onAutoSave, 
  isLoading, 
  autoSaveEnabled = true,
  publishingState = false
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
      publish_status: (initialData as any).publish_status || 'draft',
      // New extended fields
      site_type: (initialData as any)?.site_type || '',
      promo_code: (initialData as any)?.promo_code || '',
      verification_status: (initialData as any)?.verification_status || 'unverified',
      company_background: (initialData as any)?.company_background || '',
      performance_metrics: (initialData as any)?.performance_metrics || {},
      prize_info: (initialData as any)?.prize_info || {},
      shipping_info: (initialData as any)?.shipping_info || {},
      support_channels: ((initialData as any)?.support_channels as string[]) || [],
      community_links: (initialData as any)?.community_links || {},
      withdrawal_time_crypto: (initialData as any)?.withdrawal_time_crypto || '',
      withdrawal_time_skins: (initialData as any)?.withdrawal_time_skins || '',
      withdrawal_time_fiat: (initialData as any)?.withdrawal_time_fiat || '',
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
      publish_status: 'draft',
      // New extended fields
      site_type: '',
      promo_code: '',
      verification_status: 'unverified',
      company_background: '',
      performance_metrics: {},
      prize_info: {},
      shipping_info: {},
      support_channels: [],
      community_links: {},
      withdrawal_time_crypto: '',
      withdrawal_time_skins: '',
      withdrawal_time_fiat: '',
    },
  });

  const ratings = watch('ratings');
  const categories = watch('categories');
  const pros = watch('pros');
  const cons = watch('cons');
  const countries = watch('supported_countries');
  const supportChannels = watch('support_channels');
  const formData = watch();

  // Initialize operator extensions hook - use temporary ID for new operators
  const tempOperatorId = initialData?.id || `temp-${Date.now()}`;
  // Use the real operator ID if available, otherwise use temp ID
  const effectiveOperatorId = initialData?.id || tempOperatorId;
  
  const {
    bonuses,
    payments,
    features,
    security,
    faqs,
    saveBonuses,
    savePayments,
    saveFeatures,
    saveSecurity,
    saveFaqs,
    setExtensionActive,
    isExtensionActive
  } = useOperatorExtensions(effectiveOperatorId);

  // Auto-save functionality - NEVER triggers publishing
  const handleAutoSave = useCallback(async (data: OperatorFormData) => {
    if (onAutoSave && typeof onAutoSave === 'function') {
      try {
        // Ensure we're only saving form data, never triggering publish
        await onAutoSave(data);
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Silent failure for auto-save to prevent disrupting user experience
      }
    }
  }, [onAutoSave]);

  const { publishStaticContent, loading: publishLoading, error: publishError } = useStaticContent();
  const { isPublishing: globalIsPublishing, operatorId: publishingOperatorId } = usePublishingState();
  
  const { saveState, lastSaved, forceSave, pauseAutoSave } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: autoSaveEnabled && !!onAutoSave && !publishLoading && !publishingState && !isExtensionActive,
    storageKey: initialData?.id || 'new-operator'
  });

  // Enhanced interaction handlers for extension management
  const handleExtensionInteraction = useCallback((extensionType: string) => {
    console.log(`Starting interaction with ${extensionType} extension`);
    setExtensionActive(true);
    pauseAutoSave?.(15000); // Pause auto-save for 15 seconds
    
    // Auto-reset after 30 seconds to prevent getting stuck
    setTimeout(() => {
      setExtensionActive(false);
    }, 30000);
  }, [setExtensionActive, pauseAutoSave]);

  const handleExtensionSave = useCallback((extensionType: string) => {
    console.log(`Completed save for ${extensionType} extension`);
    setExtensionActive(false);
  }, [setExtensionActive]);

  // Stabilize extension manager props with static keys and enhanced error handling
  const stableExtensionProps = useMemo(() => ({
    bonuses: {
      key: 'bonuses-manager-stable',
      operatorId: effectiveOperatorId,
      bonuses,
      onSave: saveBonuses,
      disabled: publishLoading || publishingState,
      onInteractionStart: () => handleExtensionInteraction('bonuses')
    },
    payments: {
      key: 'payments-manager-stable',
      operatorId: effectiveOperatorId,
      payments,
      onSave: savePayments,
      disabled: publishLoading || publishingState,
      onInteractionStart: () => handleExtensionInteraction('payments')
    },
    security: {
      key: 'security-manager-stable',
      operatorId: effectiveOperatorId,
      security,
      onSave: saveSecurity,
      disabled: publishLoading || publishingState,
      onInteractionStart: () => handleExtensionInteraction('security')
    },
    faqs: {
      key: 'faqs-manager-stable',
      operatorId: effectiveOperatorId,
      faqs,
      onSave: saveFaqs,
      disabled: publishLoading || publishingState,
      onInteractionStart: () => handleExtensionInteraction('faqs')
    }
  }), [
    effectiveOperatorId,
    bonuses,
    payments,
    security,
    faqs,
    saveBonuses,
    savePayments,
    saveSecurity,
    saveFaqs,
    publishLoading,
    publishingState,
    handleExtensionInteraction
  ]);


  // Simplified status change handler that prevents race conditions
  const handleStatusChange = useCallback((status: string, scheduledDate?: string) => {
    try {
      console.log('ContentScheduling status change:', { status, scheduledDate, operatorId: initialData?.id });
      
      // Handle all status changes through form values only - no direct submission
      if (status === 'scheduled' && scheduledDate) {
        setValue('publish_status' as any, status);
        setValue('scheduled_publish_at' as any, scheduledDate);
      } else {
        setValue('publish_status' as any, status);
        if (status === 'published') {
          setValue('published', true);
        }
        if (scheduledDate) {
          setValue('scheduled_publish_at' as any, scheduledDate);
        }
      }
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
    }
  }, [setValue, initialData?.id]);

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
    // Filter out empty strings from arrays and clean timestamp fields
    const cleanedData = {
      ...data,
      categories: data.categories.filter(c => c.trim() !== ''),
      pros: data.pros.filter(p => p.trim() !== ''),
      cons: data.cons.filter(c => c.trim() !== ''),
      supported_countries: data.supported_countries.filter(c => c.trim() !== ''),
      // Convert empty strings to null for timestamp fields
      scheduled_publish_at: data.scheduled_publish_at === '' ? null : data.scheduled_publish_at,
    };
    return onSubmit(cleanedData);
  };

  const addArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries' | 'support_channels') => {
    const currentArray = watch(fieldName);
    setValue(fieldName, [...currentArray, '']);
  };

  const removeArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries' | 'support_channels', index: number) => {
    const currentArray = watch(fieldName);
    setValue(fieldName, currentArray.filter((_, i) => i !== index));
  };

  const updateArrayItem = (fieldName: 'categories' | 'pros' | 'cons' | 'supported_countries' | 'support_channels', index: number, value: string) => {
    const currentArray = watch(fieldName);
    setValue(fieldName, currentArray.map((item, i) => i === index ? value : item));
  };

  return (
    <FormErrorBoundary>
      <AutoSaveErrorBoundary onReset={() => setExtensionActive(false)}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
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
            <div>
              <Label htmlFor="site_type">Site Type</Label>
              <Select
                value={watch('site_type') || ''}
                onValueChange={(value) => setValue('site_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select site type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="case_opening">Case Opening</SelectItem>
                  <SelectItem value="casino">Casino</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="mystery_box">Mystery Box</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo_code">Promo Code</Label>
              <Input
                id="promo_code"
                {...register('promo_code')}
                placeholder="WELCOME2024"
              />
            </div>
            <div>
              <Label htmlFor="verification_status">Verification Status</Label>
              <Select
                value={watch('verification_status') || 'unverified'}
                onValueChange={(value) => setValue('verification_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFileUpload
              label="Hero Image"
              currentUrl={watch('hero_image_url')}
              onUpload={(url) => setValue('hero_image_url', url)}
              accept="image/*"
            />
          </div>

          <div>
            <Label>Company Background</Label>
            <RichTextEditor
              value={watch('company_background') || ''}
              onChange={(value) => setValue('company_background', value)}
              placeholder="Background information about the company..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Times */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Processing Times</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="withdrawal_time_crypto">Crypto Withdrawals</Label>
              <Input
                id="withdrawal_time_crypto"
                {...register('withdrawal_time_crypto')}
                placeholder="e.g., Instant, 1-24 hours"
              />
            </div>
            <div>
              <Label htmlFor="withdrawal_time_skins">Skin Withdrawals</Label>
              <Input
                id="withdrawal_time_skins"
                {...register('withdrawal_time_skins')}
                placeholder="e.g., Instant, 1-24 hours"
              />
            </div>
            <div>
              <Label htmlFor="withdrawal_time_fiat">Fiat Withdrawals</Label>
              <Input
                id="withdrawal_time_fiat"
                {...register('withdrawal_time_fiat')}
                placeholder="e.g., 1-3 business days"
              />
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

      {/* Support Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Support Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportChannels.map((channel, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={channel}
                onChange={(e) => updateArrayItem('support_channels', index, e.target.value)}
                placeholder="e.g., 24/7 Live Chat, Email Support"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeArrayItem('support_channels', index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => addArrayItem('support_channels')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Support Channel
          </Button>
        </CardContent>
      </Card>

      {/* Extension Managers are now handled in their respective tabs */}

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
      {/* Content */}
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

        </TabsContent>

        <TabsContent value="bonuses" className="space-y-6">
          <ExtensionErrorBoundary extensionName="Bonuses">
            <BonusManager 
              key={stableExtensionProps.bonuses.key}
              {...stableExtensionProps.bonuses} 
            />
          </ExtensionErrorBoundary>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <ExtensionErrorBoundary extensionName="Payments">
            <PaymentMethodsManager 
              key={stableExtensionProps.payments.key}
              {...stableExtensionProps.payments} 
            />
          </ExtensionErrorBoundary>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ExtensionErrorBoundary extensionName="Security">
            <SecurityManager 
              key={stableExtensionProps.security.key}
              {...stableExtensionProps.security} 
            />
          </ExtensionErrorBoundary>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <ExtensionErrorBoundary extensionName="FAQs">
            <FAQManager 
              key={stableExtensionProps.faqs.key}
              {...stableExtensionProps.faqs} 
            />
          </ExtensionErrorBoundary>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">SEO management coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {initialData?.id ? (
            <ContentSectionManager operatorId={initialData.id} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Please save the operator first to manage content.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          {initialData?.id ? (
            <MediaAssetManager operatorId={initialData.id} />
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Please save the operator first to manage media assets.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          {initialData?.id ? (
            <div className="space-y-6">
              <QuickPublishTest />
              <PublishingDebugger operatorId={initialData.id} />
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Please save the operator first to access debugging tools.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Content Scheduling */}
      <ContentScheduling
        key={`scheduling-${initialData?.id || 'new'}`}
        publishStatus={watch('publish_status') || 'draft'}
        publishedAt={(initialData as any)?.published_at || undefined}
        scheduledPublishAt={(watch() as any).scheduled_publish_at || undefined}
        onStatusChange={handleStatusChange}
      />

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
               Save Draft
             </Button>
           )}
           <Button type="submit" disabled={isLoading}>
             {isLoading ? 'Saving...' : initialData ? 'Update Operator' : 'Create Operator'}
           </Button>
         </div>
       </div>

      </form>
      </AutoSaveErrorBoundary>
    </FormErrorBoundary>
  );
}
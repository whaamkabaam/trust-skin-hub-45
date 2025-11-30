import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Globe, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { operatorSchema, type OperatorFormData } from '@/lib/validations';
import type { Tables } from '@/integrations/supabase/types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useStaticContent } from '@/hooks/useStaticContent';
import { usePublishingState } from '@/hooks/usePublishingState';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedFileUpload } from './EnhancedFileUpload';
import { StableRichTextEditor } from './StableRichTextEditor';
import { useAutoSave } from '@/hooks/useAutoSave';
import { SaveStateIndicator } from '@/components/SaveStateIndicator';
import { ContentScheduling } from '@/components/ContentScheduling';
import { BonusManager } from './BonusManager';

import { CategoryManager } from './CategoryManager';
import { EnhancedPaymentMethodsManager } from './EnhancedPaymentMethodsManager';
import { SecurityManager } from './SecurityManager';
import { FAQManager } from './FAQManager';
import { MasterContentEditor, type ContentSection } from './MasterContentEditor';
import { MediaAssetManager } from './MediaAssetManager';
import { OperatorSmartImport } from './OperatorSmartImport';
import { PublishingDebugger } from './PublishingDebugger';
import { QuickPublishTest } from './QuickPublishTest';
import { DataIntegrityChecker } from './DataIntegrityChecker';
import { useOperatorExtensions } from '@/hooks/useOperatorExtensions';
import { useStableTempId } from '@/hooks/useStableTempId';
import { useFormAutoSave } from '@/hooks/useFormAutoSave';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FormErrorBoundary } from './FormErrorBoundary';
import { ExtensionErrorBoundary } from './ExtensionErrorBoundary';
import { TabErrorBoundary } from './TabErrorBoundary';
import { AutoSaveErrorBoundary } from './AutoSaveErrorBoundary';
import { PublishingErrorBoundary } from './PublishingErrorBoundary';
import { usePublishingQueue } from '@/hooks/usePublishingQueue';

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
  const form = useForm<OperatorFormData & { content_sections: ContentSection[] }>({
    resolver: zodResolver(operatorSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      logo_url: initialData.logo_url || '',
      tracking_link: initialData.tracking_link || '',
      launch_year: initialData.launch_year || undefined,
      hero_image_url: initialData.hero_image_url || '',
      categories: (initialData.categories as string[]) || [],
      payment_methods: [],
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
      performance_metrics: (initialData as any)?.performance_metrics || {},
      prize_info: (initialData as any)?.prize_info || {},
      shipping_info: (initialData as any)?.shipping_info || {},
      support_channels: ((initialData as any)?.support_channels as string[]) || [],
      community_links: (initialData as any)?.community_links || {},
      withdrawal_time_crypto: (initialData as any)?.withdrawal_time_crypto || '',
      withdrawal_time_skins: (initialData as any)?.withdrawal_time_skins || '',
      withdrawal_time_fiat: (initialData as any)?.withdrawal_time_fiat || '',
      content_sections: [],
    } : {
      name: '',
      slug: '',
      logo_url: '',
      tracking_link: '',
      launch_year: undefined,
      hero_image_url: '',
      categories: [],
      payment_methods: [],
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
      performance_metrics: {},
      prize_info: {},
      shipping_info: {},
      support_channels: [],
      community_links: {},
      withdrawal_time_crypto: '',
      withdrawal_time_skins: '',
      withdrawal_time_fiat: '',
      content_sections: [],
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid, dirtyFields }, getValues, control } = form;

  // Use field array for content sections to ensure persistence
  const { fields: contentSectionFields, append: appendSection, remove: removeSection, update: updateSection } = useFieldArray({
    control,
    name: 'content_sections',
  });

  const ratings = watch('ratings');
  const categories = watch('categories');
  const paymentMethodsData = watch('payment_methods');
  const pros = watch('pros');
  const cons = watch('cons');
  const countries = watch('supported_countries');
  const supportChannels = watch('support_channels');
  const contentSections = watch('content_sections');
  const formData = watch();

  // Load content sections for existing operators
  useEffect(() => {
    const loadContentSections = async () => {
      if (initialData?.id && !initialData.id.startsWith('temp-')) {
        try {
          const { data, error } = await supabase
            .from('content_sections')
            .select('*')
            .eq('operator_id', initialData.id)
            .order('order_number');

          if (error) throw error;
          
          // Set content sections in form
          if (data && data.length > 0) {
            setValue('content_sections', data);
          }
        } catch (error) {
          console.error('Error loading content sections:', error);
        }
      }
    };

    loadContentSections();
  }, [initialData?.id, setValue]);

  // Load payment methods for existing operators
  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (initialData?.id && !initialData.id.startsWith('temp-')) {
        try {
          const { data, error } = await supabase
            .from('operator_payment_methods')
            .select('*')
            .eq('operator_id', initialData.id);

          if (error) throw error;
          
          // Transform to the format expected by EnhancedPaymentMethodsManager
          if (data && data.length > 0) {
            const paymentMethodDetails = data.map((item: any) => ({
              payment_method_id: item.payment_method_id,
              method_type: item.method_type || 'both',
              minimum_amount: item.minimum_amount ?? undefined,
              maximum_amount: item.maximum_amount ?? undefined,
              fee_percentage: item.fee_percentage ?? undefined,
              fee_fixed: item.fee_fixed ?? undefined,
              processing_time: item.processing_time || 'Instant',
              is_available: item.is_available !== false
            }));
            setValue('payment_methods', paymentMethodDetails);
          }
        } catch (error) {
          console.error('Error loading payment methods:', error);
        }
      }
    };

    loadPaymentMethods();
  }, [initialData?.id, setValue]);

  // Use stable temporary ID for new operators to prevent data loss during navigation
  const effectiveOperatorId = useStableTempId(initialData?.id);
  
  // Load saved form data for new operators
  const { loadSavedFormData, clearSavedFormData } = useFormAutoSave(effectiveOperatorId);
  
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

  // Track draft restoration to prevent spam notifications
  const [draftRestored, setDraftRestored] = useState(false);

  // Load saved form data on mount for new operators
  useEffect(() => {
    if (!initialData && effectiveOperatorId.startsWith('temp-') && !draftRestored) {
      const savedData = loadSavedFormData();
      if (savedData && Object.keys(savedData).some(key => 
        savedData[key] && savedData[key] !== '' && savedData[key] !== 0
      )) {
        // Populate form fields with saved data
        Object.entries(savedData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            setValue(key as any, value);
          }
        });
        setDraftRestored(true);
        toast.success('Draft restored from your previous session');
      }
    }
  }, [initialData, effectiveOperatorId, loadSavedFormData, setValue, draftRestored]);

  // Auto-save functionality - NEVER triggers publishing
  const handleAutoSave = useCallback(async (data: OperatorFormData) => {
    if (onAutoSave && typeof onAutoSave === 'function') {
      try {
        // Content sections are already included in form data
        await onAutoSave(data);
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Silent failure for auto-save to prevent disrupting user experience
      }
    }
  }, [onAutoSave]);

  // Handle content sections changes using form state
  const handleContentSectionsChange = useCallback((sections: ContentSection[]) => {
    setValue('content_sections', sections, { shouldDirty: true });
  }, [setValue]);

  // Save content sections independently 
  const saveContentSections = useCallback(async () => {
    if (effectiveOperatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before saving content sections');
      return;
    }

    const sections = getValues('content_sections');
    
    try {
      // Delete existing sections for this operator
      await supabase
        .from('content_sections')
        .delete()
        .eq('operator_id', effectiveOperatorId);

      // Insert new sections
      if (sections.length > 0) {
        const sectionsToInsert = sections.map((section, index) => ({
          operator_id: effectiveOperatorId,
          section_key: section.section_key,
          heading: section.heading,
          rich_text_content: section.rich_text_content,
          order_number: index,
        }));

        const { error } = await supabase
          .from('content_sections')
          .insert(sectionsToInsert);

        if (error) throw error;
      }
      
      toast.success('Content sections saved successfully');
    } catch (error) {
      console.error('Error saving content sections:', error);
      toast.error('Failed to save content sections');
      throw error;
    }
  }, [effectiveOperatorId, getValues]);

  const { publishStaticContent, loading: publishLoading, error: publishError } = useStaticContent();
  const { isPublishing: globalIsPublishing, operatorId: publishingOperatorId } = usePublishingState();
  
  const { saveState, lastSaved, forceSave, pauseAutoSave } = useAutoSave({
    data: formData,
    onSave: handleAutoSave,
    enabled: autoSaveEnabled && !!onAutoSave && !publishLoading && !publishingState && !isExtensionActive,
    storageKey: `temp-form-data-${effectiveOperatorId}`
  });

  // Simplified extension interaction handlers
  const handleExtensionInteraction = useCallback((extensionType: string) => {
    setExtensionActive(true);
    pauseAutoSave?.(10000); // Pause auto-save for 10 seconds
  }, [setExtensionActive, pauseAutoSave]);

  const handleExtensionSave = useCallback((extensionType: string) => {
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

  const handleFormSubmit = async (data: OperatorFormData) => {
    // Show validation errors summary if form is invalid
    if (!isValid) {
      const errorFields = Object.keys(errors);
      toast.error(`Please fix the following errors: ${errorFields.join(', ')}`);
      return;
    }
    
    // Filter out empty strings from arrays and clean timestamp fields
    const cleanedData = {
      ...data,
      categories: data.categories.filter(c => c.trim() !== ''),
      pros: data.pros.filter(p => p.trim() !== ''),
      cons: data.cons.filter(c => c.trim() !== ''),
      supported_countries: data.supported_countries.filter(c => c.trim() !== ''),
      // Convert empty strings to null for timestamp fields
      scheduled_publish_at: data.scheduled_publish_at === '' ? null : data.scheduled_publish_at,
      // Ensure content sections are included in the submission
      content_sections: data.content_sections || [],
    };
    
    // Wrap publishing operations in error boundary
    if (cleanedData.published === true) {
      console.log('Publishing operation initiated - disabling extension interactions');
      setExtensionActive(false); // Force stop all extension interactions
      pauseAutoSave?.(60000); // Pause auto-save for 1 minute during publishing
    }
    
    try {
      return await onSubmit(cleanedData);
    } catch (error) {
      // Re-enable extension interactions if publishing fails
      setExtensionActive(false);
      throw error;
    }
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

  // Form validation summary
  const getValidationSummary = () => {
    const errorCount = Object.keys(errors).length;
    const totalFields = ['name', 'slug', 'logo_url', 'tracking_link', 'launch_year'];
    const completedFields = totalFields.filter(field => {
      const value = watch(field as any);
      return value && String(value).trim() !== '';
    }).length;

    return { errorCount, completedFields, totalFields: totalFields.length };
  };

  return (
    <PublishingErrorBoundary 
      operatorId={effectiveOperatorId} 
      onReset={() => setExtensionActive(false)}
    >
      <FormErrorBoundary>
        <AutoSaveErrorBoundary onReset={() => setExtensionActive(false)}>
          {/* Save State Indicator */}
          <div className="flex justify-between items-center mb-4">
            <SaveStateIndicator 
              saveState={saveState} 
              lastSaved={lastSaved} 
              isDraft={!initialData && effectiveOperatorId.startsWith('temp-')}
            />
            {!initialData && effectiveOperatorId.startsWith('temp-') && (
              <Badge variant="outline" className="text-blue-600">
                New Operator Draft
              </Badge>
            )}
          </div>

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <Alert className="mb-4 border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <strong>Please fix the following errors:</strong>
                <ul className="mt-2 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="text-sm">
                      • {field}: {String(error?.message || 'Invalid value')}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Review Content</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="import">Smart Import</TabsTrigger>
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
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Name 
                    <span className="text-destructive">*</span>
                    {field.value?.trim() && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                      placeholder="Enter operator name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    URL Slug 
                    <span className="text-destructive">*</span>
                    {field.value?.trim() && !errors.slug && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="operator-url-slug"
                      className={errors.slug ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Auto-generated from name. Use lowercase letters, numbers, and dashes only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedFileUpload
              label="Operator Logo"
              currentUrl={watch('logo_url')}
              onUpload={(url) => setValue('logo_url', url)}
              accept="image/*"
            />
            <FormField
              control={control}
              name="tracking_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Tracking Link
                    {field.value?.trim() && !errors.tracking_link && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/affiliate"
                      className={errors.tracking_link ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional affiliate tracking URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="launch_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Launch Year
                    {field.value && !errors.launch_year && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseInt(value));
                      }}
                      placeholder="2020"
                      min="1990"
                      max={new Date().getFullYear()}
                      className={errors.launch_year ? 'border-destructive' : ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Year the operator was founded (1990-{new Date().getFullYear()})
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </CardContent>
      </Card>

      {/* Withdrawal Times - Moved to Payments Tab */}

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
      <CategoryManager
        selectedCategories={categories}
        onCategoriesChange={(newCategories) => setValue('categories', newCategories)}
        operatorId={effectiveOperatorId}
        disabled={publishLoading || globalIsPublishing}
      />

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
            <EnhancedPaymentMethodsManager
              selectedPaymentMethods={form.watch('payment_methods') || []}
              onPaymentMethodsChange={(methods) => form.setValue('payment_methods', methods)}
              operatorId={effectiveOperatorId}
              disabled={isLoading || publishingState}
            />
            
            {/* Withdrawal Processing Times */}
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Processing Times</CardTitle>
                <FormDescription>
                  Specify typical processing times for different withdrawal methods
                </FormDescription>
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
                    <FormDescription className="mt-1 text-xs">
                      Typical time for cryptocurrency withdrawals
                    </FormDescription>
                  </div>
                  <div>
                    <Label htmlFor="withdrawal_time_skins">Skin Withdrawals</Label>
                    <Input
                      id="withdrawal_time_skins"
                      {...register('withdrawal_time_skins')}
                      placeholder="e.g., Instant, 0-2 days"
                    />
                    <FormDescription className="mt-1 text-xs">
                      Typical time for CS2/gaming skin withdrawals
                    </FormDescription>
                  </div>
                  <div>
                    <Label htmlFor="withdrawal_time_fiat">Fiat Withdrawals</Label>
                    <Input
                      id="withdrawal_time_fiat"
                      {...register('withdrawal_time_fiat')}
                      placeholder="e.g., 1-3 business days"
                    />
                    <FormDescription className="mt-1 text-xs">
                      Typical time for traditional currency withdrawals
                    </FormDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <TabErrorBoundary tabName="Review Content">
            <MasterContentEditor 
              operatorId={effectiveOperatorId}
              sections={contentSections || []}
              onSectionsChange={handleContentSectionsChange}
              onSave={saveContentSections}
              saveState={saveState}
              disabled={publishLoading || publishingState}
            />
          </TabErrorBoundary>
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

        <TabsContent value="import" className="space-y-6">
          <OperatorSmartImport 
            onDataExtracted={(data) => {
              // Apply extracted data to form with improved validation and debug logging
              console.log('Applying extracted data:', data);
              console.log('Current form values before update:', getValues());
              
              // Basic info - with explicit validation and detailed logging
              if (data.name) {
                console.log('Setting name:', data.name);
                setValue('name', data.name, { shouldValidate: true });
              }
              if (data.slug) {
                console.log('Setting slug:', data.slug);
                setValue('slug', data.slug, { shouldValidate: true });
              }
              if (data.site_type) {
                console.log('Setting site_type:', data.site_type);
                setValue('site_type', data.site_type);
              }
              if (data.launch_year) {
                console.log('Setting launch_year:', data.launch_year);
                setValue('launch_year', data.launch_year);
              }
              if (data.verification_status) {
                console.log('Setting verification_status:', data.verification_status);
                setValue('verification_status', data.verification_status);
              }
              if (data.promo_code) {
                console.log('Setting promo_code:', data.promo_code);
                setValue('promo_code', data.promo_code);
              }
              if (data.categories) {
                console.log('Setting categories:', data.categories);
                setValue('categories', data.categories);
              }
              if (data.pros) {
                console.log('Setting pros:', data.pros);
                setValue('pros', data.pros);
              }
              if (data.cons) {
                console.log('Setting cons:', data.cons);
                setValue('cons', data.cons);
              }
              if (data.kyc_required !== undefined) {
                console.log('Setting kyc_required:', data.kyc_required);
                setValue('kyc_required', data.kyc_required);
              }
              if (data.withdrawal_time_crypto) {
                console.log('Setting withdrawal_time_crypto:', data.withdrawal_time_crypto);
                setValue('withdrawal_time_crypto', data.withdrawal_time_crypto);
              }
              if (data.withdrawal_time_skins) {
                console.log('Setting withdrawal_time_skins:', data.withdrawal_time_skins);
                setValue('withdrawal_time_skins', data.withdrawal_time_skins);
              }
              if (data.withdrawal_time_fiat) {
                console.log('Setting withdrawal_time_fiat:', data.withdrawal_time_fiat);
                setValue('withdrawal_time_fiat', data.withdrawal_time_fiat);
              }
              if (data.support_channels?.length > 0) {
                console.log('Setting support_channels:', data.support_channels);
                setValue('support_channels', data.support_channels);
              }

              // Ratings with better validation
              if (data.ratings) {
                console.log('Setting ratings:', data.ratings);
                const currentRatings = getValues('ratings') as any || {};
                setValue('ratings', {
                  overall: data.ratings.overall || currentRatings.overall || 0,
                  trust: data.ratings.trust || currentRatings.trust || 0,
                  ux: data.ratings.ux || currentRatings.ux || 0,
                  support: data.ratings.support || currentRatings.support || 0,
                  payments: data.ratings.payments || currentRatings.payments || 0,
                  offering: data.ratings.offering || currentRatings.offering || 0,
                  value: data.ratings.value || currentRatings.value || 0
                }, { shouldValidate: true });
              }

              // Log final form values after update
              setTimeout(() => {
                console.log('Form values after update:', getValues());
                console.log('Form validation errors:', form.formState.errors);
              }, 100);

              // Store extracted bonuses, payments, etc. in localStorage for extension managers
              if (data.bonuses?.length > 0) {
                localStorage.setItem(`operator-bonuses-${effectiveOperatorId}`, JSON.stringify(data.bonuses));
                console.log(`Stored ${data.bonuses.length} bonuses for operator ${effectiveOperatorId}`);
              }
              if (data.payments?.length > 0) {
                localStorage.setItem(`operator-payments-${effectiveOperatorId}`, JSON.stringify(data.payments));
                console.log(`Stored ${data.payments.length} payments for operator ${effectiveOperatorId}`);
              }
              if (data.features?.length > 0) {
                localStorage.setItem(`operator-features-${effectiveOperatorId}`, JSON.stringify(data.features));
                console.log(`Stored ${data.features.length} features for operator ${effectiveOperatorId}`);
              }
              if (data.faqs?.length > 0) {
                localStorage.setItem(`operator-faqs-${effectiveOperatorId}`, JSON.stringify(data.faqs));
                console.log(`Stored ${data.faqs.length} FAQs for operator ${effectiveOperatorId}`);
              }
              if (data.security && Object.keys(data.security).length > 0) {
                localStorage.setItem(`operator-security-${effectiveOperatorId}`, JSON.stringify(data.security));
                console.log(`Stored security data for operator ${effectiveOperatorId}`);
              }

              // Trigger extension managers to refresh with new data
              setTimeout(() => {
                // Force re-render of extension managers by triggering state update
                const event = new CustomEvent('extensionDataUpdated', { 
                  detail: { operatorId: effectiveOperatorId } 
                });
                window.dispatchEvent(event);
              }, 100);

              toast.success('Extracted data applied! Name, slug, and ratings are set. Check Bonuses, Payments, Features, and FAQ tabs for imported content.');
            }}
            currentOperatorData={getValues()}
          />
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <DataIntegrityChecker operatorId={effectiveOperatorId} />
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
    </Form>
    </AutoSaveErrorBoundary>
  </FormErrorBoundary>
  </PublishingErrorBoundary>
  );
}
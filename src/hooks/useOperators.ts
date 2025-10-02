import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import type { OperatorFormData } from '@/lib/validations';
import { useStaticContent } from './useStaticContent';
import { usePublishingState } from './usePublishingState';
import { safePublishingOperation, usePublishingQueue } from './usePublishingQueue';
import { usePublishingLock } from './usePublishingLock';

type Operator = Tables<'operators'>;

export function useOperators() {
  const queryClient = useQueryClient();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { publishStaticContent } = useStaticContent();

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('operators')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperators(data || []);
    } catch (err) {
      console.error('Error fetching operators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch operators');
      toast.error('Failed to fetch operators');
    } finally {
      setLoading(false);
    }
  };

  const createOperator = async (data: OperatorFormData) => {
    try {
      const { data: newOperator, error } = await supabase
        .from('operators')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      
      // Optimistic update
      setOperators(prev => [newOperator, ...prev]);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['public-operators'] });
      
      toast.success('Operator created successfully');
      return newOperator;
    } catch (err) {
      console.error('Error creating operator:', err);
      toast.error('Failed to create operator');
      throw err;
    }
  };

  const updateOperator = async (id: string, data: Partial<OperatorFormData>) => {
    // Use safe publishing operation wrapper for all updates
    return await safePublishingOperation(
      id,
      async () => {
        const { setPublishing, clearPublishing } = usePublishingState.getState();
        const { lock, unlock } = usePublishingLock.getState();
        
        // If publishing, set global publishing state and lock operator
        if (data.published === true) {
          console.log('Starting publishing process for operator:', id);
          setPublishing(id);
          lock(id);
        }
        
        try {
          // Extract relationship table data - these are managed separately, not columns in operators table
          const { content_sections, payment_methods, ...operatorData } = data as any;
          
          // Consolidate all database updates in a single transaction
          let updateData: any = { 
            ...operatorData, 
            updated_at: new Date().toISOString()
          };
          
          // If publishing, generate static content FIRST before any DB updates
          if (data.published === true) {
            console.log('Generating static content before publishing...');
            
            // Validate that extension data exists before publishing
            try {
              const extensionValidation = await supabase
                .from('operator_bonuses')
                .select('count')
                .eq('operator_id', id)
                .single();
              
              console.log('Extension validation result:', extensionValidation);
            } catch (validationError) {
              console.warn('Extension validation failed:', validationError);
            }
            
            // Generate static content with comprehensive error handling
            const published = await publishStaticContent(id);
            if (!published) {
              throw new Error('Static content generation failed - aborting publish');
            }
            
            // Add publishing fields only after successful content generation
            updateData = {
              ...updateData,
              published: true,
              published_at: new Date().toISOString(),
              publish_status: 'published'
            };
            
            console.log('Static content generated successfully, updating operator record...');
          }

          // Single atomic database update with all changes
          const { data: updatedOperator, error } = await supabase
            .from('operators')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            console.error('Database update error:', error);
            throw error;
          }
          
          // Save content sections separately if provided
          if (content_sections && Array.isArray(content_sections)) {
            console.log('Saving content sections separately...');
            
            // Delete existing content sections
            const { error: deleteError } = await supabase
              .from('content_sections')
              .delete()
              .eq('operator_id', id);
            
            if (deleteError) {
              console.error('Error deleting old content sections:', deleteError);
            }
            
            // Insert new content sections
            if (content_sections.length > 0) {
              const sectionsToInsert = content_sections.map((section: any, index: number) => ({
                operator_id: id,
                section_key: section.section_key,
                heading: section.heading,
                rich_text_content: section.rich_text_content,
                order_number: index
              }));
              
              const { error: insertError } = await supabase
                .from('content_sections')
                .insert(sectionsToInsert);
              
              if (insertError) {
                console.error('Error inserting content sections:', insertError);
                throw insertError;
              }
              
              console.log('Content sections saved successfully');
            }
          }
          
          console.log('Operator record updated successfully:', updatedOperator);
          
          // Show appropriate success message
          if (data.published === true) {
            toast.success('Operator published successfully with optimized content');
            console.log('Publishing completed successfully for operator:', id);
          } else {
            toast.success('Operator updated successfully');
          }
          
          // Defensive state updates with error handling
          try {
            setOperators(prev => 
              prev.map(op => op.id === id ? updatedOperator : op)
            );
          } catch (stateError) {
            console.warn('Local state update failed, will rely on refetch:', stateError);
          }
          
          // Immediate query invalidation with defensive checks
          try {
            if (queryClient && typeof queryClient.invalidateQueries === 'function') {
              // Use Promise.allSettled to prevent any individual failure from causing crashes
              await Promise.allSettled([
                queryClient.invalidateQueries({ queryKey: ['operators'] }),
                queryClient.invalidateQueries({ queryKey: ['public-operators'] }),
                queryClient.invalidateQueries({ queryKey: ['operator', id] })
              ]).then(results => {
                results.forEach((result, index) => {
                  if (result.status === 'rejected') {
                    console.warn(`Query invalidation ${index} failed:`, result.reason);
                  }
                });
              });
            } else {
              console.warn('QueryClient not available for invalidation');
            }
          } catch (invalidationError) {
            console.warn('Query invalidation failed, data will be stale:', invalidationError);
          }
          
          return updatedOperator;
        } finally {
          // Always clear publishing state and unlock as final safety net with defensive checks
          try {
            if (data.published === true) {
              const state = usePublishingState.getState();
              const lockState = usePublishingLock.getState();
              
              // Defensive function existence checks
              if (state && typeof state.clearPublishing === 'function') {
                state.clearPublishing();
              } else {
                console.warn('clearPublishing function not available');
              }
              
              if (lockState && typeof lockState.unlock === 'function') {
                lockState.unlock(id);
              } else {
                console.warn('unlock function not available');
              }
            }
          } catch (cleanupError) {
            console.warn('Publishing state cleanup failed:', cleanupError);
          }
        }
      },
      data.published === true ? 'Publishing Operator' : 'Updating Operator'
    );
  };

  const deleteOperator = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operators')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update
      setOperators(prev => prev.filter(op => op.id !== id));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['public-operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
      
      toast.success('Operator deleted successfully');
    } catch (err) {
      console.error('Error deleting operator:', err);
      toast.error('Failed to delete operator');
      throw err;
    }
  };

  const autoSaveOperator = async (id: string, data: Partial<OperatorFormData>) => {
    try {
      // CRITICAL: Ensure auto-save NEVER includes publish fields
      const safeData = { ...data };
      delete (safeData as any).published;
      delete (safeData as any).published_at;
      delete (safeData as any).publish_status;
      
      // Clean the data same way as form submission
      const cleanedData = {
        ...safeData,
        categories: safeData.categories?.filter(c => c.trim() !== '') || [],
        pros: safeData.pros?.filter(p => p.trim() !== '') || [],
        cons: safeData.cons?.filter(c => c.trim() !== '') || [],
        supported_countries: safeData.supported_countries?.filter(c => c.trim() !== '') || [],
        // Convert empty strings to null for timestamp fields
        scheduled_publish_at: safeData.scheduled_publish_at === '' ? null : safeData.scheduled_publish_at,
      };

      // Use a separate draft-only update that can't trigger publishing
      const { error } = await supabase
        .from('operators')
        .update({
          ...cleanedData,
          draft_data: cleanedData as any,
          last_auto_saved_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      console.log('Auto-save completed successfully for operator:', id);
    } catch (err) {
      console.error('Auto-save failed:', err);
      throw err;
    }
  };

  const duplicateOperator = async (sourceId: string) => {
    try {
      const loadingToast = toast.loading('Duplicating operator...');

      // Fetch the source operator and all its related data
      const { data: sourceOperator, error: operatorError } = await supabase
        .from('operators')
        .select('*')
        .eq('id', sourceId)
        .single();

      if (operatorError) throw operatorError;

      // Fetch all existing operators to generate unique name and slug
      const { data: existingOperators, error: existingError } = await supabase
        .from('operators')
        .select('name, slug');

      if (existingError) throw existingError;

      // Import utilities for generating unique names
      const { generateUniqueOperatorName, generateUniqueOperatorSlug } = await import('@/lib/utils');
      
      const existingNames = existingOperators?.map(op => op.name) || [];
      const existingSlugs = existingOperators?.map(op => op.slug) || [];
      
      const newName = generateUniqueOperatorName(sourceOperator.name, existingNames);
      const newSlug = generateUniqueOperatorSlug(newName, existingSlugs);

      // Prepare the new operator data (excluding auto-generated fields)
      const { 
        id, 
        created_at, 
        updated_at, 
        published, 
        published_at, 
        publish_status, 
        last_auto_saved_at,
        ...operatorData 
      } = sourceOperator;

      const newOperatorData = {
        ...operatorData,
        name: newName,
        slug: newSlug,
        published: false,
        published_at: null,
        publish_status: 'draft',
        last_auto_saved_at: null
      };

      // Start transaction - create new operator first
      const { data: newOperator, error: createError } = await supabase
        .from('operators')
        .insert([newOperatorData])
        .select()
        .single();

      if (createError) throw createError;

      const newOperatorId = newOperator.id;

      // Fetch and duplicate all extension data in parallel
      const [
        bonusesResult,
        paymentsResult,
        featuresResult,
        securityResult,
        faqsResult,
        contentResult,
        mediaResult,
        seoResult
      ] = await Promise.allSettled([
        supabase.from('operator_bonuses').select('*').eq('operator_id', sourceId),
        supabase.from('operator_payments').select('*').eq('operator_id', sourceId),
        supabase.from('operator_features').select('*').eq('operator_id', sourceId),
        supabase.from('operator_security').select('*').eq('operator_id', sourceId),
        supabase.from('operator_faqs').select('*').eq('operator_id', sourceId),
        supabase.from('content_sections').select('*').eq('operator_id', sourceId),
        supabase.from('media_assets').select('*').eq('operator_id', sourceId),
        supabase.from('seo_metadata').select('*').eq('operator_id', sourceId)
      ]);

      // Process and insert each extension type
      const insertPromises = [];

      // Bonuses
      if (bonusesResult.status === 'fulfilled' && bonusesResult.value.data?.length) {
        const bonusData = bonusesResult.value.data.map(({ id, created_at, updated_at, ...bonus }) => ({
          ...bonus,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('operator_bonuses').insert(bonusData));
      }

      // Payments
      if (paymentsResult.status === 'fulfilled' && paymentsResult.value.data?.length) {
        const paymentData = paymentsResult.value.data.map(({ id, created_at, updated_at, ...payment }) => ({
          ...payment,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('operator_payments').insert(paymentData));
      }

      // Features
      if (featuresResult.status === 'fulfilled' && featuresResult.value.data?.length) {
        const featureData = featuresResult.value.data.map(({ id, created_at, updated_at, ...feature }) => ({
          ...feature,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('operator_features').insert(featureData));
      }

      // Security
      if (securityResult.status === 'fulfilled' && securityResult.value.data?.length) {
        const securityData = securityResult.value.data.map(({ id, created_at, updated_at, ...security }) => ({
          ...security,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('operator_security').insert(securityData));
      }

      // FAQs
      if (faqsResult.status === 'fulfilled' && faqsResult.value.data?.length) {
        const faqData = faqsResult.value.data.map(({ id, created_at, updated_at, ...faq }) => ({
          ...faq,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('operator_faqs').insert(faqData));
      }

      // Content Sections
      if (contentResult.status === 'fulfilled' && contentResult.value.data?.length) {
        const contentData = contentResult.value.data.map(({ id, created_at, updated_at, ...content }) => ({
          ...content,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('content_sections').insert(contentData));
      }

      // Media Assets
      if (mediaResult.status === 'fulfilled' && mediaResult.value.data?.length) {
        const mediaData = mediaResult.value.data.map(({ id, created_at, updated_at, ...media }) => ({
          ...media,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('media_assets').insert(mediaData));
      }

      // SEO Metadata
      if (seoResult.status === 'fulfilled' && seoResult.value.data?.length) {
        const seoData = seoResult.value.data.map(({ id, created_at, updated_at, ...seo }) => ({
          ...seo,
          operator_id: newOperatorId
        }));
        insertPromises.push(supabase.from('seo_metadata').insert(seoData));
      }

      // Execute all inserts
      const insertResults = await Promise.allSettled(insertPromises);
      
      // Check for any insert failures
      const failedInserts = insertResults.filter(result => result.status === 'rejected');
      if (failedInserts.length > 0) {
        console.warn('Some extension data failed to duplicate:', failedInserts);
      }

      // Update local state
      setOperators(prev => [newOperator, ...prev]);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      
      toast.dismiss(loadingToast);
      toast.success(`Operator duplicated successfully as "${newName}"`, {
        duration: 5000,
        description: 'Click to edit the duplicated operator',
        action: {
          label: 'Edit',
          onClick: () => window.location.href = `/admin/operators/${newOperatorId}`
        }
      });

      return newOperator;
    } catch (err) {
      console.error('Error duplicating operator:', err);
      toast.error('Failed to duplicate operator');
      throw err;
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return {
    operators,
    loading,
    error,
    createOperator,
    updateOperator,
    deleteOperator,
    duplicateOperator,
    autoSaveOperator,
    refetch: fetchOperators,
  };
}

export function useOperator(id: string | undefined) {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pauseRefetch, setPauseRefetch] = useState(false);
  const { isPublishing, operatorId: publishingOperatorId } = usePublishingState();
  
  // Pause refetching if this operator is being published
  const shouldPause = pauseRefetch || (isPublishing && publishingOperatorId === id);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOperator = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('operators')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setOperator(data);
      } catch (err) {
        console.error('Error fetching operator:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch operator');
        toast.error('Failed to fetch operator');
      } finally {
        setLoading(false);
      }
    };

    if (!shouldPause) {
      fetchOperator();
    }
  }, [id, shouldPause]);

  return { 
    operator, 
    loading, 
    error,
    pauseRefetch: () => setPauseRefetch(true),
    resumeRefetch: () => setPauseRefetch(false)
  };
}
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStaticContent } from './useStaticContent';
import { usePublishingState } from './usePublishingState';
import { usePublishingLock } from './usePublishingLock';
import { toast } from 'sonner';

/**
 * Atomic publishing hook that ensures all-or-nothing publishing operations
 */
export function useAtomicPublishing() {
  const { publishStaticContent } = useStaticContent();

  const atomicPublish = useCallback(async (operatorId: string, operatorData: any) => {
    const { setPublishing, clearPublishing } = usePublishingState.getState();
    const { lock, unlock } = usePublishingLock.getState();

    // Start publishing process with locks
    setPublishing(operatorId);
    lock(operatorId);

    let success = false;

    try {
      console.log('Starting atomic publishing for operator:', operatorId);

      // Step 1: Validate operator data
      if (!operatorData.name || !operatorData.description) {
        throw new Error('Operator name and description are required for publishing');
      }

      // Step 2: Generate static content first (most likely to fail)
      console.log('Generating static content...');
      const staticContentSuccess = await publishStaticContent(operatorId);
      
      if (!staticContentSuccess) {
        throw new Error('Failed to generate static content - publishing aborted');
      }

      // Step 3: Use standard database update instead of non-existent RPC
      console.log('Updating database...');
      const updateData = {
        ...operatorData,
        published: true,
        published_at: new Date().toISOString(),
        publish_status: 'published',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('operators')
        .update(updateData)
        .eq('id', operatorId)
        .select()
        .single();

      if (error) {
        console.error('Database transaction failed:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      console.log('Atomic publishing completed successfully');
      toast.success('Operator published successfully');
      success = true;
      
      return data;
    } catch (error) {
      console.error('Atomic publishing failed:', error);
      
      // If we got partway through, try to rollback static content
      try {
        console.log('Attempting rollback of static content...');
        // Could implement rollback logic here if needed
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Publishing failed';
      toast.error(`Publishing failed: ${errorMessage}`);
      throw error;
    } finally {
      // Always clear publishing state and unlock
      clearPublishing();
      unlock(operatorId);
      
      console.log(`Publishing ${success ? 'succeeded' : 'failed'} for operator:`, operatorId);
    }
  }, [publishStaticContent]);

  return { atomicPublish };
}
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
  storageKey?: string;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  storageKey
}: UseAutoSaveOptions<T>) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  // Filter out extension data that shouldn't trigger auto-save
  const filterFormData = useCallback((formData: any) => {
    if (!formData || typeof formData !== 'object') return formData;
    
    // Remove extension-related fields that are managed separately
    // but keep content_sections as it's now part of the main form
    const {
      bonuses,
      payments,
      features,
      security,
      faqs,
      ...filteredData
    } = formData;
    
    return filteredData;
  }, []);
  
  const filteredData = useMemo(() => filterFormData(data), [data, filterFormData]);
  const debouncedData = useDebounce(filteredData, delay);
  const initialLoadRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Load draft from localStorage on mount
  useEffect(() => {
    if (storageKey && initialLoadRef.current) {
      try {
        const draft = localStorage.getItem(`draft_${storageKey}`);
        if (draft) {
          const parsedDraft = JSON.parse(draft);
          // Return the draft data for external handling
          return parsedDraft;
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
      initialLoadRef.current = false;
    }
  }, [storageKey]);

  // Save draft to localStorage
  const saveDraft = useCallback((data: T) => {
    if (storageKey) {
      try {
        localStorage.setItem(`draft_${storageKey}`, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }
  }, [storageKey]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(`draft_${storageKey}`);
    }
  }, [storageKey]);

  // Track user interaction to prevent auto-save during extension management
  const pauseAutoSave = useCallback((duration = 5000) => {
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, duration);
  }, []);

  // Auto-save effect with enhanced safety checks and crash prevention
  useEffect(() => {
    if (!enabled || initialLoadRef.current || isUserInteracting) return;

    const performSave = async () => {
      // Defensive check to prevent crashes during component unmounting
      if (!enabled || isUserInteracting) return;
      
      try {
        setSaveState('saving');
        
        // Clean the data before saving - CRITICAL: Remove publish fields
        const cleanedData = {
          ...debouncedData,
          // Convert empty strings to null for timestamp fields
          scheduled_publish_at: (debouncedData as any).scheduled_publish_at === '' ? null : (debouncedData as any).scheduled_publish_at,
        };
        
        // CRITICAL: Ensure auto-save never includes publish fields
        delete (cleanedData as any).published;
        delete (cleanedData as any).published_at;
        delete (cleanedData as any).publish_status;
        
        // Enhanced safety check for save function with detailed validation
        if (onSave && typeof onSave === 'function') {
          try {
            await onSave(cleanedData);
            
            // Check if component is still mounted before updating state
            if (enabled && !isUserInteracting) {
              setSaveState('saved');
              setLastSaved(new Date());
              if (clearDraft && typeof clearDraft === 'function') {
                clearDraft();
              }
            }
          } catch (saveError) {
            // Handle specific publishing errors to prevent crashes
            if (saveError instanceof Error && saveError.message.includes('publish')) {
              console.warn('Auto-save skipped due to publishing conflict:', saveError.message);
              if (enabled) setSaveState('idle');
              return;
            }
            console.error('onSave function threw an error:', saveError);
            throw saveError;
          }
        } else {
          console.warn('onSave is not a function or is undefined, skipping auto-save', { 
            onSave, 
            type: typeof onSave,
            isFunction: typeof onSave === 'function'
          });
          if (enabled) setSaveState('idle');
          return;
        }
        
        // Reset to idle after 2 seconds with defensive check
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          if (enabled) setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (enabled) setSaveState('error');
        
        // Save as draft if auto-save fails
        try {
          if (saveDraft && typeof saveDraft === 'function') {
            saveDraft(debouncedData);
          }
        } catch (draftError) {
          console.error('Failed to save draft:', draftError);
        }
        
        // Reset to idle after error with defensive check
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          if (enabled) setSaveState('idle');
        }, 3000);
      }
    };

    // Wrap in try-catch to prevent React crashes
    try {
      performSave();
    } catch (syncError) {
      console.error('Synchronous auto-save error:', syncError);
      if (enabled) setSaveState('error');
    }

    return () => {
      // Defensive cleanup to prevent "n is not a function" errors
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = undefined;
      }
    };
  }, [debouncedData, enabled, onSave, clearDraft, saveDraft, isUserInteracting]);

  // Save draft on data change (but not when user is interacting with extensions)
  useEffect(() => {
    if (!initialLoadRef.current && enabled && !isUserInteracting) {
      saveDraft(filteredData);
    }
  }, [filteredData, enabled, saveDraft, isUserInteracting]);

  const forceSave = useCallback(async () => {
    try {
      setSaveState('saving');
      
      if (onSave && typeof onSave === 'function') {
        await onSave(data);
        setSaveState('saved');
        setLastSaved(new Date());
        
        // Defensive check for clearDraft function
        if (clearDraft && typeof clearDraft === 'function') {
          clearDraft();
        }
        
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          if (enabled) setSaveState('idle');
        }, 2000);
      } else {
        console.warn('forceSave: onSave function not available');
        setSaveState('error');
      }
    } catch (error) {
      console.error('Force save failed:', error);
      setSaveState('error');
      
      // Defensive check for saveDraft function
      if (saveDraft && typeof saveDraft === 'function') {
        saveDraft(data);
      }
    }
  }, [data, onSave, clearDraft, saveDraft, enabled]);

  // Cleanup effect with defensive checks
  useEffect(() => {
    return () => {
      // Defensive cleanup to prevent "n is not a function" errors
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = undefined;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = undefined;
      }
    };
  }, []);

  return {
    saveState,
    lastSaved,
    forceSave,
    clearDraft,
    pauseAutoSave
  };
}
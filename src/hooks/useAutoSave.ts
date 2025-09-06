import { useCallback, useEffect, useRef, useState } from 'react';
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
  const debouncedData = useDebounce(data, delay);
  const initialLoadRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

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

  // Auto-save effect
  useEffect(() => {
    if (!enabled || initialLoadRef.current) return;

    const performSave = async () => {
      try {
        setSaveState('saving');
        
        // Clean the data before saving
        const cleanedData = {
          ...debouncedData,
          // Convert empty strings to null for timestamp fields
          scheduled_publish_at: (debouncedData as any).scheduled_publish_at === '' ? null : (debouncedData as any).scheduled_publish_at,
        };
        
        await onSave(cleanedData);
        setSaveState('saved');
        setLastSaved(new Date());
        clearDraft();
        
        // Reset to idle after 2 seconds
        saveTimeoutRef.current = setTimeout(() => {
          setSaveState('idle');
        }, 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveState('error');
        // Save as draft if auto-save fails
        saveDraft(debouncedData);
      }
    };

    performSave();

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debouncedData, enabled, onSave, clearDraft, saveDraft]);

  // Save draft on data change
  useEffect(() => {
    if (!initialLoadRef.current && enabled) {
      saveDraft(data);
    }
  }, [data, enabled, saveDraft]);

  const forceSave = useCallback(async () => {
    try {
      setSaveState('saving');
      await onSave(data);
      setSaveState('saved');
      setLastSaved(new Date());
      clearDraft();
      
      saveTimeoutRef.current = setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    } catch (error) {
      console.error('Force save failed:', error);
      setSaveState('error');
      saveDraft(data);
    }
  }, [data, onSave, clearDraft, saveDraft]);

  return {
    saveState,
    lastSaved,
    forceSave,
    clearDraft
  };
}
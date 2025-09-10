import { useEffect } from 'react';
import type { OperatorFormData } from '@/lib/validations';

/**
 * Hook for loading and managing auto-saved form data for new operators
 */
export function useFormAutoSave(tempId: string) {
  // Load saved form data from localStorage
  const loadSavedFormData = (): Partial<OperatorFormData> | null => {
    try {
      const saved = localStorage.getItem(`temp-form-data-${tempId}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading saved form data:', error);
      return null;
    }
  };

  // Clear saved form data
  const clearSavedFormData = () => {
    localStorage.removeItem(`temp-form-data-${tempId}`);
  };

  return {
    loadSavedFormData,
    clearSavedFormData
  };
}
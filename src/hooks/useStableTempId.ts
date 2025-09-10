import { useRef, useEffect } from 'react';

/**
 * Hook that provides a stable temporary ID for new operators
 * The ID persists across component re-renders and browser sessions
 */
export function useStableTempId(realId?: string): string {
  const stableIdRef = useRef<string | null>(null);
  
  // If we have a real ID, always use that
  if (realId) {
    return realId;
  }
  
  // Generate or retrieve stable temp ID
  if (!stableIdRef.current) {
    // Try to get existing temp ID from localStorage
    const existingTempId = localStorage.getItem('new-operator-temp-id');
    
    if (existingTempId) {
      stableIdRef.current = existingTempId;
    } else {
      // Generate new stable temp ID
      const newTempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      stableIdRef.current = newTempId;
      localStorage.setItem('new-operator-temp-id', newTempId);
    }
  }
  
  // Clean up temp ID when component unmounts (if we still don't have a real ID)
  useEffect(() => {
    return () => {
      if (!realId) {
        // Keep the temp ID in localStorage for session persistence
        // It will be cleaned up when operator is actually saved
      }
    };
  }, [realId]);
  
  return stableIdRef.current;
}

/**
 * Clear the stable temp ID from localStorage
 * Should be called when operator is successfully saved to database
 */
export function clearStableTempId(): void {
  localStorage.removeItem('new-operator-temp-id');
}

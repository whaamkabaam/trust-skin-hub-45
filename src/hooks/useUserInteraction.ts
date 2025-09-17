import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook to detect user interaction and pause auto-save appropriately
 */
export function useUserInteraction() {
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Detect typing activity
  const handleKeyDown = useCallback(() => {
    isTypingRef.current = true;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing to false after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
    }, 3000);
  }, []);
  
  // Add global keydown listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [handleKeyDown]);
  
  // Check if user is currently typing
  const isTyping = useCallback(() => isTypingRef.current, []);
  
  return { isTyping };
}

import { useState, useEffect, useCallback } from 'react';

export const useScrollState = () => {
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEnd = useCallback(() => {
    setIsScrolling(false);
  }, []);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const throttledScrollHandler = () => {
      handleScroll();
      
      // Clear existing timer
      clearTimeout(scrollTimer);
      
      // Set new timer to detect scroll end
      scrollTimer = setTimeout(() => {
        handleScrollEnd();
      }, 150); // 150ms delay after scroll stops
    };

    // Use passive listeners for better performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(scrollTimer);
    };
  }, [handleScroll, handleScrollEnd]);

  return isScrolling;
};

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
  showIndicators?: boolean;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  className,
  maxHeight = 'max-h-60',
  showIndicators = true
}) => {
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // Show top gradient if scrolled down
    setShowTopGradient(scrollTop > 10);
    
    // Show bottom gradient if there's more content below
    setShowBottomGradient(scrollTop < scrollHeight - clientHeight - 10);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    // Initial check
    checkScrollPosition();

    // Add scroll listener
    scrollElement.addEventListener('scroll', checkScrollPosition);
    
    // Add resize observer to check when content changes
    const resizeObserver = new ResizeObserver(checkScrollPosition);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', checkScrollPosition);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {/* Top gradient indicator */}
      {showIndicators && showTopGradient && (
        <div className="scroll-indicator-top opacity-100" />
      )}
      
      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={cn(
          'overflow-y-auto overflow-x-visible scrollbar-webkit px-2',
          maxHeight,
          className
        )}
        style={{ 
          overflowClipMargin: '64px'
        }}
      >
        {children}
      </div>
      
      {/* Bottom gradient indicator */}
      {showIndicators && showBottomGradient && (
        <div className="scroll-indicator-bottom opacity-100" />
      )}
    </div>
  );
};
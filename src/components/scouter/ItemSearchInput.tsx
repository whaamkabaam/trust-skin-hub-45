
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Target, X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface ItemSearchInputProps {
  searchQuery: string;
  searchResults: string[];
  onSearchChange: (query: string) => void;
  onItemSelect: (item: string) => void;
  onClearSearch: () => void;
}

const ItemSearchInput: React.FC<ItemSearchInputProps> = ({
  searchQuery,
  searchResults,
  onSearchChange,
  onItemSelect,
  onClearSearch
}) => {
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show dropdown when there are results and input is focused
  useEffect(() => {
    setIsDropdownOpen(searchResults.length > 0 && searchQuery.length >= 2);
  }, [searchResults, searchQuery]);

  // Handle item selection
  const handleItemSelect = (item: string) => {
    onItemSelect(item);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchResults.length > 0 && searchQuery.length >= 2) {
      setIsDropdownOpen(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  console.log('ItemSearchInput render:', {
    searchQuery,
    searchResultsCount: searchResults.length,
    isDropdownOpen,
    isMobile
  });

  return (
    <div className="w-full">
      <div className="relative">
        {/* Desktop tooltip */}
        {!isMobile && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help p-2">
                    <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3 bg-white border-purple-200 shadow-xl z-50">
                  <div className="space-y-1">
                    <div className="font-semibold text-purple-600 text-sm">Hunt for specific items</div>
                    <p className="text-xs">Search for any item and get ranked boxes to win it most cost-effectively.</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        
        {/* Mobile search icon */}
        {isMobile && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <Input
          ref={inputRef}
          placeholder={isMobile ? "Hunt for an item..." : "Hunt for a specific item... (e.g., 'Nike Air Jordan')"}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleInputFocus}
          className={`
            ${isMobile ? 'pl-12 pr-12 h-12' : 'pl-12 pr-12 py-3'} 
            text-base bg-white border-purple-300 
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 
            rounded-xl shadow-sm
          `}
        />
        
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2 
              hover:bg-gray-100 rounded-full 
              ${isMobile ? 'p-2' : 'p-1'} 
              transition-colors z-10
            `}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown - Contained within parent */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full mt-2 bg-white border border-purple-200 rounded-xl shadow-lg"
          >
            <ScrollArea className="h-48 w-full">
              <div className="p-2">
                {searchResults.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    onClick={() => handleItemSelect(item)}
                    className={`
                      px-3 py-3 hover:bg-purple-50 cursor-pointer 
                      rounded-lg mb-1 last:mb-0
                      flex items-center gap-3 transition-colors
                      ${isMobile ? 'min-h-[48px]' : 'min-h-[44px]'}
                      active:bg-purple-100
                    `}
                  >
                    <Target className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-800 text-sm leading-tight flex-1 break-words">
                      {item}
                    </span>
                  </div>
                ))}
                
                {/* No results message */}
                {searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="px-3 py-6 text-center text-gray-500 text-sm">
                    No items found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemSearchInput;

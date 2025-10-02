
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { SortOption, SORT_OPTIONS } from '@/types/filters';
import { useIsMobile } from '@/hooks/use-mobile';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const isMobile = useIsMobile();
  const currentSort = SORT_OPTIONS.find(option => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`bg-white/60 border-purple-300 text-gray-800 transition-all duration-300 hover:bg-white hover:border-purple-400 focus:border-purple-400 focus:ring-purple-400 ${
            isMobile ? 'w-full min-h-[48px] justify-between' : ''
          }`}
        >
          <div className="flex items-center">
            <ArrowUpDown className={`${isMobile ? 'h-5 w-5 mr-2' : 'h-4 w-4 mr-2'}`} />
            <span className={isMobile ? 'truncate' : ''}>
              {isMobile ? (currentSort?.label.split(' ')[0] || 'Sort') : (currentSort?.label || 'Sort by')}
            </span>
          </div>
          <ChevronDown className={`${isMobile ? 'h-5 w-5 ml-2 flex-shrink-0' : 'h-4 w-4 ml-2'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-white border-purple-200 shadow-xl z-50"
        style={{ 
          minWidth: isMobile ? '200px' : '56px',
          backgroundColor: 'white',
          zIndex: 50
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer ${
              value === option.value ? 'bg-purple-50 text-purple-700 font-medium' : ''
            } ${isMobile ? 'min-h-[44px] text-base' : ''}`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;

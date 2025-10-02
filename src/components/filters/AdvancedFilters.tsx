
import React from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import RangeFilter from './RangeFilter';

interface AdvancedFiltersProps {
  jackpotValueRange: { min: number; max: number };
  onJackpotValueRangeChange: (range: { min: number; max: number }) => void;
  itemCountRange: { min: number; max: number };
  onItemCountRangeChange: (range: { min: number; max: number }) => void;
  maxJackpotValue: number;
  maxItemCount: number;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  jackpotValueRange,
  onJackpotValueRangeChange,
  itemCountRange,
  onItemCountRangeChange,
  maxJackpotValue,
  maxItemCount
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = 
    jackpotValueRange.min !== 0 || 
    jackpotValueRange.max !== maxJackpotValue ||
    itemCountRange.min !== 0 || 
    itemCountRange.max !== maxItemCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <h3 className="font-medium text-gray-900">Advanced Filters</h3>
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Jackpot Item Value Range</h4>
          <RangeFilter
            title=""
            min={0}
            max={maxJackpotValue}
            value={jackpotValueRange}
            onChange={onJackpotValueRangeChange}
            formatLabel={(v) => `$${v.toLocaleString()}`}
            step={10}
            presetButtons={[
              {
                label: "High Value >$1000",
                action: () => onJackpotValueRangeChange({
                  min: 1000,
                  max: maxJackpotValue
                })
              },
              {
                label: "Premium >$5000",
                action: () => onJackpotValueRangeChange({
                  min: 5000,
                  max: maxJackpotValue
                })
              }
            ]}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Total Item Count</h4>
          <RangeFilter
            title=""
            min={0}
            max={maxItemCount}
            value={itemCountRange}
            onChange={onItemCountRangeChange}
            formatLabel={(v) => `${v} items`}
            step={1}
            presetButtons={[
              {
                label: "Large Boxes >50",
                action: () => onItemCountRangeChange({
                  min: 50,
                  max: maxItemCount
                })
              },
              {
                label: "Mega Boxes >100",
                action: () => onItemCountRangeChange({
                  min: 100,
                  max: maxItemCount
                })
              }
            ]}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AdvancedFilters;

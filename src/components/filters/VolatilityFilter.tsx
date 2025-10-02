
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import RangeFilter from './RangeFilter';

interface VolatilityFilterProps {
  selectedBuckets: ('Low' | 'Medium' | 'High')[];
  onBucketsChange: (buckets: ('Low' | 'Medium' | 'High')[]) => void;
  percentageRange: { min: number; max: number };
  onPercentageRangeChange: (range: { min: number; max: number }) => void;
}

const VolatilityFilter: React.FC<VolatilityFilterProps> = ({
  selectedBuckets,
  onBucketsChange,
  percentageRange,
  onPercentageRangeChange
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const buckets: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];

  const handleBucketToggle = (bucket: 'Low' | 'Medium' | 'High') => {
    if (selectedBuckets.includes(bucket)) {
      onBucketsChange(selectedBuckets.filter(b => b !== bucket));
    } else {
      onBucketsChange([...selectedBuckets, bucket]);
    }
  };

  // Check if range has been modified from default (0 to max)
  const isRangeActive = percentageRange.min !== 0 || percentageRange.max !== 100;
  const isActive = selectedBuckets.length > 0 || isRangeActive;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <h3 className="font-medium text-gray-900">Volatility</h3>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {selectedBuckets.length > 0 
                ? `${selectedBuckets.length} bucket${selectedBuckets.length > 1 ? 's' : ''}`
                : 'Range'
              }
            </span>
          )}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Volatility Level</h4>
          <div className="grid grid-cols-3 gap-2">
            {buckets.map((bucket) => (
              <label
                key={bucket}
                className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${
                  selectedBuckets.includes(bucket) ? 'bg-purple-50 border border-purple-200' : ''
                }`}
              >
                <Checkbox
                  checked={selectedBuckets.includes(bucket)}
                  onCheckedChange={() => handleBucketToggle(bucket)}
                />
                <span className="text-sm font-medium">{bucket}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Exact Percentage Range</h4>
          <RangeFilter
            title=""
            min={0}
            max={100}
            value={percentageRange}
            onChange={onPercentageRangeChange}
            formatLabel={(v) => `${v}%`}
            step={1}
            presetButtons={[
              {
                label: "Low Risk (0-30%)",
                action: () => onPercentageRangeChange({ min: 0, max: 30 })
              },
              {
                label: "Medium Risk (30-60%)",
                action: () => onPercentageRangeChange({ min: 30, max: 60 })
              },
              {
                label: "High Risk (60%+)",
                action: () => onPercentageRangeChange({ min: 60, max: 100 })
              }
            ]}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default VolatilityFilter;

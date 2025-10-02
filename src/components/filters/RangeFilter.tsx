
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
  formatLabel?: (value: number) => string;
  presetButtons?: { label: string; action: () => void }[];
  step?: number;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  title,
  min,
  max,
  value,
  onChange,
  formatLabel = (v) => v.toString(),
  presetButtons = [],
  step = 1
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [localMin, setLocalMin] = React.useState(value.min.toString());
  const [localMax, setLocalMax] = React.useState(value.max.toString());

  React.useEffect(() => {
    setLocalMin(value.min.toString());
    setLocalMax(value.max.toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    // Ensure values never go below the minimum bound (especially for EV which should never be negative)
    const adjustedMin = Math.max(min, newValue[0]);
    const adjustedMax = Math.max(min, newValue[1]);
    onChange({ min: adjustedMin, max: adjustedMax });
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMin(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMax(e.target.value);
  };

  const handleInputBlur = () => {
    // Ensure values never go below the minimum bound (especially for EV which should never be negative)
    const minVal = Math.max(min, Math.min(parseFloat(localMin) || min, max));
    const maxVal = Math.min(max, Math.max(parseFloat(localMax) || max, min));
    const finalMax = Math.max(minVal, maxVal);
    onChange({ min: minVal, max: finalMax });
  };

  const isActive = value.min !== min || value.max !== max;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {formatLabel(value.min)} - {formatLabel(value.max)}
            </span>
          )}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4">
        <div className="px-2">
          <Slider
            value={[value.min, value.max]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1 block">Min</label>
            <Input
              type="number"
              value={localMin}
              onChange={handleMinInputChange}
              onBlur={handleInputBlur}
              className="text-sm"
              min={min}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-600 mb-1 block">Max</label>
            <Input
              type="number"
              value={localMax}
              onChange={handleMaxInputChange}
              onBlur={handleInputBlur}
              className="text-sm"
              min={min}
            />
          </div>
        </div>
        {presetButtons.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presetButtons.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={preset.action}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RangeFilter;

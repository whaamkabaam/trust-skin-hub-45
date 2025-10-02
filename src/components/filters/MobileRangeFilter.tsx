
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

interface MobileRangeFilterProps {
  title: string;
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
  formatLabel?: (value: number) => string;
  presetButtons?: { label: string; action: () => void }[];
  step?: number;
}

const MobileRangeFilter: React.FC<MobileRangeFilterProps> = ({
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
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors min-h-[56px]">
        <h3 className="font-medium text-gray-900 text-lg">{title}</h3>
        <div className="flex items-center gap-3">
          {isActive && (
            <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              {formatLabel(value.min)} - {formatLabel(value.max)}
            </span>
          )}
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-6">
        {/* Current Range Display */}
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {formatLabel(value.min)} - {formatLabel(value.max)}
          </div>
          <div className="text-sm text-gray-500">
            Range: {formatLabel(min)} to {formatLabel(max)}
          </div>
        </div>

        {/* Mobile-optimized slider with larger touch targets */}
        <div className="px-2 py-4">
          <Slider
            value={[value.min, value.max]}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="w-full [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_.slider-track]:h-3"
          />
        </div>

        {/* Mobile-optimized input fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-medium">Minimum</label>
            <Input
              type="number"
              inputMode="numeric"
              value={localMin}
              onChange={handleMinInputChange}
              onBlur={handleInputBlur}
              className="text-lg text-center min-h-[48px]"
              placeholder={min.toString()}
              min={min}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-medium">Maximum</label>
            <Input
              type="number"
              inputMode="numeric"
              value={localMax}
              onChange={handleMaxInputChange}
              onBlur={handleInputBlur}
              className="text-lg text-center min-h-[48px]"
              placeholder={max.toString()}
              min={min}
            />
          </div>
        </div>

        {/* Mobile-optimized preset buttons */}
        {presetButtons.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {presetButtons.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={preset.action}
                className="text-sm font-medium min-h-[48px] justify-center"
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

export default MobileRangeFilter;

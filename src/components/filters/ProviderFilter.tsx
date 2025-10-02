
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PROVIDER_CONFIGS } from '@/types/filters';
import ProviderLogo from '@/components/ui/ProviderLogo';

interface ProviderFilterProps {
  selectedProviders: string[];
  onProviderChange: (providers: string[]) => void;
  providerCounts?: Record<string, number>;
}

const ProviderFilter: React.FC<ProviderFilterProps> = ({
  selectedProviders,
  onProviderChange,
  providerCounts = {}
}) => {
  const handleProviderToggle = (providerId: string, checked: boolean) => {
    if (checked) {
      onProviderChange([...selectedProviders, providerId]);
    } else {
      onProviderChange(selectedProviders.filter(p => p !== providerId));
    }
  };

  const handleSelectAll = () => {
    const allProviders = Object.keys(PROVIDER_CONFIGS);
    onProviderChange(selectedProviders.length === allProviders.length ? [] : allProviders);
  };

  const allProviders = Object.keys(PROVIDER_CONFIGS);
  const isAllSelected = selectedProviders.length === allProviders.length;
  const isPartialSelection = selectedProviders.length > 0 && selectedProviders.length < allProviders.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Mystery Box Providers</h3>
        <button
          onClick={handleSelectAll}
          className="text-xs text-purple-600 hover:text-purple-800 font-medium"
        >
          {isAllSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(PROVIDER_CONFIGS).map(([providerId, config]) => {
          const isSelected = selectedProviders.includes(providerId);
          const count = providerCounts[providerId] || 0;
          
          return (
            <div key={providerId} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`provider-${providerId}`}
                checked={isSelected}
                onCheckedChange={(checked) => handleProviderToggle(providerId, checked as boolean)}
                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
              />
              <label
                htmlFor={`provider-${providerId}`}
                className="flex-1 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <ProviderLogo 
                    providerId={providerId as keyof typeof PROVIDER_CONFIGS} 
                    size="lg"
                    enhanced={true}
                    className="transition-transform hover:scale-110"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-800">
                      {config.displayName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mystery Box Provider
                    </div>
                  </div>
                </div>
                {count > 0 && (
                  <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} text-xs font-medium`}>
                    {count.toLocaleString()}
                  </Badge>
                )}
              </label>
            </div>
          );
        })}
      </div>

      {isPartialSelection && (
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {selectedProviders.length} of {allProviders.length} providers selected
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderFilter;

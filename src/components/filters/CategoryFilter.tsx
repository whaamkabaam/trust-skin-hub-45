
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ScrollableContainer } from '@/components/ui/ScrollableContainer';

interface CategoryFilterProps {
  selectedCategories: string[];
  availableCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  availableCategories,
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    onCategoryChange(availableCategories);
  };

  const handleClearAll = () => {
    onCategoryChange([]);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <h3 className="font-medium text-gray-900">Categories</h3>
        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {selectedCategories.length}
            </span>
          )}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
        <ScrollableContainer maxHeight="max-h-40" className="grid grid-cols-1 gap-2" showIndicators={true}>
          {availableCategories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <span className="text-sm">{category}</span>
            </label>
            ))}
        </ScrollableContainer>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CategoryFilter;


import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { ScrollableContainer } from '@/components/ui/ScrollableContainer';

interface TagsFilterProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TagsFilter: React.FC<TagsFilterProps> = ({
  selectedTags,
  availableTags,
  onTagsChange
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get popular tags (most common ones)
  const popularTags = availableTags.slice(0, 6);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
        <h3 className="font-medium text-gray-900">Tags</h3>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
              {selectedTags.length}
            </span>
          )}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        
        {searchTerm === '' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded text-sm"
                >
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <span>{capitalizeFirstLetter(tag)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {searchTerm ? 'Search Results' : 'All Tags'}
          </h4>
          <ScrollableContainer maxHeight="max-h-40" className="grid grid-cols-1 gap-1" showIndicators={true}>
            {filteredTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <span className="text-sm">{capitalizeFirstLetter(tag)}</span>
              </label>
            ))}
          </ScrollableContainer>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default TagsFilter;

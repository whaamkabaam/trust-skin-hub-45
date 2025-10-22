import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CategorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  categoryName?: string;
}

export const CategorySearch = ({ 
  value, 
  onChange, 
  placeholder,
  categoryName 
}: CategorySearchProps) => {
  const defaultPlaceholder = categoryName 
    ? `Search ${categoryName} cases...` 
    : 'Search cases...';

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="pl-10 bg-background/60 backdrop-blur-sm"
      />
    </div>
  );
};

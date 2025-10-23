import { Badge } from '@/components/ui/badge';
import { Calendar, Package, User, TrendingUp, DollarSign } from 'lucide-react';
import { CategorySearch } from './CategorySearch';

interface CompactHeroProps {
  category: {
    name: string;
    slug: string;
    logo_url?: string;
    description?: string;
    author_name?: string;
    content_updated_at?: string;
  };
  boxCount: number;
  priceRange?: { min: number; max: number };
  avgEV?: number;
  topProviders?: Array<{ name: string; count: number }>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const CompactHero = ({ 
  category, 
  boxCount, 
  priceRange,
  avgEV,
  topProviders,
  searchValue = '',
  onSearchChange
}: CompactHeroProps) => {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const lastUpdated = category.content_updated_at 
    ? new Date(category.content_updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : monthYear;

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-6">
          {/* Category Icon */}
          {category.logo_url && (
            <div className="w-16 h-16 rounded-xl bg-background shadow-sm p-3 flex-shrink-0">
              <img 
                src={category.logo_url} 
                alt={category.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-3 text-foreground">
              Best {category.name} Mystery Boxes ({monthYear})
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              {category.author_name && (
                <>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Written by {category.author_name}</span>
                  </div>
                  <span className="text-border">•</span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Last updated {lastUpdated}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span><strong>{boxCount}</strong> boxes reviewed</span>
              </div>
            </div>

            {/* Subtitle/Description */}
            {category.description && (
              <p className="text-muted-foreground mb-4 max-w-2xl">
                {category.description}
              </p>
            )}

            {/* Search Bar */}
            {onSearchChange && (
              <div className="mb-4">
                <CategorySearch 
                  value={searchValue}
                  onChange={onSearchChange}
                  categoryName={category.name}
                />
              </div>
            )}
            
            {/* Data-Driven Stats Pills */}
            <div className="flex flex-wrap gap-2">
              {priceRange && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${priceRange.min} - ${priceRange.max}
                </Badge>
              )}
              {avgEV && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {avgEV.toFixed(0)}% Avg EV
                </Badge>
              )}
              {topProviders && topProviders.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Top: {topProviders.slice(0, 2).map(p => p.name).join(', ')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

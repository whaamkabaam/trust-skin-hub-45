import { Badge } from '@/components/ui/badge';
import { Calendar, Package, User, TrendingUp, DollarSign } from 'lucide-react';
import { FeaturedBoxCard } from './FeaturedBoxCard';
import { CategorySearch } from './CategorySearch';

interface FeaturedBoxData {
  id: string;
  box_name: string;
  box_image: string;
  box_price: number;
  expected_value_percent_of_price: number;
  description?: string;
  featured_items?: Array<{ name: string; price: number }>;
  provider: string;
  box_url?: string;
}

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
  featuredBox?: FeaturedBoxData;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const CompactHero = ({ 
  category, 
  boxCount, 
  priceRange,
  avgEV,
  topProviders,
  featuredBox,
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Left Side (65%) */}
          <div className="lg:flex-[1.85] min-w-0">
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
          
          {/* Featured Box - Right Side (35%) */}
          {featuredBox ? (
            <div className="lg:flex-1 flex-shrink-0 lg:max-w-[350px]">
              <FeaturedBoxCard box={featuredBox} />
            </div>
          ) : (
            /* Decorative SVG - Right (fallback when no featured box) */
            <div className="hidden lg:block lg:flex-1 flex-shrink-0 lg:max-w-[350px]">
              <svg viewBox="0 0 200 130" className="w-full h-full opacity-30">
                <rect x="20" y="40" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.4"/>
                <rect x="80" y="20" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.6"/>
                <rect x="140" y="50" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.5"/>
                <circle cx="45" cy="30" r="8" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
                <circle cx="105" cy="10" r="6" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
                <circle cx="165" cy="40" r="7" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

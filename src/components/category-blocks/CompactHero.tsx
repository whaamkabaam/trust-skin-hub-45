import { Badge } from '@/components/ui/badge';
import { Calendar, Package, User } from 'lucide-react';

interface CompactHeroProps {
  category: {
    name: string;
    logo_url?: string;
  };
  boxCount: number;
  lastUpdated?: string;
  author?: string;
}

export const CompactHero = ({ category, boxCount, lastUpdated, author }: CompactHeroProps) => {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-6">
          {/* Category Icon - Left */}
          {category.logo_url && (
            <div className="w-16 h-16 rounded-xl bg-background shadow-sm p-3 flex-shrink-0">
              <img 
                src={category.logo_url} 
                alt={category.name} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Content - Center */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-3 text-foreground">
              Best {category.name} Mystery Boxes ({monthYear})
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {author && (
                <>
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span>Written by {author}</span>
                  </div>
                  <span className="text-border">•</span>
                </>
              )}
              {lastUpdated && (
                <>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Last updated {lastUpdated}</span>
                  </div>
                  <span className="text-border">•</span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span><strong>{boxCount}</strong> boxes reviewed</span>
              </div>
            </div>
            
            {/* Quick Stats Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="text-xs">
                Worldwide Shipping
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Verified Items
              </Badge>
              <Badge variant="secondary" className="text-xs">
                24/7 Support
              </Badge>
            </div>
          </div>
          
          {/* Decorative SVG - Right (hidden on mobile) */}
          <div className="hidden lg:block w-48 h-32 flex-shrink-0">
            <svg viewBox="0 0 200 130" className="w-full h-full opacity-30">
              <rect x="20" y="40" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.4"/>
              <rect x="80" y="20" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.6"/>
              <rect x="140" y="50" width="50" height="50" rx="8" fill="currentColor" className="text-primary" opacity="0.5"/>
              <circle cx="45" cy="30" r="8" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
              <circle cx="105" cy="10" r="6" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
              <circle cx="165" cy="40" r="7" fill="currentColor" className="text-gaming-gold" opacity="0.8"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

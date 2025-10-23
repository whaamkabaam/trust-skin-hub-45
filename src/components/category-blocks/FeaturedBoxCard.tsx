import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Star, ExternalLink, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedItem {
  name: string;
  price: number;
  image?: string;
}

interface FeaturedBoxCardProps {
  box: {
    id: string;
    box_name: string;
    box_image: string;
    box_price: number;
    expected_value_percent_of_price: number;
    description?: string;
    featured_items?: FeaturedItem[];
    provider: string;
    box_url?: string;
  };
}

export const FeaturedBoxCard = ({ box }: FeaturedBoxCardProps) => {
  const profitRate = box.expected_value_percent_of_price - 100;
  const isProfit = profitRate >= 0;
  const boxSlug = box.box_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Get top 2 featured items with images for compact display
  const topItems = box.featured_items?.slice(0, 2) || [];

  // Format price for compact display
  const formatCompactPrice = (price: number) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}k`;
    }
    return `$${price.toFixed(0)}`;
  };

  return (
    <Card className="overflow-hidden bg-background/60 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-gaming-gold/20 hover:border-gaming-gold/30 transition-all duration-300 group">
      <CardContent className="p-4">
        {/* Featured Badge - Absolute positioned */}
        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-gaming-gold to-yellow-600 text-white border-0 shadow-lg shadow-gaming-gold/50 text-[10px] px-2 py-0.5">
          <Star className="w-2.5 h-2.5 mr-1 fill-white" />
          Featured
        </Badge>

        {/* MOBILE/TABLET: Vertical Stack */}
        <div className="flex flex-col gap-3 lg:hidden mt-6">
          {/* Box Image */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm p-2 ring-2 ring-white/10 group-hover:ring-gaming-gold/30 transition-all">
              <img 
                src={box.box_image} 
                alt={box.box_name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Box Name & Provider */}
          <div className="text-center">
            <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1">
              {box.box_name}
            </h3>
            <span className="text-xs text-muted-foreground">{box.provider}</span>
          </div>

          {/* Top Items - Horizontal Pills */}
          {topItems.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-600 flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <span className="bg-gradient-to-r from-gaming-gold to-yellow-600 bg-clip-text text-transparent">
                  TOP ITEMS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {topItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-1.5 p-1.5 rounded-full bg-muted/20 border border-white/5"
                  >
                    {item.image && (
                      <div className="w-6 h-6 rounded-full bg-background/50 p-1 ring-1 ring-white/10 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-gaming-gold truncate">
                      {formatCompactPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats & CTA */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <div className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-muted/20">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-sm font-bold text-foreground">
                ${box.box_price != null ? box.box_price.toFixed(0) : '0'}
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-muted/20">
              {isProfit ? (
                <TrendingUp className="w-3 h-3 text-success" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive" />
              )}
              <span className={`text-sm font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                {isProfit ? '+' : ''}{profitRate != null ? profitRate.toFixed(0) : '0'}%
              </span>
            </div>
          </div>

          <Link to={`/mystery-boxes/${boxSlug}`} className="w-full">
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 font-semibold text-xs h-8">
              View Details
              <ExternalLink className="w-3 h-3 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* DESKTOP: Horizontal Layout */}
        <div className="hidden lg:flex lg:items-center lg:gap-4 lg:mt-6">
          {/* Section 1: Box Image (80px) */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm p-3 ring-2 ring-white/10 group-hover:ring-gaming-gold/30 transition-all">
              <img 
                src={box.box_image} 
                alt={box.box_name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Section 2: Box Name & Provider (flex-1) */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-foreground line-clamp-2 mb-1">
              {box.box_name}
            </h3>
            <p className="text-xs text-muted-foreground">{box.provider}</p>
          </div>

          {/* Section 3: Top Items (200px) */}
          {topItems.length > 0 && (
            <div className="w-[200px] flex-shrink-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold mb-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-600 flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <span className="bg-gradient-to-r from-gaming-gold to-yellow-600 bg-clip-text text-transparent">
                  TOP ITEMS
                </span>
              </div>
              {topItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-muted/20 border border-white/5 hover:border-gaming-gold/30 transition-all"
                >
                  {item.image && (
                    <div className="w-6 h-6 rounded-full bg-background/50 p-1 ring-1 ring-white/10 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-medium truncate flex-1">{item.name}</span>
                  <span className="text-xs font-bold text-gaming-gold whitespace-nowrap">
                    {formatCompactPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Section 4: Stats & CTA (150px) */}
          <div className="w-[150px] flex-shrink-0 space-y-2">
            {/* Compact Stats */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/20">
                <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">
                  ${box.box_price != null ? box.box_price.toFixed(0) : '0'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-muted/20">
                {isProfit ? (
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                )}
                <span className={`text-sm font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                  {isProfit ? '+' : ''}{profitRate != null ? profitRate.toFixed(0) : '0'}%
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link to={`/mystery-boxes/${boxSlug}`}>
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 font-semibold text-xs h-8">
                View
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

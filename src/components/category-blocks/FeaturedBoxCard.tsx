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
  layout?: 'sidebar' | 'horizontal-full';
}

const formatCompactPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(1)}k`;
  }
  return `$${price.toLocaleString()}`;
};

export const FeaturedBoxCard = ({ box, layout = 'sidebar' }: FeaturedBoxCardProps) => {
  const profitRate = box.expected_value_percent_of_price - 100;
  const isProfit = profitRate >= 0;
  const boxSlug = box.box_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Get top 2 featured items for horizontal layout
  const topItems = box.featured_items?.slice(0, layout === 'horizontal-full' ? 2 : 3) || [];

  // Sidebar layout (original vertical design)
  if (layout === 'sidebar') {
    return (
      <Card className="overflow-hidden bg-background/60 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-gaming-gold/20 hover:border-gaming-gold/30 transition-all duration-300">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-gaming-gold to-yellow-600 text-white border-0 shadow-lg shadow-gaming-gold/50">
              <Star className="w-3 h-3 mr-1 fill-white" />
              Featured Box
            </Badge>
          </div>
          
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-sm p-3 ring-2 ring-white/10 hover:ring-gaming-gold/30 transition-all">
              <img 
                src={box.box_image} 
                alt={box.box_name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <h3 className="font-bold text-base text-center text-foreground line-clamp-2">
            {box.box_name}
          </h3>

          {topItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gaming-gold to-yellow-600 flex items-center justify-center">
                  <Star className="w-3 h-3 text-white fill-white" />
                </div>
                <span className="bg-gradient-to-r from-gaming-gold to-yellow-600 bg-clip-text text-transparent">
                  TOP JACKPOT ITEMS
                </span>
              </div>
              
              {topItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-background/40 to-background/20 backdrop-blur-sm border border-white/10 p-3 hover:border-gaming-gold/50 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gaming-gold/0 via-gaming-gold/5 to-gaming-gold/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-center gap-3">
                    {item.image && (
                      <div className="w-12 h-12 rounded-lg bg-background/50 p-2 ring-2 ring-white/5 group-hover:ring-gaming-gold/30 transition-all flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain drop-shadow-lg"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-foreground">{item.name}</p>
                      <p className="text-sm font-bold text-gaming-gold">
                        ${item.price != null ? item.price.toLocaleString() : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-3 rounded-lg bg-gradient-to-r from-background/30 to-background/20 border border-white/10">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Box Price</span>
              <span className="text-lg font-bold text-foreground">
                ${box.box_price != null ? box.box_price.toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Expected Value</span>
                <div className="flex items-center gap-1">
                  {isProfit ? (
                    <TrendingUp className="w-3 h-3 text-success" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className={`text-base font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                    {isProfit ? '+' : ''}{profitRate != null ? profitRate.toFixed(1) : '0'}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${isProfit ? 'bg-gradient-to-r from-success to-success/70' : 'bg-gradient-to-r from-destructive to-destructive/70'}`}
                  style={{ width: `${Math.min(Math.abs(profitRate), 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Link to={`/mystery-boxes/${boxSlug}`}>
            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 font-semibold">
              View Full Details
              <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Horizontal full-width layout
  return (
    <Card className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-background/60 via-background/70 to-background/60 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:shadow-gaming-gold/30 hover:border-gaming-gold/40 transition-all duration-300 min-h-[200px]">
      <CardContent className="p-0">
        {/* Featured Badge - Top */}
        <div className="px-6 lg:px-8 pt-6">
          <Badge className="bg-gradient-to-r from-gaming-gold via-yellow-500 to-gaming-gold text-black border-0 shadow-lg shadow-gaming-gold/50 text-sm px-4 py-1.5 font-bold animate-pulse">
            <Star className="w-4 h-4 mr-1.5 fill-black" />
            FEATURED BOX
          </Badge>
        </div>

        {/* Main Horizontal Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8 px-6 lg:px-8 py-6 lg:py-8">
          {/* Section 1: Box Image (128px desktop, 96px mobile) */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm p-4 border-2 border-white/30 shadow-xl group-hover:shadow-gaming-gold/50 group-hover:scale-110 transition-all duration-300">
              <img 
                src={box.box_image} 
                alt={box.box_name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Section 2: Box Info (flex-[3]) */}
          <div className="flex-[3] min-w-0 text-center lg:text-left space-y-3">
            <h3 className="font-extrabold text-2xl lg:text-3xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent line-clamp-2">
              {box.box_name}
            </h3>
            <Badge variant="secondary" className="text-sm px-3 py-1.5 font-semibold">
              {box.provider}
            </Badge>
            {box.description && (
              <p className="text-base text-foreground/70 line-clamp-3">
                {box.description}
              </p>
            )}
          </div>

          {/* Section 3: Top Items (flex-[3]) */}
          {topItems.length > 0 && (
            <div className="flex-[3] min-w-0 space-y-3 w-full lg:w-auto lg:border-l-2 lg:border-white/10 lg:pl-8">
              <Badge variant="outline" className="text-sm font-bold border-gaming-gold/40 text-gaming-gold px-3 py-1.5">
                <Star className="w-5 h-5 mr-1.5 fill-gaming-gold" />
                TOP ITEMS
              </Badge>
              
              <div className="space-y-3">
                {topItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 lg:p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 hover:border-gaming-gold/40 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    {item.image && (
                      <div className="w-10 h-10 rounded-lg bg-white/80 p-1.5 ring-2 ring-white/20 flex-shrink-0 shadow-md">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium truncate flex-1 text-foreground">{item.name}</span>
                    <span className="text-base lg:text-lg font-extrabold bg-gradient-to-r from-gaming-gold to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
                      {formatCompactPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Stats + CTA (w-56) */}
          <div className="w-full lg:w-56 flex-shrink-0 flex flex-row lg:flex-col items-center lg:items-stretch gap-4 lg:gap-5">
            {/* Price */}
            <div className="flex-1 lg:flex-none text-center">
              <div className="text-sm text-muted-foreground mb-2 font-medium">Price</div>
              <div className="text-3xl lg:text-4xl font-black text-foreground drop-shadow-sm">
                ${box.box_price != null ? box.box_price.toFixed(0) : '0'}
              </div>
            </div>
            
            {/* EV */}
            <div className="flex-1 lg:flex-none text-center">
              <div className="text-sm text-muted-foreground mb-2 font-medium">Expected Value</div>
              <div className={`text-2xl lg:text-3xl font-extrabold flex items-center justify-center gap-2 ${
                isProfit ? 'text-green-600' : 'text-red-600'
              }`}>
                {isProfit ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
                {isProfit ? '+' : ''}{profitRate != null ? profitRate.toFixed(1) : '0'}%
              </div>
            </div>
            
            {/* CTA */}
            <Link to={`/mystery-boxes/${boxSlug}`} className="block w-full">
              <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-bold text-base py-6 px-6">
                View Full Details
                <ExternalLink className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

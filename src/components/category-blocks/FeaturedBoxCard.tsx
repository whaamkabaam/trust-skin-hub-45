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

  // Horizontal full-width layout - Premium redesign
  return (
    <Card className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-3xl border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:border-purple-400/50 hover:scale-[1.01] transition-all duration-500 min-h-[280px]">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <CardContent className="p-0 relative z-10">
        {/* Featured Badge - Top Corner */}
        <div className="absolute top-0 right-0 z-20">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg rounded-tl-none rounded-br-none rounded-tr-2xl px-4 py-2 text-sm font-bold animate-pulse">
            🔥 FEATURED
          </Badge>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-10 px-8 lg:px-12 py-8 lg:py-10">
          
          {/* Section 1: Larger Box Image with Glow */}
          <div className="flex-shrink-0">
            <div className="relative group/image">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-2xl group-hover/image:blur-3xl opacity-0 group-hover/image:opacity-100 transition-all duration-500" />
              
              <div className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-6 border-2 border-white/20 shadow-2xl group-hover/image:shadow-purple-500/50 group-hover/image:scale-110 group-hover/image:rotate-3 transition-all duration-500">
                <img 
                  src={box.box_image} 
                  alt={box.box_name}
                  className="w-full h-full object-contain drop-shadow-2xl group-hover/image:drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Box Name & Info - Enhanced Hierarchy */}
          <div className="flex-[3] min-w-0 space-y-4 text-center lg:text-left">
            <div className="space-y-3">
              <h3 className="font-black text-3xl lg:text-5xl leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent line-clamp-2 drop-shadow-lg">
                {box.box_name}
              </h3>
              
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Badge className="text-base px-4 py-2 font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-lg shadow-purple-500/50">
                  {box.provider}
                </Badge>
              </div>
            </div>
            
            {box.description && (
              <p className="text-lg text-foreground/80 line-clamp-2 leading-relaxed">
                {box.description}
              </p>
            )}
          </div>

          {/* Section 3: Top Items - More Visual Drama */}
          {topItems.length > 0 && (
            <div className="flex-[3] min-w-0 space-y-4 w-full lg:w-auto lg:border-l-2 lg:border-purple-500/20 lg:pl-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                  <Star className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  TOP JACKPOTS
                </span>
              </div>
              
              <div className="space-y-3">
                {topItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="group/item flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/50 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    {item.image && (
                      <div className="relative">
                        {/* Rank badge */}
                        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-black z-10 shadow-lg">
                          {idx + 1}
                        </div>
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/20 to-white/10 p-2 ring-2 ring-purple-500/30 group-hover/item:ring-purple-400/60 flex-shrink-0 shadow-lg transition-all">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                    <span className="text-base font-semibold truncate flex-1 text-foreground group-hover/item:text-purple-300 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
                      {formatCompactPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Enhanced Stats + CTA */}
          <div className="w-full lg:w-64 flex-shrink-0 flex flex-col items-stretch gap-5">
            {/* Price Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-purple-500/30 p-6 shadow-xl group-hover:border-purple-400/50 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative space-y-2 text-center">
                <div className="text-sm font-bold text-purple-300 uppercase tracking-wider">Box Price</div>
                <div className="flex items-center justify-center gap-2">
                  <DollarSign className="w-8 h-8 text-green-400" />
                  <div className="text-5xl font-black text-white drop-shadow-lg">
                    {box.box_price != null ? box.box_price.toFixed(0) : '0'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* EV Card with Dynamic Styling */}
            <div className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border-2 p-6 shadow-xl transition-all ${
              isProfit 
                ? 'bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/30 group-hover:border-green-400/50' 
                : 'bg-gradient-to-br from-red-900/90 to-rose-900/90 border-red-500/30 group-hover:border-red-400/50'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current/10 to-transparent rounded-full blur-3xl" />
              <div className="relative space-y-2 text-center">
                <div className="text-sm font-bold uppercase tracking-wider opacity-90">Expected Value</div>
                <div className={`flex items-center justify-center gap-3 ${
                  isProfit ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isProfit ? (
                    <TrendingUp className="w-8 h-8 animate-bounce" />
                  ) : (
                    <TrendingDown className="w-8 h-8 animate-pulse" />
                  )}
                  <div className="text-5xl font-black drop-shadow-2xl">
                    {isProfit ? '+' : ''}{profitRate != null ? profitRate.toFixed(1) : '0'}%
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTA Button with Shimmer */}
            <Link to={`/mystery-boxes/${boxSlug}`} className="block w-full mt-2">
              <Button className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 active:scale-95 transition-all duration-300 font-black text-lg tracking-wide border-2 border-purple-400/50 hover:border-purple-300 group/btn relative overflow-hidden">
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-3">
                  View Full Details
                  <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

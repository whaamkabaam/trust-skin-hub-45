import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, ExternalLink, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedMysteryBoxCardProps {
  box: {
    id: string | number;
    box_name: string;
    box_price: number;
    box_image: string;
    box_url?: string;
    provider?: string;
    expected_value_percent?: number;
    ev_to_price_ratio?: number;
    volatility_bucket?: string;
    tags?: string[];
  };
  featured?: boolean;
  showRibbon?: 'NEW' | 'SALE' | 'HOT' | null;
}

export const EnhancedMysteryBoxCard = ({ 
  box, 
  featured = false, 
  showRibbon = null 
}: EnhancedMysteryBoxCardProps) => {
  const boxLink = box.box_url || `/mystery-boxes/${box.provider}/${box.id}`;
  const evPercent = box.expected_value_percent || 0;
  const isGoodValue = evPercent > 100;
  
  // Determine provider logo
  const getProviderLogo = (provider?: string) => {
    if (!provider) return null;
    const providerLower = provider.toLowerCase();
    return `/img/operators/${providerLower}.png`;
  };

  // Volatility color
  const getVolatilityColor = (volatility?: string) => {
    switch (volatility?.toLowerCase()) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <a
      href={boxLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block rounded-xl overflow-hidden border border-border bg-card",
        "transition-all duration-300 hover:shadow-elevated hover:-translate-y-2",
        "hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
        featured && "md:col-span-2 md:row-span-2"
      )}
    >
      {/* Ribbon Badge */}
      {showRibbon && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className={cn(
            "font-bold shadow-lg",
            showRibbon === 'NEW' && "bg-gaming-cyan text-white",
            showRibbon === 'SALE' && "bg-gaming-orange text-white",
            showRibbon === 'HOT' && "bg-destructive text-white"
          )}>
            <Sparkles className="w-3 h-3 mr-1" />
            {showRibbon}
          </Badge>
        </div>
      )}

      {/* Provider Logo Badge */}
      {box.provider && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md border border-border">
            <span className="text-xs font-medium">{box.provider}</span>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden bg-muted",
        featured ? "h-64" : "h-48"
      )}>
        <img
          src={box.box_image}
          alt={box.box_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Stats Overlay (visible on hover) */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {evPercent > 0 && (
            <Badge className={cn(
              "backdrop-blur-sm",
              isGoodValue ? "bg-success/90 text-white" : "bg-background/90"
            )}>
              <TrendingUp className="w-3 h-3 mr-1" />
              EV {evPercent.toFixed(0)}%
            </Badge>
          )}
          {box.volatility_bucket && (
            <Badge className={cn("backdrop-blur-sm", getVolatilityColor(box.volatility_bucket))}>
              {box.volatility_bucket}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn(
          "font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors",
          featured ? "text-xl" : "text-base"
        )}>
          {box.box_name}
        </h3>

        {/* Price & Value */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${box.box_price.toFixed(2)}
            </span>
            {box.ev_to_price_ratio && box.ev_to_price_ratio > 1 && (
              <span className="text-xs text-success font-medium">
                +{((box.ev_to_price_ratio - 1) * 100).toFixed(0)}% value
              </span>
            )}
          </div>
          
          {/* Mock Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-gaming-gold text-gaming-gold" />
            <span className="text-sm font-semibold">4.{Math.floor(Math.random() * 3 + 6)}</span>
          </div>
        </div>

        {/* Tags */}
        {box.tags && box.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {box.tags.slice(0, 3).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:scale-105 transition-all"
          size={featured ? "default" : "sm"}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Box
        </Button>
      </div>
    </a>
  );
};

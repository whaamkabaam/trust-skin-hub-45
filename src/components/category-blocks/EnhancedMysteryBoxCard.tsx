import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Verified, TrendingUp, ExternalLink, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedMysteryBoxCardProps {
  box: {
    id: string;
    name: string;
    image_url?: string;
    price: number;
    expected_value?: number;
    profit_rate?: number;
    verified?: boolean;
    operator?: {
      name: string;
      logo_url?: string;
    };
  };
  isBestValue?: boolean;
}

export const EnhancedMysteryBoxCard = ({ box, isBestValue }: EnhancedMysteryBoxCardProps) => {
  const evPercent = box.expected_value && box.price 
    ? ((box.expected_value / box.price) * 100) 
    : null;
  
  const profitRate = box.profit_rate || (evPercent ? evPercent - 100 : null);

  return (
    <Card className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1 relative overflow-hidden">
      {isBestValue && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gaming-gold to-primary z-10">
          <div className="flex items-center justify-center gap-1 py-1 text-xs font-semibold text-white">
            <Award className="w-3 h-3" />
            BEST VALUE
          </div>
        </div>
      )}
      
      <div className={cn("relative overflow-hidden aspect-square", isBestValue && "mt-7")}>
        {box.image_url ? (
          <img 
            src={box.image_url} 
            alt={box.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
            <div className="text-4xl opacity-20">📦</div>
          </div>
        )}
        
        {box.verified && (
          <Badge className="absolute top-3 left-3 bg-success">
            <Verified className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
        
        {box.operator?.logo_url && (
          <div className="absolute top-3 right-3 w-10 h-10 bg-background rounded-full p-1.5 shadow-md">
            <img 
              src={box.operator.logo_url} 
              alt={box.operator.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {box.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {box.operator?.name || 'Unknown Operator'}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              ${box.price.toFixed(2)}
            </div>
            {evPercent && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Expected Value</div>
                <div className={cn(
                  "font-semibold flex items-center gap-1",
                  profitRate && profitRate > 0 ? "text-success" : "text-muted-foreground"
                )}>
                  <TrendingUp className="w-3 h-3" />
                  {evPercent.toFixed(0)}%
                </div>
              </div>
            )}
          </div>
          
          {profitRate !== null && (
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-md text-center",
              profitRate > 10 ? "bg-success/10 text-success" :
              profitRate > 0 ? "bg-primary/10 text-primary" :
              "bg-muted text-muted-foreground"
            )}>
              {profitRate > 0 ? '+' : ''}{profitRate.toFixed(1)}% ROI
            </div>
          )}
          
          <Button variant="default" size="sm" className="w-full group/btn">
            <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 transition-transform" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

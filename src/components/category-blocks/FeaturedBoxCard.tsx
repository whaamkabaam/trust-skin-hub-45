import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, ExternalLink, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedItem {
  name: string;
  price: number;
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
  const boxSlug = box.box_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-3 space-y-2.5">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-gaming-gold text-gaming-gold-foreground text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>

        {/* Box Image */}
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted max-h-32">
          <img
            src={box.box_image} 
            alt={box.box_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Box Info */}
        <div className="space-y-1">
          <h3 className="font-bold text-base leading-tight">{box.box_name}</h3>
          {box.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {box.description}
            </p>
          )}
        </div>

        {/* Featured Items */}
        {box.featured_items && box.featured_items.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Top Items</p>
            <div className="space-y-0.5">
              {box.featured_items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 text-xs">{item.name}</span>
                  <span className="font-semibold text-gaming-gold ml-2 text-xs">
                    ${item.price != null ? item.price.toFixed(0) : '0'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price & EV */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-base font-bold flex items-center">
              <DollarSign className="w-3 h-3" />
              {box.box_price != null ? box.box_price.toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">EV</p>
            <p className={`text-base font-bold ${profitRate >= 0 ? 'text-success' : 'text-destructive'}`}>
              {profitRate >= 0 ? '+' : ''}{profitRate != null ? profitRate.toFixed(0) : '0'}%
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link to={`/mystery-boxes/${boxSlug}`}>
          <Button className="w-full" size="sm">
            View Details
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

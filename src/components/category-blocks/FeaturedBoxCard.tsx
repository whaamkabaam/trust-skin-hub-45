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
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="p-6 space-y-4">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-gaming-gold text-gaming-gold-foreground">
            <TrendingUp className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>

        {/* Box Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <img 
            src={box.box_image} 
            alt={box.box_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Box Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{box.box_name}</h3>
          {box.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {box.description}
            </p>
          )}
        </div>

        {/* Featured Items */}
        {box.featured_items && box.featured_items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Featured Items</p>
            <div className="space-y-1.5">
              {box.featured_items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1">{item.name}</span>
                  <span className="font-semibold text-gaming-gold ml-2">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price & EV */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Case Price</p>
            <p className="text-xl font-bold flex items-center">
              <DollarSign className="w-4 h-4" />
              {box.box_price.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Expected Value</p>
            <p className={`text-xl font-bold ${profitRate >= 0 ? 'text-success' : 'text-destructive'}`}>
              {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(0)}%
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link to={`/mystery-boxes/${boxSlug}`}>
          <Button className="w-full" size="lg">
            View Case Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

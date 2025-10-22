import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, DollarSign, Package } from 'lucide-react';

interface AtAGlanceCardProps {
  categoryName: string;
  stats: {
    totalBoxes: number;
    priceRange: { min: number; max: number };
    avgEV: number;
    topProvider: string;
  };
}

export const AtAGlanceCard = ({ categoryName, stats }: AtAGlanceCardProps) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          {categoryName} At a Glance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-background">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalBoxes}</div>
              <div className="text-xs text-muted-foreground">Total Boxes</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-background">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">${stats.priceRange.min.toFixed(0)}-${stats.priceRange.max.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Price Range</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-background">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.avgEV.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Avg Expected Value</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-background">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold truncate">{stats.topProvider}</div>
              <div className="text-xs text-muted-foreground">Top Provider</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              Updated Daily
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Verified Odds
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Expert Reviewed
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

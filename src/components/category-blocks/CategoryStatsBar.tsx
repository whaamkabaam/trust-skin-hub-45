import { Package, DollarSign, TrendingUp, Award } from 'lucide-react';

interface CategoryStatsBarProps {
  stats: {
    totalBoxes: number;
    avgPrice: number;
    bestEV?: number;
  };
}

export const CategoryStatsBar = ({ stats }: CategoryStatsBarProps) => {
  return (
    <div className="bg-gradient-to-r from-muted/30 to-muted/10 border-y py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Cases */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-primary mr-2" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {stats.totalBoxes}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Cases
            </div>
          </div>

          {/* Avg Price */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              ${stats.avgPrice != null ? stats.avgPrice.toFixed(2) : '0.00'}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg. Price
            </div>
          </div>

          {/* Best EV */}
          {stats.bestEV !== undefined && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-success mr-2" />
              </div>
              <div className="text-3xl font-bold text-success mb-1">
                {stats.bestEV > 0 ? '+' : ''}{stats.bestEV != null ? stats.bestEV.toFixed(0) : '0'}%
              </div>
              <div className="text-sm text-muted-foreground">
                Best EV
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

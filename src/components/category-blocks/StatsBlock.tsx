import { Card } from '@/components/ui/card';
import { Package, TrendingUp, Star, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsBlockProps {
  data: {
    title?: string;
    stats: Array<{
      label: string;
      value: string;
      icon?: string;
      change?: string;
      changeType?: 'positive' | 'negative' | 'neutral';
    }>;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

const iconMap: Record<string, any> = {
  Package,
  TrendingUp,
  Star,
  DollarSign,
};

export const StatsBlock = ({ data = { stats: [] }, isEditing = false }: StatsBlockProps) => {
  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Stats Block</h3>
        <p className="text-sm text-muted-foreground">
          Configure stats in the block data JSON
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-muted/30">
      {data.title && (
        <h2 className="text-3xl font-bold mb-8 text-center">{data.title}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.stats.map((stat, idx) => {
          const Icon = stat.icon ? iconMap[stat.icon] : Package;
          
          return (
            <Card
              key={idx}
              className="p-6 text-center hover:shadow-elevated transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              
              <div className="text-sm text-muted-foreground mb-2">
                {stat.label}
              </div>
              
              {stat.change && (
                <div className={cn(
                  "text-xs font-medium",
                  stat.changeType === 'positive' && "text-success",
                  stat.changeType === 'negative' && "text-destructive",
                  stat.changeType === 'neutral' && "text-muted-foreground"
                )}>
                  {stat.change}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

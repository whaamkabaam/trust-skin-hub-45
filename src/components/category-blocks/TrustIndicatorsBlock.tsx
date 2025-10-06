import { Card } from '@/components/ui/card';
import { Shield, Truck, Clock, Award, CheckCircle, Users } from 'lucide-react';

interface TrustIndicatorsBlockProps {
  data: {
    title?: string;
    indicators: Array<{
      icon?: string;
      text: string;
      description?: string;
    }>;
  };
  onChange?: (data: any) => void;
  isEditing?: boolean;
}

const iconMap: Record<string, any> = {
  Shield,
  Truck,
  Clock,
  Award,
  CheckCircle,
  Users,
};

export const TrustIndicatorsBlock = ({ 
  data = { indicators: [] }, 
  isEditing = false 
}: TrustIndicatorsBlockProps) => {
  if (isEditing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trust Indicators Block</h3>
        <p className="text-sm text-muted-foreground">
          Configure trust indicators in the block data JSON
        </p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-muted/20">
      {data.title && (
        <h2 className="text-2xl font-bold mb-8 text-center">{data.title}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {data.indicators.map((indicator, idx) => {
          const Icon = indicator.icon ? iconMap[indicator.icon] : CheckCircle;

          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-3 p-4 hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-sm">{indicator.text}</p>
                {indicator.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {indicator.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
